"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignOrderToEmployee(orderId: string, employeeId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { assignedEmployeeId: employeeId },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error assigning order:", error);
    return { success: false, error: "فشل في إسناد الطلب" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "فشل في تحديث الحالة" };
  }
}
