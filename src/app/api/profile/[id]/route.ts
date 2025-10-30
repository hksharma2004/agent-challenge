import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT id, username, avatar_url, email, reputation, level, creditsavailable, creditsstaked, stakingtier, totalreviewsgiven, totalreviewsreceived, totalsubmissions, averagereviewscore, joineddate
       FROM user_profiles
       WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
