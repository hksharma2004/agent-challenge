import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/schema';

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookies() });
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

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

    const { data: transactions, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching credit transactions:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch credit transactions' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.json(transactions);
  } catch (e) {
    console.error('Unexpected error in /api/credits/transactions:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
