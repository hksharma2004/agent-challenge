import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock user balance data for the hardcoded Guest User
    return NextResponse.json({
      available: 1000,
      staked: 500,
      total: 1500,
    });
  } catch (e) {
    console.error('Unexpected error in /api/credits/balance:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

