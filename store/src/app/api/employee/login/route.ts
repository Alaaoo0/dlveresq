
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body?.phone;
    const password = body?.password;

    if (
      typeof phone !== "string" ||
      typeof password !== "string" ||
      !phone.trim() ||
      !password
    ) {
      return NextResponse.json(
        { message: "أدخل رقم الهاتف وكلمة المرور" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findFirst({
      where: { phone: phone.trim() },
    });

    if (!employee || !employee.passwordHash) {
      return NextResponse.json(
        { message: "رقم الهاتف أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      employee.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "رقم الهاتف أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        sessionTokenHash: tokenHash,
        sessionExpiresAt: expiresAt,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("employee_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      employee: {
        id: employee.id,
        name: employee.name,
        phone: employee.phone,
        position: employee.position,
        isAvailable: employee.isAvailable,
      },
    });
  } catch (error) {
    console.error("Employee login error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
