import "dotenv/config";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { modelConfig } from "./modelConfig";

const sharedMemory = new Memory({
  storage: new LibSQLStore({ url: ":memory:" }),
  options: {
    lastMessages: 50
  }
});

export const InlineCommentSchema = z.object({
  comments: z.array(
    z.object({
      file: z.string().describe("The exact path to the file"),
      startLine: z.number().describe("The starting line number of the issue"),
      endLine: z.number().describe("The ending line number of the issue"),
      severity: z.enum(["info", "warning", "critical"]).describe("Severity level"),
      title: z.string().describe("Short, concise title of the finding"),
      body: z.string().describe("Detailed technical explanation of the issue and why it matters"),
      suggestedFix: z.string().optional().describe("A fully ready drop-in code snippet to fix the issue"),
    })
  )
});

export const securityAuditAgent = new Agent({
  name: "Security Audit Agent",
  description: "Examines code diffs for security vulnerabilities, hardcoded secrets, and injection risks.",
  instructions: "You are an expert security auditor focusing on OWASP top 10 vulnerabilities. Review the provided git diff and point out injection risks, improper authentication handling, hardcoded secrets, and PII logging.",
  model: modelConfig,
  memory: sharedMemory,
});

export const performanceAgent = new Agent({
  name: "Performance Agent",
  description: "Analyzes code diffs for performance bottlenecks like memory leaks, N+1 queries, and unbounded loops.",
  instructions: "You are an expert in code performance. Identify and report N+1 queries, highly complex unoptimized logic, memory leaks, and unbounded loops in the provided git diff.",
  model: modelConfig,
  memory: sharedMemory,
});

export const testCoverageAgent = new Agent({
  name: "Test Coverage Agent",
  description: "Detects missing tests and logic gaps in newly added code.",
  instructions: "You are a QA automation expert. Point out any newly added code in the diff that lacks sufficient unit or integration tests. Suggest exactly what tests need to be written or provide test stubs.",
  model: modelConfig,
  memory: sharedMemory,
});

export const docsAgent = new Agent({
  name: "Documentation Agent",
  description: "Checks code to ensure exported functions or classes are well-documented.",
  instructions: "You are an expert technical writer. Look at the code diff. Find publicly exported functions, classes, or types that lack JSDoc or docstrings. Create comments for them if missing.",
  model: modelConfig,
  memory: sharedMemory,
});

export const architectureAgent = new Agent({
  name: "Architecture Agent",
  description: "Ensures code adheres to layer separation, low coupling, and architectural standards.",
  instructions: "You are a software architect. Review the diff for architectural violations such as circular dependencies, inappropriate coupling, or bypassing repository/service layers. Flag violations clearly and objectively.",
  model: modelConfig,
  memory: sharedMemory,
});
