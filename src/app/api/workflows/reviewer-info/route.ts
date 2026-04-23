import { mastra } from "@/mastra";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reviewerId } = await request.json();

    if (!reviewerId) {
      return NextResponse.json(
        { error: "Reviewer ID is required" },
        { status: 400 }
      );
    }

    const workflow = mastra.getWorkflow("reviewerInfoWorkflow");
    
    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await workflow.createRunAsync();
          const workflowStream = await run.stream({
            inputData: {
              reviewerId,
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
  } catch (error) {
    console.error("Error running workflow:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
