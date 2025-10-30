import "dotenv/config";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { createOllama } from "ollama-ai-provider-v2";
import { repositoryClonerTool } from "../tools/repository";
import { repositoryReaderTool } from "../tools/repository-reader-tool";
import { jsonFormatterTool } from "../tools/json-formatter-tool";
import { codeAnalyzerTool } from "../tools/code-analyzer-tool";
import { repoAnalysisWorkflow } from "../workflows/repo-analysis-workflow";


const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

export const AnalysisResult = z.object({
  codeQuality: z.number().min(0).max(100).describe("Score for code quality, considering clarity, consistency, and best practices."),
  documentation: z.number().min(0).max(100).describe("Score for documentation quality, based on README, comments, and other docs."),
  testing: z.number().min(0).max(100).describe("Score for test coverage and quality."),
  security: z.number().min(0).max(100).describe("Score for security practices, checking for basic vulnerabilities."),
  summary: z.string().describe("A concise summary of the overall analysis and key findings."),
  primaryLanguage: z.string().describe("The primary programming language of the repository."),
});

export const getLanguageFromPath = (filePath: string): string | null => {
  const extension = filePath.split('.').pop();
  if (!extension) return null;
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'TypeScript';
    case 'js':
    case 'jsx':
      return 'JavaScript';
    case 'py':
      return 'Python';
    case 'go':
      return 'Go';
    case 'java':
    case 'jar':
      return 'Java';
    case 'rs':
      return 'Rust';
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return 'C++';
    case 'cs':
      return 'C#';
    case 'php':
      return 'PHP';
    case 'rb':
      return 'Ruby';
    case 'html':
    case 'htm':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'json':
      return 'JSON';
    case 'xml':
      return 'XML';
    case 'yml':
    case 'yaml':
      return 'YAML';
    case 'md':
      return 'Markdown';
    default:
      return null;
  }
};

const baseInstructions = `
You are an expert software engineer specializing in code analysis. Your task is to analyze GitHub repositories and provide detailed quality reports.
The output must conform to the AnalysisResult schema.
  `;

const permanentSystemPrompt = `
You are an expert Code Analyzer Agent. Your primary goal is to meticulously examine provided codebases or code snippets to identify potential issues, suggest improvements, and provide comprehensive insights.

Your responsibilities include:
- **Bug Detection:** Identify logical errors, runtime errors, and potential crashes.
- **Vulnerability Assessment:** Pinpoint security vulnerabilities suchs as injection flaws, insecure configurations, or weak authentication patterns.
- **Performance Optimization:** Suggest areas where code execution can be made more efficient, reducing latency or resource consumption.
- **Code Quality & Style:** Evaluate adherence to coding standards, readability, maintainability, and best practices.
- **Architectural Review:** Provide high-level feedback on the overall design, modularity, and scalability of the codebase.
- **Documentation & Clarity:** Assess the clarity of comments, variable names, and overall code structure.
- **Provide Actionable Recommendations:** For every identified issue or area for improvement, offer concrete, actionable suggestions for resolution, including code examples where appropriate.
`;

export const getLanguageSpecificInstructions = (files: { path: string; content: string }[]): string => {
  const languageCounts: { [key: string]: number } = {};
  files.forEach(file => {
    if (file.content) { 
      const lang = getLanguageFromPath(file.path);
      if (lang) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      }
    }
  });

  const primaryLanguage = Object.keys(languageCounts).reduce((a, b) => languageCounts[a] > languageCounts[b] ? a : b, 'default');

  const languagePrompts: { [key: string]: string } = {
    'TypeScript': `
Pay close attention to modern TypeScript best practices, including proper type safety, use of interfaces, and async/await patterns.
Check for common pitfalls like 'any' types and ensure the code is well-structured and modular.
    `,
    'JavaScript': `
Focus on modern ES6+ syntax, proper handling of asynchronous operations, and potential security vulnerabilities like XSS.
Evaluate the code for clarity and maintainability.
    `,
    'Python': `
Analyze the code for adherence to PEP-8 style guidelines, proper use of virtual environments, and efficient data structures.
Look for common Python anti-patterns and check for robust error handling.
    `,
    'default': `
Provide a general analysis of the code quality, documentation, testing, and security.
Focus on clarity, maintainability, and adherence to common best practices.
    `,
  };

  return permanentSystemPrompt + baseInstructions + (languagePrompts[primaryLanguage] || languagePrompts['default']);
};

export const CodeAnalyzerInputSchema = z.object({
  repoUrl: z.string().url().describe("The URL of the GitHub repository to analyze."),
  githubPat: z.string().describe("Your GitHub Personal Access Token for cloning private repositories."),
});

export const codeAnalyzerAgent = new Agent({
  name: "Code Analyzer Agent",
  description: "An agent that clones and analyzes GitHub repositories.",
  instructions: permanentSystemPrompt + baseInstructions,
  model: ollama(process.env.NOS_MODEL_NAME_AT_ENDPOINT || process.env.MODEL_NAME_AT_ENDPOINT || "qwen2.5:8b"),
  tools: {
    [repositoryClonerTool.id]: repositoryClonerTool,
    [repositoryReaderTool.id]: repositoryReaderTool,
    [jsonFormatterTool.id]: jsonFormatterTool,
    [codeAnalyzerTool.id]: codeAnalyzerTool,
  },
  workflows: {
    [repoAnalysisWorkflow.id]: repoAnalysisWorkflow,
  },
  memory: new Memory({
    storage: new LibSQLStore({ url: ":memory:" }),
    options: {
      lastMessages: 20
    }
  }),
});

export const analyzeRepositoryContent = async (input: z.infer<typeof CodeAnalyzerInputSchema>, mastraInstance: any) => {
  const { repoUrl, githubPat } = input;

  const workflow = mastraInstance.getWorkflow("repoAnalysisWorkflow"); 

  if (!workflow) {
    return { success: false, error: "Repo analysis workflow not found." };
  }

  const run = await workflow.createRunAsync();
  const workflowResult = await run.start({
    inputData: {
      repoUrl: repoUrl,
      githubToken: githubPat,
    },
  });

  if (workflowResult.status === "failed") {
    return { success: false, error: `Workflow execution failed: ${workflowResult.error.message}` };
  }

  if (workflowResult.status === "suspended") {
    return { success: false, error: `Workflow suspended: ${JSON.stringify(workflowResult.suspendPayload)}` };
  }


  if (!workflowResult.result.success) {
    return { success: false, error: `Workflow execution failed: ${workflowResult.result.error || 'Unknown error'}` };
  }

  return { success: true, result: workflowResult.result };
};
