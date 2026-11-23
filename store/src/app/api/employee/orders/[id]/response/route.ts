
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
        { message: "جلسة الموظف غير صالحة" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const response = body?.response;

    if (
      !id ||
      !["accepted", "rejected"].includes(response)
    ) {
      return NextResponse.json(
        { message: "الطلب أو الرد غير صحيح" },
        { status: 400 }
      );
    }

    const result = await prisma.order.updateMany({
      where: {
        id,
        employeeId: employee.id,
        employeeResponse: "pending",
      },
      data: {
        employeeResponse: response,
        employeeRespondedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "الطلب غير موجود أو تم الرد عليه مسبقاً" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      response,
      message:
        response === "accepted"
          ? "تم قبول الطلبية"
          : "تم رفض الطلبية",
    });
  } catch (error) {
    console.error("Employee order response error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل الرد" },
      { status: 500 }
    );
  }
}
