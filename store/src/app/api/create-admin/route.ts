import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // التحقق من وجود مستخدم admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@delivery.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'مستخدم admin موجود بالفعل',
        email: 'admin@delivery.com',
        password: 'admin123'
      });
    }

    // إنشاء كلمة مرور مشفرة
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // إنشاء المستخدم
    const admin = await prisma.user.create({
      data: {
        name: 'مدير النظام',
        email: 'admin@delivery.com',
        password: hashedPassword,
        phone: '96170000000',
        walletBalance: 0
      }
    });

    return NextResponse.json({
      message: '✅ تم إنشاء مستخدم admin بنجاح!',
      email: 'admin@delivery.com',
      password: 'admin123',
      userId: admin.id
    });
  } catch (error) {
    return NextResponse.json({
      message: '❌ خطأ في إنشاء المستخدم',
      error: String(error)
    }, { status: 500 });
  }
}
