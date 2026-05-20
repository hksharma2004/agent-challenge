import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { repositoryClonerTool } from '../tools/repository';
import { repositoryReaderTool } from '../tools/repository-reader-tool';
import { jsonFormatterTool } from '../tools/json-formatter-tool';
import {
  securityAuditAgent,
  performanceAgent,
  testCoverageAgent,
  docsAgent,
  architectureAgent
} from '../agents/specialists';

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
    execute: async ({ inputData }) => {
      const { files } = inputData;

      // Construct a summary prompt from the repository files
      const repoContext = files
        .map((f: any) => `File: ${f.path}\nContent:\n${f.content.substring(0, 1000)}\n---`)
        .join('\n\n');

      const createPrompt = (specialty: string) =>
        `Analyze the following repository files for ${specialty}.

Return ONLY concise GitHub-flavored Markdown:
- Start with a one-sentence overall assessment.
- Then provide at most 5 bullet points.
- Each bullet must be 1-2 short sentences.
- Include file paths in inline code when relevant.
- Do not include tables, long excerpts, emoji, horizontal rules, or nested sections.

Repository files:

${repoContext}`;

      try {
        const [securityRes, performanceRes, testingRes, docsRes, architectureRes] = await Promise.all([
          securityAuditAgent.generate(createPrompt('security vulnerabilities')),
          performanceAgent.generate(createPrompt('performance bottlenecks')),
          testCoverageAgent.generate(createPrompt('test coverage and testing practices')),
          docsAgent.generate(createPrompt('documentation quality and gaps')),
          architectureAgent.generate(createPrompt('architectural patterns and code structure')),
        ]);

        const codeQualitySummary = `**Performance**\n\n${performanceRes.text}\n\n**Architecture**\n\n${architectureRes.text}`;

        return {
          codeQuality: codeQualitySummary,
          documentation: docsRes.text,
          testing: testingRes.text,
          security: securityRes.text,
          success: true,
        };
      } catch (error: any) {
        return {
          codeQuality: '',
          documentation: '',
          testing: '',
          security: '',
          success: false,
          error: `Agent analysis failed: ${error.message}`,
        };
      }
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
