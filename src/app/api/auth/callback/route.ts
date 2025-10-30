import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server';


export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            username: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
          });
        }
      }
      revalidatePath('/dashboard');
      return NextResponse.redirect(new URL(redirectTo, req.url))
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/signin?error=Authentication+failed', req.url))
    }
  }

  console.error('No code provided')
  return NextResponse.redirect(new URL('/signin?error=No+code+provided', req.url))
}
