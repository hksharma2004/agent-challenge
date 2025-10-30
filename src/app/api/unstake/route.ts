import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from 'redis';
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
  const redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

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

    const { new_available_credits, new_staked_credits } = data[0];
    const new_tier = getTier(new_staked_credits);

    const eventPayload = {
      event: 'credit_balance_updated',
      userId,
      data: {
        available: new_available_credits,
        staked: new_staked_credits,
        tier: new_tier,
      },
    };
    await redisClient.publish('socket-events', JSON.stringify(eventPayload));

    return NextResponse.json({ success: true, ...data[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Unexpected error unstaking credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await redisClient.quit();
  }
}
