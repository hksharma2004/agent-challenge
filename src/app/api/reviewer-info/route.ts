import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { reviewerId } = await req.json();

    if (!reviewerId) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }


    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reviewerId)) {
      return NextResponse.json({ error: 'Invalid Reviewer ID format. Must be a valid UUID.' }, { status: 400 });
    }


    return NextResponse.json({ error: 'Reviewer info workflow has been removed.' }, { status: 404 });

  } catch (error: any) {
    console.error('Error executing reviewer info workflow:', error);
    return NextResponse.json({ error: error.message || 'Failed to execute workflow' }, { status: 500 });
  }
}
