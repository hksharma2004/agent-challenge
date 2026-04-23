import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra'; // Import the mastra instance

export async function POST(req: NextRequest) {
  try {
    const { reviewerId } = await req.json();

    if (!reviewerId) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }


    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reviewerId)) {
      return NextResponse.json({ error: 'Invalid Reviewer ID format. Must be a valid UUID.' }, { status: 400 });
    }


    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await reviewerInfoWorkflowDef.createRunAsync();
          const workflowStream = await run.stream({
            inputData: { reviewerId },
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
    console.error('Error executing reviewer info workflow:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute workflow' }, { status: 500 });
  }
}
