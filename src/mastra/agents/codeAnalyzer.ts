import "dotenv/config";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { modelConfig } from "./modelConfig";
import { repositoryClonerTool } from "../tools/repository";
import { repositoryReaderTool } from "../tools/repository-reader-tool";
import { jsonFormatterTool } from "../tools/json-formatter-tool";
import { codeAnalyzerTool } from "../tools/code-analyzer-tool";
import { repoAnalysisWorkflow } from "../workflows/repo-analysis-workflow";

const baseInstructions = `
You are an expert software engineer specializing in code analysis. Your task is to analyze GitHub repositories and provide detailed quality reports.
Return concise, structured feedback for code quality, documentation, testing, security, summary, and primary language.
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

export const CodeAnalyzerInputSchema = z.object({
  repoUrl: z.string().url().describe("The URL of the GitHub repository to analyze."),
  githubPat: z.string().describe("Your GitHub Personal Access Token for cloning private repositories."),
});

export const codeAnalyzerAgent = new Agent({
  name: "Code Review Agent",
  description: "An agent that clones and reviews GitHub repositories.",
  instructions: permanentSystemPrompt + baseInstructions,
  model: modelConfig,
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
