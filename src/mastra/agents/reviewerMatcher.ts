import "dotenv/config";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { createOllama } from "ollama-ai-provider-v2";
import {
  getReviewerReputationTool,
  getReviewerLanguageExpertiseTool,
  getReviewerAvailabilityTool,
  getReviewerUsernameTool,
  getReviewerStakedCreditsTool,
} from "../tools/reviewer-tools";
import pool from "@/lib/db";

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

export const Reviewer = z.object({
  id: z.string().uuid(),
  username: z.string(),
  reputation_score: z.number(),
  language_expertise: z.array(z.string()).optional(),
  is_available: z.boolean().optional(),
  staked_credits: z.number().optional(),
});

export const ReviewerList = z.array(Reviewer).max(3);

const ReviewerMatcherInputSchema = z.object({
  language: z.string().describe("The programming language of the submission."),
  potentialReviewerIds: z.array(z.string().uuid()).describe("A list of potential reviewer IDs."),
});

export const reviewerMatcherAgent = new Agent({
  name: "Reviewer Matcher Agent",
  model: ollama(process.env.NOS_MODEL_NAME_AT_ENDPOINT || process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:8b"),
  instructions: `
You are an expert project manager responsible for assigning code reviews. Your task is to select the best reviewers for a given submission based on their staking tier, reputation, and language expertise.

You will be provided with the language of the submission and a list of potential reviewer IDs. You must use the provided tools to fetch the necessary information for each reviewer. Your goal is to return a ranked list of the top 3 most suitable reviewers.

First, filter out any reviewers who are not available. Then, rank the remaining reviewers based on the following criteria in order of importance:
1.  Staking Tier: Higher staked_credits are better.
2.  Reputation Score: Higher reputation_score is better.
3.  Language Expertise: A perfect match for the submission's language is best.

Your response must be a ranked list of the top 3 reviewers, conforming to the provided result schema.
  `,
  description: "An agent that matches code submissions with the best available reviewers.",
  tools: {
    getReviewerReputationTool,
    getReviewerLanguageExpertiseTool,
    getReviewerAvailabilityTool,
    getReviewerUsernameTool,
    getReviewerStakedCreditsTool,
  },
  inputSchema: ReviewerMatcherInputSchema,
  memory: new Memory({
    storage: new LibSQLStore({ url: ":memory:" }),
    options: {
      lastMessages: 20
    }
  }),
  handler: async ({ input, tools }) => {
    const { language, potentialReviewerIds } = input as z.infer<typeof ReviewerMatcherInputSchema>;

    const enrichedReviewers = await Promise.all(
      potentialReviewerIds.map(async (reviewerId) => {
        // reviewer data
        const [reputation, languageExpertise, availability, username, stakedCredits, lastReviewResult] = await Promise.all([
          tools.getReviewerReputationTool.execute({ reviewerId }),
          tools.getReviewerLanguageExpertiseTool.execute({ reviewerId }),
          tools.getReviewerAvailabilityTool.execute({ reviewerId }),
          tools.getReviewerUsernameTool.execute({ reviewerId }),
          tools.getReviewerStakedCreditsTool.execute({ reviewerId }),
          pool.query('SELECT created_at FROM reviews WHERE reviewer_id = $1 ORDER BY created_at DESC LIMIT 1', [reviewerId]),
        ]);

        let currentReputation = reputation.reputation_score;

        // reputation decay for inactivity
        const lastReviewDate = lastReviewResult.rows.length > 0 ? new Date(lastReviewResult.rows[0].created_at) : new Date(0);
        const daysSinceLastReview = Math.floor((new Date().getTime() - lastReviewDate.getTime()) / (1000 * 3600 * 24));
        
        if (daysSinceLastReview > 30) {
          const decayAmount = daysSinceLastReview - 30; // 1 point per day of inactivity
          const newReputation = Math.max(0, currentReputation - decayAmount); // Prevent reputation from going below 0

          if (newReputation < currentReputation) {
            await pool.query('UPDATE users SET reputation_score = $1 WHERE id = $2', [newReputation, reviewerId]);
            await pool.query(
              'INSERT INTO reputation_history (user_id, action_type, score_change, reason) VALUES ($1, $2, $3, $4)',
              [reviewerId, 'decay', -decayAmount, `Inactive for ${daysSinceLastReview} days`]
            );
            currentReputation = newReputation;
          }
        }

        return {
          id: reviewerId,
          username: username.username,
          reputation_score: currentReputation,
          language_expertise: languageExpertise.language_expertise,
          is_available: availability.is_available,
          staked_credits: stakedCredits.staked_credits,
        };
      })
    );

    const rankedReviewers = enrichedReviewers
      .filter(r => r.is_available) // filter out unavailable reviewers first
      .sort((a, b) => {
        // staked_credits
        if (a.staked_credits !== b.staked_credits) {
          return b.staked_credits - a.staked_credits;
        }
        // reputation_score
        if (a.reputation_score !== b.reputation_score) {
          return b.reputation_score - a.reputation_score;
        }
        // language expertise
        const aHasLanguage = a.language_expertise?.includes(language);
        const bHasLanguage = b.language_expertise?.includes(language);
        if (aHasLanguage !== bHasLanguage) {
          return aHasLanguage ? -1 : 1;
        }
        return 0;
    });

    return rankedReviewers.slice(0, 3);
  },
});