import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      return NextResponse.json({
        id: 'global',
        siteName: 'توصيل سريع',
        heroTitle: 'جوعان؟ طلبك يوصلك!',
        heroSubtitle: 'أفضل المطاعم، السوبرماركت، والصيدليات في مدينتك',
        heroBtnText: 'اطلب الآن',
        discountBadge: 'توصيل مجاني',
        whatsapp: '96170000000',
        whishNumber: '0000000',
        email: 'support@delivery.com',
        deliveryLocation: 'بيروت، لبنان',
        deliveryFee: 200,
        storeLatitude: 33.8938,
        storeLongitude: 35.5018,
        pricePerKm: 0.5,
        minDeliveryFee: 100,
        maxDeliveryFee: 1000,
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'فشل قراءة الإعدادات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const deliveryFee = data.deliveryFee !== undefined && data.deliveryFee !== null
      ? parseInt(data.deliveryFee, 10) || 0
      : 200;

    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {
        siteName: data.siteName,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroBtnText: data.heroBtnText,
        discountBadge: data.discountBadge,
        whatsapp: data.whatsapp,
        whishNumber: data.whishNumber,
        email: data.email,
        deliveryLocation: data.deliveryLocation || 'بيروت، لبنان',
        deliveryFee: deliveryFee,
        storeLatitude: parseFloat(data.storeLatitude) || 33.8938,
        storeLongitude: parseFloat(data.storeLongitude) || 35.5018,
        pricePerKm: parseFloat(data.pricePerKm) || 0.5,
        minDeliveryFee: parseInt(data.minDeliveryFee, 10) || 100,
        maxDeliveryFee: parseInt(data.maxDeliveryFee, 10) || 1000,
      },
      create: {
        id: 'global',
        siteName: data.siteName,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroBtnText: data.heroBtnText,
        discountBadge: data.discountBadge,
        whatsapp: data.whatsapp,
        whishNumber: data.whishNumber,
        email: data.email,
        deliveryLocation: data.deliveryLocation || 'بيروت، لبنان',
        deliveryFee: deliveryFee,
        storeLatitude: parseFloat(data.storeLatitude) || 33.8938,
        storeLongitude: parseFloat(data.storeLongitude) || 35.5018,
        pricePerKm: parseFloat(data.pricePerKm) || 0.5,
        minDeliveryFee: parseInt(data.minDeliveryFee, 10) || 100,
        maxDeliveryFee: parseInt(data.maxDeliveryFee, 10) || 1000,
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
