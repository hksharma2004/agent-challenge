import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { repositoryClonerTool } from '../tools/repository';
import { repositoryReaderTool } from '../tools/repository-reader-tool';
import { jsonFormatterTool } from '../tools/json-formatter-tool';
import { codeAnalyzerTool } from '../tools/code-analyzer-tool';

export const repoAnalysisWorkflow = createWorkflow({
  id: 'repo-analysis-workflow',
  inputSchema: z.object({
    repoUrl: z.string().url().describe('The URL of the GitHub repository to clone and analyze'),
    githubToken: z.string().optional().describe('GitHub Personal Access Token (PAT) for private repositories'),
  }),
  outputSchema: z.object({
    codeQuality: z.string().describe('Analysis of code quality.'),
    documentation: z.string().describe('Analysis of documentation.'),
    testing: z.string().describe('Analysis of testing coverage and practices.'),
    security: z.string().describe('Analysis of potential security vulnerabilities.'),
    formattedContent: z.string().describe('The formatted JSON string of the repository content.'),
    success: z.boolean().describe('Whether the operation was successful'),
    error: z.string().optional().describe('Error message if the operation failed'),
  }),
})
.then(
  createStep({
    id: 'clone-repo-step',
    inputSchema: z.object({
      repoUrl: z.string().url(),
      githubToken: z.string().optional(),
    }),
    outputSchema: z.object({
      path: z.string(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      const result = await repositoryClonerTool.execute({
        context: { url: inputData.repoUrl, token: inputData.githubToken },
        runtimeContext,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to clone repository');
      }
      return result;
    },
  })
)
.then(
  createStep({
    id: 'read-repo-step',
    inputSchema: z.object({
      path: z.string(), 
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      files: z.array(z.object({
        path: z.string(),
        content: z.string(),
      })),
      content: z.string(),
      fileCount: z.number(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      const result = await repositoryReaderTool.execute({
        context: { repoPath: inputData.path },
        runtimeContext,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to read repository');
      }
      return result;
    },
  })
)
.then(
  createStep({
    id: 'analyze-code-step',
    inputSchema: z.object({
      files: z.array(z.object({
        path: z.string(),
        content: z.string(),
      })),
      content: z.string(),
      fileCount: z.number(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      codeQuality: z.string(),
      documentation: z.string(),
      testing: z.string(),
      security: z.string(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      const result = await codeAnalyzerTool.execute({
        context: { repoResponse: JSON.stringify(inputData) },
        runtimeContext,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze code');
      }
      return result;
    },
  })
)
.then(
  createStep({
    id: 'format-json-step',
    inputSchema: z.object({
      codeQuality: z.string(),
      documentation: z.string(),
      testing: z.string(),
      security: z.string(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    outputSchema: z.object({
      formattedContent: z.string(),
      codeQuality: z.string(),
      documentation: z.string(),
      testing: z.string(),
      security: z.string(),
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ inputData, runtimeContext }) => {
      const result = await jsonFormatterTool.execute({
        context: { data: { 
          codeQuality: inputData.codeQuality,
          documentation: inputData.documentation,
          testing: inputData.testing,
          security: inputData.security,
        } },
        runtimeContext,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to format JSON');
      }
      return { 
        formattedContent: result.formattedString, 
        codeQuality: inputData.codeQuality,
        documentation: inputData.documentation,
        testing: inputData.testing,
        security: inputData.security,
        success: inputData.success, 
        error: inputData.error 
      };
    },
  })
)
.commit();
