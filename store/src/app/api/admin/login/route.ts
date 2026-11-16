import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    // بياخد الباسورد من Vercel، وإذا ما لاقاه بيستخدم alaao0
    const adminPassword = process.env.ADMIN_PASSWORD || "alaao0";

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // هون السر: بنثبت الكوكي على الـ Response مباشرة
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // أسبوع
        path: '/',
      });
      
      return response;
    }
    return NextResponse.json({ message: 'كلمة المرور غلط' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'خطأ في السيرفر' }, { status: 500 });
  }
}
