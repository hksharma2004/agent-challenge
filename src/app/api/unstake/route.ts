import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from 'redis';
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
  const redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

  try {
    const userId = '00000000-0000-0000-0000-000000000000'; // Hardcoded Guest User ID
    const json = await request.json();
    const { amount } = unstakeSchema.parse(json);

    // Mock unstake result as we're removing Supabase auth/profiles logic
    const new_available_credits = 1000 + amount;
    const new_staked_credits = 500 - amount;
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
  } finally {
    await redisClient.quit();
  }
}

