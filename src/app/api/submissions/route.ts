import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';
import { getAllSubmissions } from '@/lib/queries/submissions';
import { SubmissionStatus } from '@/types/enums';
import { supabase } from '@/lib/supabase';

const SUBMISSION_FEES = {
  standard: 10,
  high: 50,
};

const submissionSchema = z.object({
  repoUrl: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  language: z.string(),
  priority: z.enum(['standard', 'high']),
});

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const parsedData = submissionSchema.parse(json);
    const { repoUrl, title, description, language, priority } = parsedData;

    const fee = SUBMISSION_FEES[priority];

    await client.query('BEGIN');


    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('creditsavailable')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      await client.query('ROLLBACK');
      console.error('Error fetching user profile:', profileError);
      throw new Error('User not found or profile error');
    }

    const userCredits = userProfile.creditsavailable;
    if (userCredits < fee) {
      await client.query('ROLLBACK');
      throw new Error('Insufficient credits');
    }


    const { error: updateError } = await supabase
      .from('profiles')
      .update({ creditsavailable: userCredits - fee })
      .eq('id', userId);

    if (updateError) {
      await client.query('ROLLBACK');
      console.error('Error updating user credits:', updateError);
      throw new Error('Failed to update user credits');
    }


    await client.query(
      'INSERT INTO credit_transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4)',
      [userId, -fee, 'submission', `Submission fee for: ${title}`]
    );

    // Insert submission
    const submissionResult = await client.query(
      `INSERT INTO submissions (user_id, repo_url, title, description, language, status)
       VALUES ($1, $2, $3, $4, $5, '${SubmissionStatus.AWAITING_REVIEW}')
       RETURNING *`,
      [userId, repoUrl, title, description, language]
    );

    await client.query('COMMIT');

    return NextResponse.json({ success: true, submission: submissionResult.rows[0] }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Error creating submission:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || undefined;
  const status = searchParams.get('status') as SubmissionStatus || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const submissions = await getAllSubmissions(page, limit, { language, status });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
