import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  const userId = '00000000-0000-0000-0000-000000000000'; // Hardcoded Guest User ID
  const stakeAmount = Number(amount);

  if (!stakeAmount || stakeAmount <= 0) {
    return NextResponse.json({ error: 'Invalid staking amount' }, { status: 400 });
  }

  try {
    // Mock stake response as we're removing Supabase auth/profiles logic
    const mockData = {
      user_id: userId,
      new_available_credits: 1000 - stakeAmount,
      new_staked_credits: 500 + stakeAmount,
    };

    // Skip the socket event fetch to localhost:3001 if the server isn't running or needed
    // But keep the logic structure if required for frontend

    return NextResponse.json(mockData);
  } catch (err) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

