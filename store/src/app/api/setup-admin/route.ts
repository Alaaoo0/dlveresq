import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const email = 'admin@delivery.com';
    const password = 'admin123';

    // حذف المستخدم القديم إن كان موجود
    await prisma.user.deleteMany({ where: { email } });

    // إنشاء hash صحيح لكلمة admin123
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const admin = await prisma.user.create({
      data: {
        name: 'مدير النظام',
        email: email,
        password: hashedPassword,
        phone: '96170000000',
        walletBalance: 0
      }
    });

    // التحقق أن الـ hash صحيح
    const verify = await bcrypt.compare(password, admin.password);

    return NextResponse.json({
      success: verify,
      message: verify ? '✅ تم إنشاء المستخدم بنجاح! كلمة المرور: admin123' : '❌ فشل التحقق',
      email: email,
      password: password
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
