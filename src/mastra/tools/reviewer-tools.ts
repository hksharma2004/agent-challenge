import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import pool from '@/lib/db'; 

export const getReviewerUsernameTool = createTool({
  id: 'get-reviewer-username',
  description: 'Retrieves the username for a given reviewer ID.',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer'),
  }),
  outputSchema: z.object({
    username: z.string().describe('The username of the reviewer'),
  }),
  execute: async ({ context }) => {
    const { reviewerId } = context;
    const { rows } = await pool.query(
      'SELECT username FROM users WHERE id = $1',
      [reviewerId]
    );

    if (rows.length === 0) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { username: rows[0].username };
  },
});

export const getReviewerReputationTool = createTool({
  id: 'get-reviewer-reputation',
  description: 'Retrieves the reputation score for a given reviewer ID.',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer'),
  }),
  outputSchema: z.object({
    reputation_score: z.number().describe('The reputation score of the reviewer'),
  }),
  execute: async ({ context }) => {
    const { reviewerId } = context;
    const { rows } = await pool.query(
      'SELECT reputation_score FROM users WHERE id = $1',
      [reviewerId]
    );

    if (rows.length === 0) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { reputation_score: rows[0].reputation_score };
  },
});

export const getReviewerLanguageExpertiseTool = createTool({
  id: 'get-reviewer-language-expertise',
  description: 'Retrieves the language expertise for a given reviewer ID.',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer'),
  }),
  outputSchema: z.object({
    language_expertise: z.array(z.string()).optional().describe('An array of languages the reviewer is proficient in'),
  }),
  execute: async ({ context }) => {
    const { reviewerId } = context;
    const { rows } = await pool.query(
      'SELECT language_expertise FROM users WHERE id = $1',
      [reviewerId]
    );

    if (rows.length === 0) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { language_expertise: rows[0].language_expertise || [] };
  },
});

export const getReviewerAvailabilityTool = createTool({
  id: 'get-reviewer-availability',
  description: 'Retrieves the availability status for a given reviewer ID.',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer'),
  }),
  outputSchema: z.object({
    is_available: z.boolean().describe('The availability status of the reviewer'),
  }),
  execute: async ({ context }) => {
    const { reviewerId } = context;
    const { rows } = await pool.query(
      'SELECT is_available FROM users WHERE id = $1',
      [reviewerId]
    );

    if (rows.length === 0) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { is_available: rows[0].is_available };
  },
});

export const getReviewerStakedCreditsTool = createTool({
  id: 'get-reviewer-staked-credits',
  description: 'Retrieves the staked credits for a given reviewer ID.',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer'),
  }),
  outputSchema: z.object({
    staked_credits: z.number().describe('The staked credits of the reviewer'),
  }),
  execute: async ({ context }) => {
    const { reviewerId } = context;
    const { rows } = await pool.query(
      'SELECT staked_credits FROM users WHERE id = $1',
      [reviewerId]
    );

    if (rows.length === 0) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { staked_credits: rows[0].staked_credits };
  },
});

