import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const { language, excludeReviewerId, limit = 3 } = await request.json();

  if (!language) {
    return NextResponse.json({ error: 'language is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { rows: reviewers } = await client.query(
      `SELECT *
       FROM public.match_human_reviewers($1, $2, $3)`,
      [language, excludeReviewerId ?? null, limit]
    );

    return NextResponse.json({ reviewers });
  } catch (error) {
    console.error('Reviewer matching failed:', error);
    return NextResponse.json({ error: 'Failed to match reviewers' }, { status: 500 });
  } finally {
    client.release();
  }
}
