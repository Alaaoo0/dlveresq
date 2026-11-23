
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    // التحقق من جلسة الموظف
    const cookieStore = await cookies();
    const token = cookieStore.get("employee_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "يرجى تسجيل الدخول" },
        { status: 401 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const employee = await prisma.employee.findFirst({
      where: {
        sessionTokenHash: tokenHash,
        sessionExpiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "جلسة الموظف غير صالحة" },
        { status: 401 }
      );
    }

    // جلب الطلبات المسندة لهذا الموظف فقط
    const orders = await prisma.order.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerName: true,
        phone: true,
        address: true,
        location: true,
        deliveryFee: true,
        total: true,
        status: true,
employeeResponse: true,
employeeRespondedAt: true,
createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            variant: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Employee orders error:", error);

    return NextResponse.json(
      { message: "فشل تحميل الطلبات" },
      { status: 500 }
    );
  }
}
