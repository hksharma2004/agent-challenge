import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  securityAuditAgent,
  performanceAgent,
  testCoverageAgent,
  docsAgent,
  architectureAgent,
  InlineCommentSchema
} from '../agents/specialists';

const diffExtractStep = createStep({
  id: 'diff-extract',
  inputSchema: z.object({
    repoUrl: z.string().url().describe('PR URL e.g. https://github.com/owner/repo/pull/1'),
    githubToken: z.string().optional(),
  }),
  outputSchema: z.object({
    diff: z.string(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    try {
      const match = inputData.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
      if (!match) {
        throw new Error('Invalid PR URL format. Must be like https://github.com/owner/repo/pull/123');
      }
      const [, owner, repo, pull] = match;
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3.diff',
        'User-Agent': 'Mastra-PR-Reviewer'
      };
      if (inputData.githubToken) {
        headers['Authorization'] = `token ${inputData.githubToken}`;
      }
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.statusText}`);
      }
      
      const diff = await response.text();
      return { diff, success: true };
    } catch (e: any) {
      return { diff: '', success: false, error: e.message };
    }
  }
});

const fanOutStep = createStep({
  id: 'fan-out',
  inputSchema: z.object({
    diff: z.string(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    securityComments: z.any(),
    performanceComments: z.any(),
    testCoverageComments: z.any(),
    docsComments: z.any(),
    architectureComments: z.any(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData.success || !inputData.diff) {
      return {
        securityComments: null, performanceComments: null, testCoverageComments: null, docsComments: null, architectureComments: null,
        success: false, error: inputData.error
      };
    }

    try {
      const prompt = `Review the following GitHub PR diff:\n\n${inputData.diff}`;

      const options = {
        output: InlineCommentSchema,
      };

      const [
        securityRes,
        performanceRes,
        testCoverageRes,
        docsRes,
        architectureRes
      ] = await Promise.all([
        securityAuditAgent.generate(prompt, options),
        performanceAgent.generate(prompt, options),
        testCoverageAgent.generate(prompt, options),
        docsAgent.generate(prompt, options),
        architectureAgent.generate(prompt, options),
      ]);

      return {
        securityComments: securityRes.object,
        performanceComments: performanceRes.object,
        testCoverageComments: testCoverageRes.object,
        docsComments: docsRes.object,
        architectureComments: architectureRes.object,
        success: true,
      };
    } catch (e: any) {
       return {
        securityComments: null, performanceComments: null, testCoverageComments: null, docsComments: null, architectureComments: null,
        success: false, error: e.message
      };     
    }
  }
});

const inlineCommentFormatterStep = createStep({
  id: 'inline-comment-formatter',
  inputSchema: z.object({
    securityComments: z.any(),
    performanceComments: z.any(),
    testCoverageComments: z.any(),
    docsComments: z.any(),
    architectureComments: z.any(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    comments: z.array(z.any()),
    success: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData.success) {
      return { comments: [], success: false };
    }
    
    // Check if .object or direct object based on LLM response parsing logic
    const extractComments = (res: any) => {
      if (!res) return [];
      if (res.comments) return res.comments;
      if (res.object && res.object.comments) return res.object.comments;
      return [];
    };

    const allComments = [
      ...extractComments(inputData.securityComments),
      ...extractComments(inputData.performanceComments),
      ...extractComments(inputData.testCoverageComments),
      ...extractComments(inputData.docsComments),
      ...extractComments(inputData.architectureComments),
    ];
    
    return { comments: allComments, success: true };
  }
});

export const prReviewWorkflow = createWorkflow({
  id: 'pr-review-workflow',
  inputSchema: z.object({
    repoUrl: z.string().url(),
    githubToken: z.string().optional(),
  }),
  outputSchema: z.object({
    comments: z.array(z.any()),
    success: z.boolean(),
    error: z.string().optional(),
  })
})
.then(diffExtractStep)
.then(fanOutStep)
.then(inlineCommentFormatterStep)
.commit();
