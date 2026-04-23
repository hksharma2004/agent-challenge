import { NextResponse } from 'next/server';
import { StakingTier } from '@/types/enums';

const benefitsByTier = {
  [StakingTier.BRONZE]: [
    'Priority matching',
    'Extended feedback',
    'Badge on profile',
  ],
  [StakingTier.SILVER]: [
    'All Bronze perks',
    'AI pair program',
    'Private reviews',
    'Custom templates',
    'Priority support',
  ],
  [StakingTier.GOLD]: [
    'All Silver perks',
    'Custom models',
    'Team accounts',
    'Advanced analytics',
  ],
};

export async function GET() {
  try {
    // Hardcoded Guest User tier
    const userTier = StakingTier.GOLD;
    const benefits = benefitsByTier[userTier] || [];

    return NextResponse.json(benefits);
  } catch (e) {
    console.error('Unexpected error in /api/credits/benefits:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

