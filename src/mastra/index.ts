import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { server } from "./mcp";
import { agents } from "./agents"; 
import { repoAnalysisWorkflow } from "./workflows/repo-analysis-workflow";
import { jsonFormatterTool } from "./tools/json-formatter-tool";
import { repoReaderWorkflow } from "./workflows/repo-reader-workflow";
import { reviewerInfoWorkflow } from "./workflows/reviewer-info-workflow";

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";

export const mastra = new Mastra({
  agents, 
  mcpServers: {
    server
  },
  workflows: {
    repoAnalysisWorkflow,
    repoReaderWorkflow,
    reviewerInfoWorkflow,
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
});
