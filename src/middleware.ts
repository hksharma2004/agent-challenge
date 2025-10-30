import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard', '/reviews', '/credits', '/profile'],
}
