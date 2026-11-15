import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { customerName, phone, address, items, total, couponId, discountAmount } = await req.json();

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'البيانات ناقصة' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    const order = await prisma.order.create({
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

    // زيادة عدد استخدامات الكوبون إذا تم استخدامه
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ message: 'تم استلام الطلب', orderId: order.id }, { status: 201 });
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return NextResponse.json({ message: 'فشل في السيرفر', error: error.message }, { status: 500 });
  }
}
