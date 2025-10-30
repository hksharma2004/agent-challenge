import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/db';

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

    const { data: userCredits, error } = await supabase
      .from('users')
      .select('credits_available, credits_staked')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user credits:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch user credits' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!userCredits) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json({
      available: userCredits.credits_available,
      staked: userCredits.credits_staked,
      total: userCredits.credits_available + userCredits.credits_staked,
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
