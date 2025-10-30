
import { MCPServer } from "@mastra/mcp";
import { 
  repositoryReaderTool,
  getReviewerUsernameTool,
  getReviewerReputationTool,
  getReviewerLanguageExpertiseTool,
  getReviewerAvailabilityTool,
} from "../tools";

export const server = new MCPServer({
  name: "Code Review Agent Server",
  version: "1.0.0",
  tools: {
    "code-analyzer": repositoryReaderTool,
    "code-reviewer-analyzer": {
      getReviewerUsername: getReviewerUsernameTool,
      getReviewerReputation: getReviewerReputationTool,
      getReviewerLanguageExpertise: getReviewerLanguageExpertiseTool,
      getReviewerAvailability: getReviewerAvailabilityTool,
    },
  },
});