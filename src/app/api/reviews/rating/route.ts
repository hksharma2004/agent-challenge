import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const REPUTATION_CHANGES = {
  1: -5,
  2: -2,
  3: 1,
  4: 5,
  5: 10,
};

const ratingSchema = z.object({
  reviewId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: Request) {

  const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; 

  const client = await pool.connect();
  try {
    const json = await request.json();
    const { reviewId, rating } = ratingSchema.parse(json);

    await client.query('BEGIN');


    const reviewQuery = `
      SELECT 
        r.*, 
        s.user_id as submission_author_id
      FROM reviews r
      JOIN submissions s ON r.submission_id = s.id
      WHERE r.id = $1
      FOR UPDATE OF r;
    `;
    const reviewResult = await client.query(reviewQuery, [reviewId]);

    if (reviewResult.rows.length === 0) {
      throw new Error('Review not found');
    }
    const review = reviewResult.rows[0];


    if (review.submission_author_id !== userId) {
      throw new Error('Only the author of the submission can rate a review.');
    }
    
    if (review.rating !== null) {
      throw new Error('Review has already been rated');
    }


    await client.query('UPDATE reviews SET rating = $1 WHERE id = $2', [rating, reviewId]);

    const reputationChange = REPUTATION_CHANGES[rating as keyof typeof REPUTATION_CHANGES];
    await client.query('UPDATE users SET reputation_score = reputation_score + $1 WHERE id = $2', [reputationChange, review.reviewer_id]);


    await client.query(
        'INSERT INTO reputation_history (user_id, action_type, score_change, reason) VALUES ($1, $2, $3, $4)',
        [review.reviewer_id, 'review_rated', reputationChange, `Review ${reviewId} rated ${rating} stars`]
    );

    await client.query('COMMIT');

    return NextResponse.json({ success: true, message: 'Rating submitted successfully' }, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Error submitting rating:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
