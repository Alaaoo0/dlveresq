
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
},
  });

  revalidatePath("/admin/orders");
  revalidatePath("/employee");
}
