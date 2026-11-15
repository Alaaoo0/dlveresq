import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { customerName, phone, address, items, total, couponId, discountAmount } = await req.json();

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'البيانات ناقصة' }, { status: 400 });
    }

    // 1. نتأكد إنه في مخزون كافي
    const productIds = items.map((i: any) => i.id);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });

    for (const item of items) {
      const dbProduct = dbProducts.find((p: any) => p.id === item.id);
      if (!dbProduct || dbProduct.stock < item.quantity) {
        return NextResponse.json({ message: `عذراً، الكمية المطلوبة من (${dbProduct?.name || 'منتج'}) غير متوفرة حالياً.` }, { status: 400 });
      }
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    // 2. بنعمل الطلب وبننقص المخزون بنفس اللحظة
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerName, phone, address,
          total: Math.round(total),
          couponId: couponId || null,
          discountAmount: discountAmount || 0,
          userId: userId || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: Math.round(item.price),
            })),
          },
        },
      });

      // ننقص الكمية من المخزون
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // نزيد استخدام الكوبون
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ message: 'تم استلام الطلب', orderId: order.id }, { status: 201 });
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return NextResponse.json({ message: 'فشل في السيرفر', error: error.message }, { status: 500 });
  }
}
