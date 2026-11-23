
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const allowedStatuses = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
        { message: "جلسة الدخول غير صالحة" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "رقم الطلب غير صحيح" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const status = body?.status;

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { message: "حالة الطلب غير مسموحة" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        employeeId: employee.id,
        employeeResponse: "accepted",
      },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json(
        {
          message:
            "لا يمكنك تحديث الطلب قبل قبولك له",
        },
        { status: 403 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Employee order status error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث الطلب" },
      { status: 500 }
    );
  }
}
