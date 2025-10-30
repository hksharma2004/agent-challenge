import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { supabase } from '@/lib/supabase'; 

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
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', reviewerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch username: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { username: data.username };
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
    const { data, error } = await supabase
      .from('profiles')
      .select('reputation')
      .eq('id', reviewerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch reputation: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { reputation_score: data.reputation };
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
    const { data, error } = await supabase
      .from('profiles')
      .select('languages')
      .eq('id', reviewerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch language expertise: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { language_expertise: data.languages || [] };
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
    const { data, error } = await supabase
      .from('profiles')
      .select('availability')
      .eq('id', reviewerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch availability: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { is_available: data.availability };
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
    const { data, error } = await supabase
      .from('profiles')
      .select('creditsstaked')
      .eq('id', reviewerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch staked credits: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Reviewer with ID ${reviewerId} not found.`);
    }
    return { staked_credits: data.creditsstaked };
  },
});
