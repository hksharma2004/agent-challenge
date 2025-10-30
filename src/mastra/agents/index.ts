import "dotenv/config";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { repositoryClonerTool } from "../tools/repository";
import { repositoryReaderTool } from "../tools/repository-reader-tool";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { PgMemory } from "@mastra/memory";

import { codeAnalyzerAgent } from "./codeAnalyzer";
import { reviewerMatcherAgent } from "./reviewerMatcher";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
});

// Export all agents
export const agents = {
  codeAnalyzerAgent,
  reviewerMatcherAgent,
};
