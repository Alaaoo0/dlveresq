
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

function unauthorized() {
  return NextResponse.json(
    { message: 'غير مصرح لك بتنفيذ هذا الإجراء' },
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
      { message: 'فشل قراءة الموظفين' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await req.json();

    const { name, phone, position, address, password } = body ?? {};

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof phone !== 'string' || !phone.trim() ||
      typeof position !== 'string' || !position.trim() ||
      typeof password !== 'string' || password.length < 6 ||
      (address !== undefined && typeof address !== 'string')
    ) {
      return NextResponse.json(
        { message: 'يرجى إدخال جميع البيانات بشكل صحيح، وكلمة مرور من 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.trim();

    const existingEmployee = await prisma.employee.findFirst({
      where: { phone: normalizedPhone },
      select: { id: true },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: 'رقم الهاتف مسجل لموظف آخر' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        phone: normalizedPhone,
        position: position.trim(),
        passwordHash,
        ...(typeof address === 'string' && address.trim()
          ? { address: address.trim() }
          : {}),
      },
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

    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'فشل إضافة الموظف' },
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
        { message: 'بيانات تحديث الحالة غير صحيحة' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { isAvailable },
      select: {
        id: true,
        name: true,
        phone: true,
        position: true,
        address: true,
        isAvailable: true,
      },
    });

    return NextResponse.json(employee);
  } catch {
    return NextResponse.json(
      { message: 'فشل تحديث الحالة' },
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
        { message: 'معرّف الموظف مطلوب' },
        { status: 400 }
      );
    }

    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'فشل الحذف' },
      { status: 500 }
    );
  }
}
