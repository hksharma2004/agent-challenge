import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { repositoryClonerTool } from '../tools/repository';
import { repositoryReaderTool } from '../tools/repository-reader-tool';

export const repoReaderWorkflow = createWorkflow({
  id: 'repo-reader-workflow',
  inputSchema: z.object({
    repoUrl: z.string().url().describe('The URL of the GitHub repository to clone and read'),
    githubToken: z.string().optional().describe('GitHub Personal Access Token (PAT) for private repositories'),
  }),
  outputSchema: z.object({
    files: z.array(z.object({
      path: z.string(),
      content: z.string(),
    })).describe('An array of file objects with their paths and contents'),
    content: z.string().describe('The structured content of all files in the repository'),
    fileCount: z.number().describe('Number of files read'),
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
.commit();
