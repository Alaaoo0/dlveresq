import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_session')?.value === 'true'
  
  // إذا كان داخل على أي صفحة من صفحات الأدمن
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // إذا كانت صفحة تسجيل الدخول للأدمن، خليه يفوت
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // إذا مش أدمن، طرده على صفحة تسجيل دخول الأدمن
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
