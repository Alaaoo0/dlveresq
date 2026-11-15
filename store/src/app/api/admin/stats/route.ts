import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // إجمالي المبيعات وإجمالي الطلبات
    const orderStats = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
    });

    // عدد المنتجات
    const productCount = await prisma.product.count();

    // آخر 5 طلبات
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    return NextResponse.json({
      totalSales: orderStats._sum.total || 0,
      totalOrders: orderStats._count || 0,
      totalProducts: productCount,
      recentOrders,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ message: 'فشل جلب الإحصائيات' }, { status: 500 });
  }
}
