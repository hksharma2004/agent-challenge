import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Database } from '@/types/db';
import { StakingTier } from '@/types/enums';

const STAKING_TIERS = {
  [StakingTier.GOLD]: 1000,
  [StakingTier.SILVER]: 500,
  [StakingTier.BRONZE]: 100,
};

const unstakeSchema = z.object({
  amount: z.number().int().positive(),
});

function getTier(stakedAmount: number): StakingTier {
  if (stakedAmount >= STAKING_TIERS.GOLD) {
    return StakingTier.GOLD;
  }
  if (stakedAmount >= STAKING_TIERS.SILVER) {
    return StakingTier.SILVER;
  }
  if (stakedAmount >= STAKING_TIERS.BRONZE) {
    return StakingTier.BRONZE;
  }
  return StakingTier.NONE;
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const userId = session.user.id;
    const json = await request.json();
    const { amount } = unstakeSchema.parse(json);

    const { data, error } = await supabase.rpc('unstake_credits', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) {
      console.error('Error unstaking credits:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to unstake credits', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error unstaking credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
