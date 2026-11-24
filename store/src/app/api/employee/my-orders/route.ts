import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const empId = searchParams.get('empId');
  if (!empId) return NextResponse.json([]);

  const orders = await prisma.order.findMany({
    where: { assignedEmployeeId: empId, status: { not: 'delivered' } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}
