import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/orders/[id] - لتحديث حالة الطلب أو إسناد موظف
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // ✅ في Next.js 16 لازم نعمل await للـ params
    const { id } = await context.params;
    const body = await req.json();
    const { status, assignedEmployeeId } = body;

    // التأكد من وجود بيانات للتحديث
    if (!status && assignedEmployeeId === undefined) {
      return NextResponse.json({ message: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedEmployeeId !== undefined) updateData.assignedEmployeeId = assignedEmployeeId;

    // تنفيذ التحديث في قاعدة البيانات
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'فشل في تحديث الطلب', error: String(error) }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - لحذف طلب
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // ✅ في Next.js 16 لازم نعمل await للـ params
    const { id } = await context.params;
    
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ message: 'فشل في حذف الطلب' }, { status: 500 });
  }
}
