
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// دالة جلب قائمة الموظفين
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({ 
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, phone: true, position: true, isAvailable: true }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: 'فشل قراءة الموظفين' }, { status: 500 });
  }
}

// دالة إضافة موظف جديد
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // التحقق من البيانات الأساسية
    if (!data.name || !data.phone || !data.password) {
      return NextResponse.json({ error: 'الاسم، رقم الهاتف وكلمة السر حقول إلزامية' }, { status: 400 });
    }

    const employee = await prisma.employee.create({ 
      data: {
        name: data.name,
        phone: data.phone,
        position: data.position || 'سائق توصيل',
        address: data.address || '',
        password: data.password,
        isAvailable: true
      } 
    });
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);
    // معالجة خطأ تكرار رقم الهاتف
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'رقم الهاتف مسجل مسبقاً لموظف آخر' }, { status: 409 });
    }
    return NextResponse.json({ error: 'فشل إضافة الموظف' }, { status: 500 });
  }
}

// دالة تحديث حالة التوفر
export async function PATCH(req: Request) {
  try {
    const { id, isAvailable } = await req.json();
    if (!id) return NextResponse.json({ error: 'معرف الموظف مطلوب' }, { status: 400 });

    const employee = await prisma.employee.update({
      where: { id },
      data: { isAvailable },
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'فشل تحديث الحالة' }, { status: 500 });
  }
}

// دالة حذف موظف
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الموظف مطلوب' }, { status: 400 });

    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
