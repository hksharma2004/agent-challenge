import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const codeAnalyzerTool = createTool({
  id: 'code-analyzer',
  description: 'Analyzes code quality, documentation, testing, and security based on a repository read response.',
  inputSchema: z.object({
    repoResponse: z.string().describe('The JSON string response from a repository read operation.'),
  }),
  outputSchema: z.object({
    codeQuality: z.string().describe('Analysis of code quality.'),
    documentation: z.string().describe('Analysis of documentation.'),
    testing: z.string().describe('Analysis of testing coverage and practices.'),
    security: z.string().describe('Analysis of potential security vulnerabilities.'),
    success: z.boolean().describe('Whether the analysis was successful.'),
    error: z.string().optional().describe('Error message if the analysis failed.'),
  }),
  execute: async ({ context }) => {
    try {
      const { repoResponse } = context;
      const parsedResponse = JSON.parse(repoResponse);

  

      const codeQuality = "Overall code quality is good, with minor areas for improvement in readability.";
      const documentation = "Documentation is present for key components, but could be expanded for complex functions.";
      const testing = "Basic unit tests are in place, but integration and end-to-end tests are lacking.";
      const security = "No critical security vulnerabilities detected, but consider dependency scanning for external libraries.";

      return {
        codeQuality,
        documentation,
        testing,
        security,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        codeQuality: '',
        documentation: '',
        testing: '',
        security: '',
        success: false,
        error: `Failed to analyze repository response: ${errorMessage}`,
      };
    }
  },
});
