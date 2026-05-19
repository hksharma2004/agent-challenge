import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  getReviewerReputationTool,
  getReviewerLanguageExpertiseTool,
  getReviewerAvailabilityTool,
  getReviewerUsernameTool,
} from '../tools/reviewer-tools';

export const reviewerInfoWorkflow = createWorkflow({
  id: 'reviewer-info-workflow',
  inputSchema: z.object({
    reviewerId: z.string().uuid().describe('The ID of the reviewer to retrieve information for.'),
  }),
  outputSchema: z.object({
    username: z.string().optional().describe('The username of the reviewer.'),
    reputation: z.number().optional().describe('The reputation score of the reviewer.'),
    languages: z.array(z.string()).optional().describe('The language expertise of the reviewer.'),
    availability: z.string().optional().describe('The availability status of the reviewer.'),
  }),
})
.then(
  createStep({
    id: 'get-reputation-step',
    inputSchema: z.object({
      reviewerId: z.string().uuid(),
    }),
    outputSchema: z.object({
      reviewerId: z.string().uuid(), 
      reputation: z.number().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      try {
        const result = await getReviewerReputationTool.execute({
          context: { reviewerId: inputData.reviewerId },
          runtimeContext,
        });
        return { reviewerId: inputData.reviewerId, reputation: result.reputation_score, success: true };
      } catch (error: any) {
        return { reviewerId: inputData.reviewerId, success: false, error: error.message || 'Failed to get reviewer reputation' };
      }
    },
  })
)
.then(
  createStep({
    id: 'get-language-expertise-step',
    inputSchema: z.object({
      reviewerId: z.string().uuid(),
      reputation: z.number().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      reviewerId: z.string().uuid(), 
      languageExpertise: z.array(z.string()).optional(),
      reputation: z.number().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      if (!inputData.success) {
        return inputData;
      }
      try {
        const result = await getReviewerLanguageExpertiseTool.execute({
          context: { reviewerId: inputData.reviewerId },
          runtimeContext,
        });
        return { ...inputData, languageExpertise: result.language_expertise, success: true };
      } catch (error: any) {
        return { ...inputData, success: false, error: error.message || 'Failed to get reviewer language expertise' };
      }
    },
  })
)
.then(
  createStep({
    id: 'get-availability-step',
    inputSchema: z.object({
      reviewerId: z.string().uuid(),
      reputation: z.number().optional(),
      languageExpertise: z.array(z.string()).optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      reviewerId: z.string().uuid(), 
      availability: z.boolean().optional(),
      reputation: z.number().optional(),
      languageExpertise: z.array(z.string()).optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      if (!inputData.success) {
        return inputData;
      }
      try {
        const result = await getReviewerAvailabilityTool.execute({
          context: { reviewerId: inputData.reviewerId },
          runtimeContext,
        });
        return { ...inputData, availability: result.is_available, success: true };
      } catch (error: any) {
        return { ...inputData, success: false, error: error.message || 'Failed to get reviewer availability' };
      }
    },
  })
)
.then(
  createStep({
    id: 'get-username-step',
    inputSchema: z.object({
      reviewerId: z.string().uuid(),
      reputation: z.number().optional(),
      languageExpertise: z.array(z.string()).optional(),
      availability: z.boolean().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      reviewerId: z.string().uuid(), 
      username: z.string().optional(),
      reputation: z.number().optional(),
      languageExpertise: z.array(z.string()).optional(),
      availability: z.boolean().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      if (!inputData.success) {
        return inputData;
      }
      try {
        const result = await getReviewerUsernameTool.execute({
          context: { reviewerId: inputData.reviewerId },
          runtimeContext,
        });
        return { ...inputData, username: result.username, success: true };
      } catch (error: any) {
        return { ...inputData, success: false, error: error.message || 'Failed to get reviewer username' };
      }
    },
  })
)
.then(
  createStep({
    id: 'format-reviewer-info-step',
    inputSchema: z.object({
      reviewerId: z.string().uuid(),
      reputation: z.number().optional(),
      languageExpertise: z.array(z.string()).optional(),
      availability: z.boolean().optional(),
      username: z.string().optional(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      reputation: z.number().optional(),
      languages: z.array(z.string()).optional(),
      availability: z.string().optional(),
      username: z.string().optional(),
    }),
    execute: async ({ inputData }) => {
      if (!inputData.success) {

        return {
          username: inputData.username,
          reputation: inputData.reputation,
          languages: inputData.languageExpertise,
          availability: inputData.availability ? 'Available' : 'Unavailable',
        };
      }
      return {
        username: inputData.username,
        reputation: inputData.reputation,
        languages: inputData.languageExpertise,
        availability: inputData.availability ? 'Available' : 'Unavailable',
      };
    },
  })
)
.commit();
