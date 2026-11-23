
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
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
      select: {
        id: true,
        name: true,
        phone: true,
        position: true,
        address: true,
        isAvailable: true,
      },
    });

    if (!employee) {
      const response = NextResponse.json(
        { message: "انتهت جلسة الدخول، يرجى تسجيل الدخول مجدداً" },
        { status: 401 }
      );

      response.cookies.delete("employee_session");
      return response;
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Employee session error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء التحقق من الحساب" },
      { status: 500 }
    );
  }
}
