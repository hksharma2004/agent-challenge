import { NextResponse } from 'next/server';
import { CodeAnalyzerInputSchema } from '@/mastra/agents/codeAnalyzer';
import { mastra } from '@/mastra'; // Import the mastra instance
import { repoAnalysisWorkflow } from '@/mastra/workflows/repo-analysis-workflow';
import { repoReaderWorkflow } from '@/mastra/workflows/repo-reader-workflow';

export async function POST(request: Request) {
  try {
    const { repoUrl, githubPat } = await request.json();

    const inputValidation = CodeAnalyzerInputSchema.safeParse({ repoUrl, githubPat });

    if (!inputValidation.success) {
      const formattedErrors = inputValidation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    console.log(`Starting parallel analysis for: ${repoUrl}`);

    const analysisWorkflow = mastra.getWorkflow("repoAnalysisWorkflow");
    const readerWorkflow = mastra.getWorkflow("repoReaderWorkflow");

    if (!analysisWorkflow || !readerWorkflow) {
      return NextResponse.json({ error: "Workflows not found." }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const runAnalysis = await analysisWorkflow.createRunAsync();
          const runReader = await readerWorkflow.createRunAsync();

          const analysisStream = await runAnalysis.stream({
            inputData: { repoUrl, githubToken: githubPat },
          });

          const readerStream = await runReader.stream({
            inputData: { repoUrl, githubToken: githubPat },
          });

          // Helper to stream events from a workflow stream
          const streamEvents = async (workflowStream: any, source: string) => {
            for await (const event of workflowStream.fullStream) {
              try {
                const chunk = JSON.stringify({ ...event, source }) + '\n';
                controller.enqueue(encoder.encode(chunk));
              } catch (jsonError: any) {
                console.error(`Error stringifying event from ${source}:`, event, jsonError);
                // Enqueue an error event in JSON format
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', source, message: 'Failed to stringify event', error: jsonError.message }) + '\n'));
              }
            }
          };

          // Run both streams in parallel and wait for them
          await Promise.all([
            streamEvents(analysisStream, 'analysis'),
            streamEvents(readerStream, 'reader')
          ]);

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
    console.error('Error in analysis route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
