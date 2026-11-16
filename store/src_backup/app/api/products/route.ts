import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
      const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
          return NextResponse.json(products);
            } catch (error) {
                return NextResponse.json({ message: 'فشل جلب المنتجات' }, { status: 500 });
                  }
                  }

                  export async function POST(req: Request) {
                    try {
                        const body = await req.json();
                            const { name, price, stock, imageUrl, weight, category } = body;
                                
                                    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + Date.now();

                                        // 1. بنحفظ المنتج بالداتابيز
                                            const product = await prisma.product.create({
                                                  data: {
                                                          name, 
                                                                  slug,
                                                                          price: Math.round(price * 100),
                                                                                  stock: parseInt(stock),
                                                                                          weight: parseInt(weight) || 500,
                                                                                                  imageUrl,
                                                                                                          category: category || "أجهزة الكترونية"
                                                                                                                },
                                                                                                                    });

                                                                                                                        // 2. هون السر: بنبعت إشعار للكل بعد ما ينحفظ المنتج
                                                                                                                            try {
                                                                                                                                  const origin = new URL(req.url).origin;
                                                                                                                                        await fetch(`${origin}/api/push/send`, {
                                                                                                                                                method: 'POST',
                                                                                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                                                                                                body: JSON.stringify({
                                                                                                                                                                          title: 'منتج جديد وصل! 🚀',
                                                                                                                                                                                    body: `تصفح ${product.name} الآن في متجرنا.`,
                                                                                                                                                                                              url: `/product?slug=${product.slug}`
                                                                                                                                                                                                      })
                                                                                                                                                                                                            });
                                                                                                                                                                                                                } catch (pushError) {
                                                                                                                                                                                                                      // إذا فشل الإشعار ما منوقف حفظ المنتج
                                                                                                                                                                                                                            console.error("Push notification failed:", pushError); 
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                    return NextResponse.json(product);
                                                                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                                                                          return NextResponse.json({ message: 'فشل الإضافة' }, { status: 500 });
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            }