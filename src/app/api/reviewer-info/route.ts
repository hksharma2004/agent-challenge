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


    type MastraWorkflowId = "repoAnalysisWorkflow" | "repoReaderWorkflow" | "reviewerInfoWorkflow";
    const workflowId: MastraWorkflowId = 'reviewerInfoWorkflow';
    const reviewerInfoWorkflowDef = mastra.getWorkflow(workflowId);

    if (!reviewerInfoWorkflowDef) {
      return NextResponse.json({ error: 'Reviewer info workflow not found.' }, { status: 500 });
    }


    const run = await reviewerInfoWorkflowDef.createRunAsync();
    const result = await run.start({
      inputData: { reviewerId },
    });


    if (result.status === "failed") {
      return NextResponse.json({ error: `Workflow failed: ${result.error?.message}` }, { status: 500 });
    }
    if (result.status === "suspended") {
      return NextResponse.json({ error: `Workflow suspended: ${JSON.stringify(result.suspendPayload)}` }, { status: 500 });
    }
    if (!result.result.success) {
      return NextResponse.json({ error: `Workflow failed: ${result.result.error || 'Unknown error'}` }, { status: 500 });
    }

    return NextResponse.json(result.result); 

  } catch (error: any) {
    console.error('Error executing reviewer info workflow:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute workflow' }, { status: 500 });
  }
}
