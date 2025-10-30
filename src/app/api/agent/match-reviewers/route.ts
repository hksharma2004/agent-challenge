import { NextResponse } from 'next/server';
import { agents } from '@/mastra/agents';
import { mastra } from '@/mastra'; 
import pool from '@/lib/db';

export async function POST(request: Request) {
  const { submissionId, language, userId } = await request.json();

  if (!submissionId || !language || !userId) {
    return NextResponse.json({ error: 'submissionId, language, and userId are required' }, { status: 400 });
  }

  try {

    const { rows: potentialReviewerRows } = await pool.query(
      'SELECT id FROM users WHERE id != $1 ORDER BY reputation_score DESC LIMIT 10',
      [userId]
    );
    const potentialReviewerIds = potentialReviewerRows.map(row => row.id);

    const reviewers = await agents.reviewerMatcherAgent.handler({
      input: {
        language,
        potentialReviewerIds,
      },
      model: agents.reviewerMatcherAgent.model, 
      tools: agents.reviewerMatcherAgent.tools, 
    });

    return NextResponse.json({ reviewers });
  } catch (error) {
    console.error('Reviewer matching failed:', error);
    return NextResponse.json({ error: 'Failed to match reviewers' }, { status: 500 });
  }
}
