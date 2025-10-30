import { NextResponse } from 'next/server';
import { mastra } from '@/mastra'; 
import { AnalysisResult } from '@/mastra/agents/codeAnalyzer';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const { submissionId, repoUrl } = await request.json();

  if (!submissionId || !repoUrl) {
    return NextResponse.json({ error: 'submissionId and repoUrl are required' }, { status: 400 });
  }


  (async () => {
    try {
      const codeAnalyzerAgent = mastra.getAgent("codeAnalyzerAgent"); 


      const agentResult = await codeAnalyzerAgent.run(repoUrl);

      const result = agentResult.object;
      
      const formattedFeedback = `
Code Quality: ${result.codeQuality}/100
Documentation: ${result.documentation}/100
Testing: ${result.testing}/100
Security: ${result.security}/100

Summary: ${result.summary}
Primary Language: ${result.primaryLanguage}
      `.trim();

      await pool.query(
        'UPDATE submissions SET ai_score = $1, ai_feedback = $2, status = $3 WHERE id = $4',
        [
          (result.codeQuality + result.documentation + result.testing + result.security) / 4,
          formattedFeedback,
          'analyzed',
          submissionId,
        ]
      );
    } catch (error) {
      console.error('Analysis failed:', error);
      await pool.query('UPDATE submissions SET status = $1 WHERE id = $2', ['failed', submissionId]);
    }
  })();

  return NextResponse.json({ message: 'Analysis started' }, { status: 202 });
}