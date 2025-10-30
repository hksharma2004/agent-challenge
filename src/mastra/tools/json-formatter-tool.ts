import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const jsonFormatterTool = createTool({
  id: 'json-formatter',
  description: 'Formats a JSON object into a human-readable string with indentation.',
  inputSchema: z.object({
    data: z.any().describe('The JSON object to format.'),
    indent: z.number().optional().default(2).describe('The number of spaces to use for indentation.'),
  }),
  outputSchema: z.object({
    formattedString: z.string().describe('The formatted JSON string.'),
    success: z.boolean().describe('Whether the operation was successful.'),
    error: z.string().optional().describe('Error message if the operation failed.'),
  }),
  execute: async ({ context }) => {
    try {
      const { data, indent } = context;
      const formattedString = JSON.stringify(data, null, indent);
      return {
        formattedString,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        formattedString: '',
        success: false,
        error: errorMessage,
      };
    }
  },
});
