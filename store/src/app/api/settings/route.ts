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

    // ✅ دعم قيمة 0 (مجاني) بدون ما ترجع 200 — والقيمة بالسنتات
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
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
