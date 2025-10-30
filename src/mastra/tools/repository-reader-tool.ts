// src/mastra/tools/repository-reader-tool.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';


async function readDirectoryRecursive(dirPath: string, basePath: string = dirPath): Promise<{ path: string; content: string }[]> {
  const results: { path: string; content: string }[] = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(basePath, fullPath);
      

      if (entry.name === 'node_modules' || 
          entry.name === '.git' || 
          entry.name === 'dist' || 
          entry.name === 'build' ||
          entry.name === '.next' ||
          entry.name === 'coverage') {
        continue;
      }
      
      if (entry.isDirectory()) {
        const subResults = await readDirectoryRecursive(fullPath, basePath);
        results.push(...subResults);
      } else if (entry.isFile()) {
        // Only read text files 
        const ext = path.extname(entry.name).toLowerCase();
        const textExtensions = [
          '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.h',
          '.cs', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala',
          '.md', '.txt', '.json', '.yaml', '.yml', '.toml', '.xml',
          '.html', '.css', '.scss', '.sass', '.less',
          '.sh', '.bash', '.zsh', '.fish',
          '.env', '.gitignore', '.dockerignore', 'Dockerfile',
          '.sql', '.graphql', '.proto'
        ];
        
        if (textExtensions.includes(ext) || entry.name === 'Dockerfile' || entry.name === 'Makefile') {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            results.push({
              path: relativePath,
              content: content,
            });
          } catch (error) {

            console.warn(`Could not read file: ${relativePath}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return results;
}

export const repositoryReaderTool = createTool({
  id: 'read-repository',
  description: 'Read all code files from a cloned repository and return their contents as a structured string for analysis.',
  inputSchema: z.object({
    repoPath: z.string().describe('The local path of the cloned repository'),
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
  execute: async ({ context }) => {
    try {
      const { repoPath } = context;
      

      try {
        await fs.access(repoPath);
      } catch {
        return {
          files: [],
          content: '',
          fileCount: 0,
          success: false,
          error: 'Repository path does not exist',
        };
      }
      

      const files = await readDirectoryRecursive(repoPath);
      

      let content = `Repository Analysis\n${'='.repeat(80)}\n\n`;
      content += `Total Files: ${files.length}\n\n`;
      
      for (const file of files) {
        content += `\n${'='.repeat(80)}\n`;
        content += `FILE: ${file.path}\n`;
        content += `${'='.repeat(80)}\n\n`;
        content += file.content;
        content += `\n\n`;
      }
      
      return {
        files,
        content,
        fileCount: files.length,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        files: [],
        content: '',
        fileCount: 0,
        success: false,
        error: errorMessage,
      };
    }
  },
});
