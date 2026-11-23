
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

function unauthorized() {
  return NextResponse.json(
    { error: 'غير مصرح لك بتنفيذ هذا الإجراء' },
    { status: 401 }
  );
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        position: true,
        address: true,
        isAvailable: true,
        createdAt: true,
      },
    });

    return NextResponse.json(employees);
  } catch {
    return NextResponse.json(
      { error: 'فشل قراءة الموظفين' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await req.json();
    const { name, phone, position, address } = body ?? {};

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof phone !== 'string' || !phone.trim() ||
      typeof position !== 'string' || !position.trim() ||
      (address !== undefined && typeof address !== 'string')
    ) {
      return NextResponse.json(
        { error: 'يرجى إدخال الاسم والهاتف والمنصب بشكل صحيح' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        position: position.trim(),
        ...(typeof address === 'string' && address.trim()
          ? { address: address.trim() }
          : {}),
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'فشل إضافة الموظف' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await req.json();
    const { id, isAvailable } = body ?? {};

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof isAvailable !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'بيانات تحديث الحالة غير صحيحة' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { isAvailable },
    });

    return NextResponse.json(employee);
  } catch {
    return NextResponse.json(
      { error: 'فشل تحديث الحالة' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const id = new URL(req.url).searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معرّف الموظف مطلوب' },
        { status: 400 }
      );
    }

    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'فشل الحذف' },
      { status: 500 }
    );
  }
}
