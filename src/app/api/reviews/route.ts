import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { Server } from 'socket.io'; // Assuming Socket.io server instance is available

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
    const userId = request.headers.get('x-user-id'); // Assuming userId is passed in headers

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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


    const reviewCreditReward = 5; 

    const { data: reviewerProfile, error: fetchProfileError } = await supabase
      .from('profiles')
      .select('creditsavailable')
      .eq('id', userId)
      .single();

    if (fetchProfileError || !reviewerProfile) {
      console.error('Error fetching reviewer profile for credit award:', fetchProfileError);
      // Continue without awarding credits if profile not found, or handle as an error
    } else {
      const { error: updateCreditsError } = await supabase
        .from('profiles')
        .update({ creditsavailable: reviewerProfile.creditsavailable + reviewCreditReward })
        .eq('id', userId);

      if (updateCreditsError) {
        console.error('Error updating reviewer credits:', updateCreditsError);
      } else {

        await client.query(
          'INSERT INTO credit_transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4)',
          [userId, reviewCreditReward, 'review_reward', `Review reward for submission: ${submission_id}`]
        );
      }
    }


    const { rows: [submission] } = await client.query(
      'SELECT user_id FROM submissions WHERE id = $1',
      [submission_id]
    );

    if (submission) {
    
      console.log(`Simulating Socket.io event for user ${submission.user_id}: New review for submission ${submission_id}`);
    }

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
