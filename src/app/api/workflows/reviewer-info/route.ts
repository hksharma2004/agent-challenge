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
    
    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: {
        reviewerId,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running workflow:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
