const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MODEL_NAME = "openrouter/owl-alpha";

export const modelConfig = {
  id: process.env.MODEL_NAME || DEFAULT_MODEL_NAME,
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  url: process.env.OPENROUTER_API_URL || OPENROUTER_BASE_URL,
  headers: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.OPENROUTER_APP_NAME || "DecentraCode",
  },
} as any;
