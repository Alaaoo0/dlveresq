import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { fee: 'asc' },
    });
    return NextResponse.json(zones);
  } catch (error) {
    return NextResponse.json({ error: 'فشل قراءة المناطق' }, { status: 500 });
  }
}
