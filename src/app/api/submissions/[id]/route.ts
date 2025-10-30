import { NextResponse } from 'next/server';
import { getSubmissionById } from '@/lib/queries/submissions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const submission = await getSubmissionById(id);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
