
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("employee_session")?.value;

    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await prisma.employee.updateMany({
        where: { sessionTokenHash: tokenHash },
        data: {
          sessionTokenHash: null,
          sessionExpiresAt: null,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    });

    response.cookies.set("employee_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Employee logout error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل الخروج" },
      { status: 500 }
    );
  }
}
