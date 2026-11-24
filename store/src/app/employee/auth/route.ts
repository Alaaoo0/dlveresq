import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { phone, password, action } = await req.json();

  if (action === 'login') {
    const employee = await prisma.employee.findUnique({ where: { phone } });
    if (!employee || employee.password !== password) {
      return NextResponse.json({ message: 'رقم الهاتف أو كلمة السر غلط' }, { status: 401 });
    }
    return NextResponse.json({ id: employee.id, name: employee.name });
  }

  return NextResponse.json({ success: true });
}
