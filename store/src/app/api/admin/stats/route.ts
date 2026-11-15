import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orderStats = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
    });

    const productCount = await prisma.product.count();

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
