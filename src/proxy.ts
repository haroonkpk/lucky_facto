import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const response = await updateSession(request)

  const path = request.nextUrl.pathname
  
  const isAuthPage = path.includes('/auth/login') || path.includes('/auth/sign-up') || path.includes('/auth/forgot-password') || path.includes('/auth/update-password')

  const isLoggedIn = request.cookies.has('sb-wmsbgbzwpqhqumuznbxk-auth-token')

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url)) 
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}