import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mastra } from '@/mastra';

export const PrReviewInputSchema = z.object({
  repoUrl: z.string().url().describe("The URL of the GitHub PR to analyze (e.g. https://github.com/owner/repo/pull/1)"),
  githubPat: z.string().optional().describe("Your GitHub Personal Access Token for rate limits or private repos."),
});

export async function POST(request: Request) {
  try {
    const { repoUrl, githubPat } = await request.json();

    const inputValidation = PrReviewInputSchema.safeParse({ repoUrl, githubPat });

    if (!inputValidation.success) {
      const formattedErrors = inputValidation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    console.log(`Starting parallel PR diff analysis for: ${repoUrl}`);

    const prReviewWorkflow = mastra.getWorkflow("pr-review-workflow");

    if (!prReviewWorkflow) {
      return NextResponse.json({ error: "PR review workflow not found." }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await prReviewWorkflow.createRunAsync();
          const workflowStream = await run.stream({
            inputData: {
              repoUrl: repoUrl,
              githubToken: githubPat,
            },
          });

          for await (const event of workflowStream.fullStream) {
            const chunk = JSON.stringify(event) + '\n';
            controller.enqueue(encoder.encode(chunk));
          }

          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Error in PR analysis route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

