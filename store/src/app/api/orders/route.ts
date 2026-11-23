import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      address,
      location,
      zoneId,
      items,
      total,
      couponId,
      discountAmount,
      deliveryFee,
    } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'بيانات ناقصة' }, { status: 400 });
    }

    // ✅ نفس طريقة /api/auth/me - قراءة الكوكيز user_session
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 401 });
    }

    // ✅ التحقق من الرصيد (المنتجات فقط، التوصيل نقداً)
    if (user.walletBalance < total / 100) {
      return NextResponse.json({
        message: `رصيد المحفظة غير كافٍ. المطلوب: $${(total / 100).toFixed(2)}. لديك: $${user.walletBalance.toFixed(2)}`,
      }, { status: 400 });
    }

    // ✅ إنشاء الطلب + خصم المحفظة في transaction (سوا أو ولا)
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerName,
          phone,
          address,
          location: location || null,
          zoneId: zoneId || null,
          total: Math.round(total),
          deliveryFee: deliveryFee || 0,
          discountAmount: discountAmount || 0,
          couponId: couponId || null,
          userId: user.id,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              variant: item.variant || null,
            })),
          },
        },
      });

      // خصم قيمة المنتجات من المحفظة
      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { decrement: total / 100 } },
      });

      // تسجيل العملية في سجل المحفظة
      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          amount: total / 100,
          type: 'ORDER_PAYMENT',
          status: 'COMPLETED',
        },
      });

      return createdOrder;
    });

    return NextResponse.json({ orderId: order.id, message: 'تم إنشاء الطلب بنجاح' });
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return NextResponse.json({ message: 'فشل إنشاء الطلب' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'فشل قراءة الطلبات' }, { status: 500 });
  }
}
