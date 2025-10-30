import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${req.nextUrl.origin}/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(data.url);
}
