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

    if (!analysisWorkflow) {
      return NextResponse.json({ error: "Repo analysis workflow not found." }, { status: 500 });
    }
    if (!readerWorkflow) {
      return NextResponse.json({ error: "Repo reader workflow not found." }, { status: 500 });
    }

    const analysisRunPromise = analysisWorkflow.createRunAsync().then(run =>
      run.start({
        inputData: {
          repoUrl: repoUrl,
          githubToken: githubPat,
        },
      })
    );

    const readerRunPromise = readerWorkflow.createRunAsync().then(run =>
      run.start({
        inputData: {
          repoUrl: repoUrl,
          githubToken: githubPat,
        },
      })
    );

    const [analysisResult, readerResult] = await Promise.all([analysisRunPromise, readerRunPromise]);

    if (analysisResult.status === "failed") {
      return NextResponse.json({ error: `Analysis workflow failed: ${analysisResult.error?.message}` }, { status: 500 });
    }
    if (analysisResult.status === "suspended") {
      return NextResponse.json({ error: `Analysis workflow suspended: ${JSON.stringify(analysisResult.suspendPayload)}` }, { status: 500 });
    }
    if (!analysisResult.result.success) {
      return NextResponse.json({ error: `Analysis workflow failed: ${analysisResult.result.error || 'Unknown error'}` }, { status: 500 });
    }

    if (readerResult.status === "failed") {
      return NextResponse.json({ error: `Reader workflow failed: ${readerResult.error?.message}` }, { status: 500 });
    }
    if (readerResult.status === "suspended") {
      return NextResponse.json({ error: `Reader workflow suspended: ${JSON.stringify(readerResult.suspendPayload)}` }, { status: 500 });
    }
    if (!readerResult.result.success) {
      return NextResponse.json({ error: `Reader workflow failed: ${readerResult.result.error || 'Unknown error'}` }, { status: 500 });
    }

    const combinedResult = {
      analysis: analysisResult.result,
      reader: readerResult.result,
    };

    console.log('Combined analysis complete:', combinedResult);
    return NextResponse.json(combinedResult);

  } catch (error: any) {
    console.error('Error in analysis route:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
