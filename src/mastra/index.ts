import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { agents } from "./agents";
import { repoAnalysisWorkflow } from "./workflows/repo-analysis-workflow";
import { repoReaderWorkflow } from "./workflows/repo-reader-workflow";

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";

let mastraInstance: any = null;

// Prevent multiple Mastra instances during hot reload
function createMastra() {
  if (mastraInstance) {
    return mastraInstance;
  }

  mastraInstance = new Mastra({
    agents,
    workflows: {
      repoAnalysisWorkflow,
      repoReaderWorkflow,
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
    telemetry: {
      enabled: false,
    },
  });

  return mastraInstance;
}

export const mastra = createMastra();
