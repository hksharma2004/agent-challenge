import { NextResponse } from 'next/server';
import { getUserSubmissions } from '@/lib/queries/submissions';

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id'); 

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await getUserSubmissions(userId);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
