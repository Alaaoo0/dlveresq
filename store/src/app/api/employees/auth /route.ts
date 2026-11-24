
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, password, action } = await req.json();
    if (action === 'login') {
      const employee = await prisma.employee.findUnique({ where: { phone } });
      if (!employee || employee.password !== password) {
        return NextResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
      }
      return NextResponse.json({ id: employee.id, name: employee.name });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'خطأ في الخادم' }, { status: 500 });
  }
}
