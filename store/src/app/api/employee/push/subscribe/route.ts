import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
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

    const body = await request.json();
    const subscription = body.subscription;

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      return NextResponse.json(
        { message: "بيانات الإشعار غير مكتملة" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.upsert({
      where: {
        endpoint: subscription.endpoint,
      },
      update: {
        employeeId: employee.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      create: {
        endpoint: subscription.endpoint,
        employeeId: employee.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);

    return NextResponse.json(
      { message: "تعذر حفظ اشتراك الإشعارات" },
      { status: 500 }
    );
  }
}
