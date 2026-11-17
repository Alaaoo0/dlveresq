import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;
    if (!userId) return NextResponse.json({ message: 'يجب تسجيل الدخول' }, { status: 401 });

    const user = await prisma.user.findUnique({ 
      where: { id: userId }, 
      select: { walletBalance: true } 
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'خطأ في السيرفر' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;
    
    if (!userId) return NextResponse.json({ message: 'يجب تسجيل الدخول' }, { status: 401 });
    if (amount <= 0) return NextResponse.json({ message: 'مبلغ غير صالح' }, { status: 400 });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: Math.round(amount * 100) } }, // بنزيد الرصيد
    });

    return NextResponse.json({ message: 'تم شحن الرصيد بنجاح', walletBalance: user.walletBalance });
  } catch (error) {
    return NextResponse.json({ message: 'فشل شحن الرصيد' }, { status: 500 });
  }
}
