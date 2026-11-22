import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ✅ كلمة المرور الافتراضية (يمكنك تغييرها لاحقاً من إعدادات Vercel)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // 1. التحقق من صحة كلمة المرور
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'كلمة المرور غلط!' },
        { status: 401 }
      );
    }

    // 2. ضبط الكوكي الذي يتوقعه ملف middleware.ts
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // صالح لمدة 7 أيام
      path: '/',
    });

    // 3. إرجاع رسالة النجاح
    return NextResponse.json({ message: 'تم تسجيل الدخول بنجاح' });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
