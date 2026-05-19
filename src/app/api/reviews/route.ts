import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { rows: reviews } = await client.query(
      `SELECT r.id, r.submission_id, r.reviewer_id, r.score, r.rating, r.feedback, r.categories, r.created_at as submittedDate,
              u.username as reviewerName, u.avatar_url as reviewerAvatar
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.submission_id = $1
       ORDER BY r.created_at DESC`,
      [submissionId]
    );
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const userId = '00000000-0000-0000-0000-000000000000'; // Hardcoded Guest User ID

    const json = await request.json();
    const { submission_id, score, rating, feedback, categories } = json;

    if (!submission_id || score === undefined || rating === undefined || !feedback) {
      return NextResponse.json({ success: false, error: 'Submission ID, score, rating, and feedback are required' }, { status: 400 });
    }

    const reviewResult = await client.query(
      `INSERT INTO reviews (submission_id, reviewer_id, score, rating, feedback, categories)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [submission_id, userId, score, rating, feedback, categories]
    );

    const review = reviewResult.rows[0];

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
