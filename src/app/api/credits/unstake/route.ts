import { NextResponse } from 'next/server';
import { z } from 'zod';
import { StakingTier } from '@/types/enums';

const unstakeSchema = z.object({
  amount: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const userId = '00000000-0000-0000-0000-000000000000'; // Hardcoded Guest User ID
    const json = await request.json();
    const { amount } = unstakeSchema.parse(json);

    // Mock unstake result as we're removing Supabase auth/profiles logic
    const new_available_credits = 1000 + amount;
    const new_staked_credits = 500 - amount;

    return NextResponse.json({ 
      success: true, 
      new_available_credits, 
      new_staked_credits 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error unstaking credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

