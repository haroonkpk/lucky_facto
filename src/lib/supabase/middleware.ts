import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, 
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith('/auth')

  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = user.user_metadata?.role 

    if (isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = role === 'OWNER' ? '/owner-dashboard' : '/salesman-dashboard'
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/owner-dashboard') && role !== 'OWNER') {
      const url = request.nextUrl.clone()
      url.pathname = '/salesman-dashboard'
      return NextResponse.redirect(url)
    }

    if (path.startsWith('/salesman-dashboard') && role !== 'SALESMAN') {
      const url = request.nextUrl.clone()
      url.pathname = '/owner-dashboard'
      return NextResponse.redirect(url)
    }
    
    if (path === '/') {
        const url = request.nextUrl.clone()
        url.pathname = role === 'OWNER' ? '/owner-dashboard' : '/salesman-dashboard'
        return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}