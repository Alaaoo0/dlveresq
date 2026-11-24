import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, password, action } = await req.json();

    if (action === 'login') {
      // البحث عن الموظف برقم الهاتف
      const employee = await prisma.employee.findUnique({ 
        where: { phone } 
      });

      // التحقق من وجود الموظف وصحة كلمة السر
      if (!employee || employee.password !== password) {
        return NextResponse.json(
          { message: 'رقم الهاتف أو كلمة السر غير صحيحة' }, 
          { status: 401 }
        );
      }

      // إرجاع معرف الموظف ليتم حفظه في الكوكيز
      return NextResponse.json({ id: employee.id, name: employee.name });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'خطأ في الخادم' }, { status: 500 });
  }
}
