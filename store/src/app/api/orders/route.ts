import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { customerName, phone, address, items, total, couponId, discountAmount } = await req.json();

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'البيانات ناقصة' }, { status: 400 });
    }

    // 1. التحقق من أن المستخدم مسجل دخول
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'يجب تسجيل الدخول أولاً لإتمام الطلب' }, { status: 401 });
    }

    // 2. التحقق من رصيد المستخدم في الخلفية (أمان إضافي)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const totalInDollars = total / 100;

    if (!user || user.walletBalance < totalInDollars) {
      return NextResponse.json({ 
        message: `عذراً، رصيد محفظتك غير كافٍ. المطلوب: $${totalInDollars.toFixed(2)}، المتوفر: $${(user?.walletBalance || 0).toFixed(2)}` 
      }, { status: 400 });
    }

    // 3. التحقق من مخزون المنتجات
    const productIds = items.map((i: any) => i.id);
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });

    for (const item of items) {
      const dbProduct = dbProducts.find((p: any) => p.id === item.id);
      if (!dbProduct || dbProduct.stock < item.quantity) {
        return NextResponse.json({ message: `عذراً، الكمية المطلوبة من (${dbProduct?.name || 'منتج'}) غير متوفرة حالياً.` }, { status: 400 });
      }
    }

    // 4. تنفيذ العملية في معاملة آمنة (Transaction)
    const order = await prisma.$transaction(async (tx) => {
      // أ) إنشاء الطلب
      const newOrder = await tx.order.create({
        data: {
          customerName,
          phone,
          address,
          total: Math.round(total),
          couponId: couponId || null,
          discountAmount: discountAmount || 0,
          userId: userId,
          status: 'pending',
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: Math.round(item.price),
              variant: item.variant || null,
            })),
          },
        },
      });

      // ب) خصم المخزون
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // ج) خصم الرصيد من المحفظة
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: totalInDollars } },
      });

      // د) تسجيل حركة في المحفظة
      await tx.walletTransaction.create({
        data: {
          userId,
          amount: totalInDollars,
          type: 'ORDER_PAYMENT',
          status: 'COMPLETED',
        },
      });

      // هـ) تحديث الكوبون إن وجد
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ 
      message: 'تم استلام الطلب بنجاح', 
      orderId: order.id 
    }, { status: 201 });

  } catch (error: any) {
    // طباعة الخطأ الحقيقي في سجلات Vercel لنتمكن من معرفته
    console.error("❌ خطأ أثناء إنشاء الطلب:", error);
    return NextResponse.json({ 
      message: 'فشل في إنشاء الطلب', 
      error: error.message || 'خطأ غير معروف' 
    }, { status: 500 });
  }
}
