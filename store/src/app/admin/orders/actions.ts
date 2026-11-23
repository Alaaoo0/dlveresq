
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as webpush from "web-push";

async function checkAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

export async function updateStatus(orderId: string, status: string) {
  if (!(await checkAdmin())) {
    throw new Error("غير مصرح لك");
  }

  const allowedStatuses = [
    "confirmed",
    "preparing",
    "on_the_way",
    "delivered",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("حالة الطلب غير صحيحة");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
}

export async function assignEmployee(
  orderId: string,
  formData: FormData
) {
  if (!(await checkAdmin())) {
    throw new Error("غير مصرح لك");
  }

  const employeeId = formData.get("employeeId");

  if (
    typeof employeeId !== "string" ||
    !employeeId.trim()
  ) {
    throw new Error("اختر موظفاً أولاً");
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, isAvailable: true },
  });

  if (!employee) {
    throw new Error("الموظف غير موجود");
  }

  if (!employee.isAvailable) {
    throw new Error("الموظف غير متاح حالياً");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      employeeId: employee.id,
      assignedAt: new Date(),
      employeeResponse: "pending",
      employeeRespondedAt: null,
    },
  });

  // إرسال إشعار إلى هاتف الموظف
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT;

    if (publicKey && privateKey && subject) {
      webpush.setVapidDetails(subject, publicKey, privateKey);

      const subscriptions = await prisma.pushSubscription.findMany({
        where: { employeeId: employee.id },
      });

      const payload = JSON.stringify({
        title: "🔔 طلبية جديدة",
        body: "المدير أرسل لك طلبية جديدة. افتح التطبيق لقبولها أو رفضها.",
        tag: `order-${orderId}`,
      });

      await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.p256dh,
                  auth: subscription.auth,
                },
              },
              payload
            );
          } catch (error: unknown) {
            const statusCode =
              typeof error === "object" &&
              error !== null &&
              "statusCode" in error
                ? (error as { statusCode?: number }).statusCode
                : undefined;

            console.error("Push notification error:", error);

            if (statusCode === 404 || statusCode === 410) {
              await prisma.pushSubscription.deleteMany({
                where: { id: subscription.id },
              });
            }
          }
        })
      );
    } else {
      console.error("VAPID environment variables are missing");
    }
  } catch (error) {
    // لا نوقف إسناد الطلبية إذا فشل الإشعار
    console.error("Push sending failed:", error);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/employee");
}
