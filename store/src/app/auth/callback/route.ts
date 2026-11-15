import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user && user.email) {
      // 1. بنشوف إذا الزبون موجود بالداتابيز تبعنا
      let dbUser = await prisma.user.findUnique({ where: { email: user.email } })
      
      // 2. إذا مش موجود، بنعمله حساب جديد
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            name: user.user_metadata.full_name || user.user_metadata.name || 'Google User',
            email: user.email,
            password: 'google-oauth-login', // باسورد وهمي
          }
        })
      }

      // 3. بنعمله الكوكي الخاصة فينا عشان الـ Navbar يعرفه
      const cookieStore = await cookies()
      cookieStore.set('user_session', dbUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
}