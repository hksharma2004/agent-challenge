import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { server } from "./mcp";
import { agents } from "./agents";
import { repoAnalysisWorkflow } from "./workflows/repo-analysis-workflow";
import { jsonFormatterTool } from "./tools/json-formatter-tool";
import { repoReaderWorkflow } from "./workflows/repo-reader-workflow";
import { reviewerInfoWorkflow } from "./workflows/reviewer-info-workflow";
import { prReviewWorkflow } from "./workflows/pr-review-workflow";

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";
const IS_DEV = process.env.NODE_ENV === "development";

if (typeof globalThis !== "undefined") {
  (globalThis as any).___MASTRA_TELEMETRY___ = true;
}

let mastraInstance: any = null;

// Prevent multiple Mastra instances during hot reload
function createMastra() {
  if (mastraInstance) {
    return mastraInstance;
  }

  mastraInstance = new Mastra({
    agents,
    mcpServers: {
      server
    },
    workflows: {
      repoAnalysisWorkflow,
      repoReaderWorkflow,
      reviewerInfoWorkflow,
      prReviewWorkflow,
    },
    storage: new LibSQLStore({
      url: ":memory:"
    }),
    logger: new ConsoleLogger({
      level: LOG_LEVEL,
    }),
    server: {
      port: 4111,
    },
    observability: {
      default: {
        enabled: !IS_DEV,
      },
    },
  });

  return mastraInstance;
}

export const mastra = createMastra();
