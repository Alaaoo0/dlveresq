
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function PATCH(req: Request) {
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

    const body = await req.json();

    if (typeof body?.isAvailable !== "boolean") {
      return NextResponse.json(
        { message: "الحالة غير صحيحة" },
        { status: 400 }
      );
    }

    const updated = await prisma.employee.update({
      where: { id: employee.id },
      data: { isAvailable: body.isAvailable },
      select: {
        id: true,
        isAvailable: true,
      },
    });

    return NextResponse.json({
      success: true,
      employee: updated,
      message: updated.isAvailable
        ? "أصبحت متاحاً لاستلام الطلبات"
        : "أصبحت غير متاح",
    });
  } catch (error) {
    console.error("Employee availability error:", error);

    return NextResponse.json(
      { message: "فشل تحديث الحالة" },
      { status: 500 }
    );
  }
}
