import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      deliveryPaymentMethod = 'cash',
    } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'بيانات ناقصة' }, { status: 400 });
    }

    // ✅ التحقق من الرصيد (المنتجات فقط، بدون التوصيل)
    const user = await prisma.user.findFirst({
      where: { email: (await req.headers.get('x-user-email')) || undefined },
    });

    if (user && user.walletBalance < total / 100) {
      return NextResponse.json({ message: 'رصيد المحفظة غير كافٍ' }, { status: 400 });
    }

    // ✅ إنشاء الطلب
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        location: location || null,
        zoneId: zoneId || null,
        total: Math.round(total), // ✅ فقط سعر المنتجات
        deliveryFee: deliveryFee || 0, // ✅ يُحفظ للعلم فقط
        discountAmount: discountAmount || 0,
        couponId: couponId || null,
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

    // ✅ خصم قيمة المنتجات فقط من المحفظة (بدون التوصيل)
    if (user && total > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: {
            decrement: total / 100,
          },
        },
      });

      await prisma.walletTransaction.create({
        data: {
          userId: user.id,
          amount: total / 100,
          type: 'ORDER_PAYMENT',
          status: 'COMPLETED',
        },
      });
    }

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
        items: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'فشل قراءة الطلبات' }, { status: 500 });
  }
}
