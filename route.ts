
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    if (cookieStore.get("admin_session")?.value !== "true") {
      return NextResponse.json(
        { success: false, message: "غير مصرح لك" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, employeeId } = body ?? {};

    if (
      typeof orderId !== "string" ||
      !orderId.trim() ||
      typeof employeeId !== "string" ||
      !employeeId.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "بيانات الطلب أو الموظف غير صحيحة" },
        { status: 400 }
      );
    }

    const [order, employee] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true },
      }),
      prisma.employee.findUnique({
        where: { id: employeeId },
        select: { id: true, name: true, isAvailable: true },
      }),
    ]);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    if (!employee.isAvailable) {
      return NextResponse.json(
        { success: false, message: "هذا الموظف غير متاح حالياً" },
        { status: 409 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { employeeId },
    });

    return NextResponse.json({
      success: true,
      message: `تم إسناد الطلب إلى ${employee.name}`,
    });
  } catch (error) {
    console.error("Assign order error:", error);

    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء إسناد الطلب" },
      { status: 500 }
    );
  }
}
