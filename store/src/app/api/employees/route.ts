import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'فشل قراءة الموظفين' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const employee = await prisma.employee.create({ data });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل إضافة الموظف' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, isAvailable } = await req.json();
    const employee = await prisma.employee.update({
      where: { id },
      data: { isAvailable },
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'فشل تحديث الحالة' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await prisma.employee.delete({ where: { id: id! } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
