import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const addReviewerSchema = z.object({
  github_id: z.string(),
  username: z.string(),
  language_expertise: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { github_id, username, language_expertise } = addReviewerSchema.parse(json);

    const query = `
      INSERT INTO users (github_id, username, language_expertise, is_available)
      VALUES ($1, $2, $3, true)
      RETURNING *;
    `;
    const values = [github_id, username, language_expertise];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, user: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Error adding reviewer:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}