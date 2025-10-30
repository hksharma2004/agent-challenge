// src/app/api/stake/route.ts
import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const stakeAmount = Number(amount);

  if (!stakeAmount || stakeAmount <= 0) {
    return NextResponse.json({ error: 'Invalid staking amount' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc('stake_credits', {
      p_user_id: userId,
      p_amount: stakeAmount,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Emit the staking update through the internal API
    await fetch('http://localhost:3001/api/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            event: 'staking_update',
            data: data[0],
        }),
    });


    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
