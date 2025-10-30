
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const repositoryClonerTool = createTool({
  id: 'clone-repository',
  description: 'Clone a public or private GitHub repository to a local directory for analysis. Use this tool when you need to download and access the contents of a GitHub repository.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL of the GitHub repository to clone'),
    token: z.string().optional().describe('GitHub Personal Access Token (PAT) for private repositories'),
  }),
  outputSchema: z.object({
    path: z.string().describe('The local path where the repository was cloned'),
    success: z.boolean().describe('Whether the clone operation was successful'),
    error: z.string().optional().describe('Error message if the operation failed'),
  }),
  execute: async ({ context }) => {
    try {
      const { url, token } = context;
      const dir = path.join(os.tmpdir(), `repo-${Date.now()}`);
      
      await fs.promises.mkdir(dir, { recursive: true });


      let authUrl = url;
      if (token) {
        const urlObj = new URL(url);
        urlObj.username = token;
        urlObj.password = '';
        authUrl = urlObj.toString();
      }

      await git.clone({
        fs,
        http,
        dir,
        url: authUrl,
        singleBranch: true,
        depth: 1,
      });

      return { 
        path: dir,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        path: '',
        success: false,
        error: errorMessage,
      };
    }
  },
});
