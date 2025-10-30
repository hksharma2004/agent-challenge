import pool from '@/lib/db';
import { SubmissionStatus } from '@/types/enums';

export async function getUserSubmissions(userId: string) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT s.*,
              COUNT(r.id) as review_count,
              AVG(r.score) as avg_score
       FROM submissions s
       LEFT JOIN reviews r ON s.id = r.submission_id
       WHERE s.user_id = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [userId]
    );
    return rows;
  } finally {
    client.release();
  }
}

export async function getSubmissionById(id: string) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT s.*, u.username as author, u.avatar_url
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );
    return rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getAllSubmissions(page: number = 1, limit: number = 20, filters?: { language?: string, status?: SubmissionStatus }) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT s.id, s.title, s.description, s.created_at, u.username as author, u.avatar_url, s.language, s.status
      FROM submissions s
      JOIN users u ON s.user_id = u.id
    `;
    const queryParams: (string | number)[] = [];
    const conditions: string[] = [];

    if (filters?.language && filters.language !== 'all') {
      conditions.push(`s.language = $${queryParams.push(filters.language)}`);
    }
    if (filters?.status) {
      conditions.push(`s.status = $${queryParams.push(filters.status)}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${queryParams.push(limit)} OFFSET $${queryParams.push((page - 1) * limit)}`;

    const { rows } = await client.query(query, queryParams);
    return rows;
  } finally {
    client.release();
  }
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return rows[0] || null;
  } finally {
    client.release();
  }
}
