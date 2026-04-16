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

  const { data: { user }, error } = await supabase.auth.getUser()
  
  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith('/auth')

  const redirectWithCookies = (destination: string) => {
    const url = request.nextUrl.clone()
    url.pathname = destination
    const redirectResponse = NextResponse.redirect(url)
    
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, { ...cookie })
    })

    return redirectResponse
  }

  if (error || !user) {
    if (!isAuthPage) {
      return redirectWithCookies('/auth/login')
    }
    return supabaseResponse
  }

  if (user) {
    const role = user.user_metadata?.role 

    if (isAuthPage) {
      return redirectWithCookies(role === 'OWNER' ? '/owner/dashboard' : '/salesman/dashboard')
    }

    if (path.startsWith('/owner') && role !== 'OWNER') {
      return redirectWithCookies(role === 'SALESMAN' ? '/salesman/dashboard' : '/auth/login')
    }

    if (path.startsWith('/salesman') && role !== 'SALESMAN') {
      return redirectWithCookies(role === 'OWNER' ? '/owner/dashboard' : '/auth/login')
    }
    
    if (path === '/') {
        return redirectWithCookies(role === 'OWNER' ? '/owner/dashboard' : '/salesman/dashboard')
    }
  }

  return supabaseResponse
}