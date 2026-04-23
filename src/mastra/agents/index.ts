import "dotenv/config";
import { createOpenAI } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { repositoryClonerTool } from "../tools/repository";
import { repositoryReaderTool } from "../tools/repository-reader-tool";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { PgMemory } from "@mastra/memory";

import { reviewerMatcherAgent } from "./reviewerMatcher";
import {
  securityAuditAgent,
  performanceAgent,
  testCoverageAgent,
  docsAgent,
  architectureAgent
} from "./specialists";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

// Export all agents
export const agents = {
  reviewerMatcherAgent,
  securityAuditAgent,
  performanceAgent,
  testCoverageAgent,
  docsAgent,
  architectureAgent,
};
