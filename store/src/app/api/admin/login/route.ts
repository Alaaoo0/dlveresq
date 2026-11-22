import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ✅ كلمة المرور: خذها من متغير البيئة، أو افتراضياً admin123
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // مقارنة بسيطة وآمنة
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'كلمة المرور غلط!' },
        { status: 401 }
      );
    }

    // 🔑 ضبط الكوكي الذي يتوقعه الـ middleware
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
      path: '/',
    });

    return NextResponse.json({ message: 'تم تسجيل الدخول بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { message: 'فشل تسجيل الدخول' },
      { status: 500 }
    );
  }
}
