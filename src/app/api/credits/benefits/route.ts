import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/db';
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

    const { data: user, error } = await supabase
      .from('users')
      .select('staking_tier')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user staking tier:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch user staking tier' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!user || !user.staking_tier) {
      return NextResponse.json([]);
    }

    const benefits = benefitsByTier[user.staking_tier as StakingTier] || [];

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
