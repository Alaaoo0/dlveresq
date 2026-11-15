import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: 'الإيميل أو الباسورد غلط' }, { status: 400 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ message: 'الإيميل أو الباسورد غلط' }, { status: 400 });

    const cookieStore = await cookies();
    cookieStore.set('user_session', user.id, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/',
    });

    return NextResponse.json({ message: 'تم تسجيل الدخول' });
  } catch (error) {
    return NextResponse.json({ message: 'فشل تسجيل الدخول' }, { status: 500 });
  }
}