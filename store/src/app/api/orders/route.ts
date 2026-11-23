import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
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
      deliveryPaymentMethod = 'cash',
    } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ message: 'بيانات ناقصة' }, { status: 400 });
    }

    // ✅ إنشاء Supabase client من cookies مباشرة (الطريقة الصحيحة في Next.js 16)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userId: string | null = null;
    let userWalletBalance: number | null = null;

    if (authUser?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: authUser.email },
      });
      if (dbUser) {
        userId = dbUser.id;
        userWalletBalance = dbUser.walletBalance;
      }
    }

    // ✅ التحقق من الرصيد (المنتجات فقط)
    if (userWalletBalance !== null && userWalletBalance < total / 100) {
      return NextResponse.json({ 
        message: `رصيد المحفظة غير كافٍ. المطلوب: $${(total / 100).toFixed(2)}. لديك: $${userWalletBalance.toFixed(2)}` 
      }, { status: 400 });
    }

    // ✅ إنشاء الطلب
    const order = await prisma.order.create({
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
        userId: userId,
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

    // ✅ خصم قيمة المنتجات فقط من المحفظة
    if (userId && total > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: total / 100,
          },
        },
      });

      await prisma.walletTransaction.create({
        data: {
          userId: userId,
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
