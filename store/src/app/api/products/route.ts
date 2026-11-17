import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

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
                            const { name, price, stock, imageUrl, weight, category, shippingCost } = body;
                                
                                    // التأكد من إنه الاسم والسعر موجودين
                                        if (!name || !price) {
                                              return NextResponse.json({ message: 'الاسم والسعر مطلوبين' }, { status: 400 });
                                                  }

                                                      const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + Date.now();

                                                          // ✅ استخدمنا (prisma.product as any) لتجاوز مشكلة TypeScript على Vercel
                                                              const product = await (prisma.product as any).create({
                                                                    data: {
                                                                            name, 
                                                                                    slug,
                                                                                            price: Math.round(parseFloat(price) * 100),
                                                                                                    stock: parseInt(stock) || 0,
                                                                                                            weight: parseInt(weight) || 500,
                                                                                                                    imageUrl: imageUrl || null,
                                                                                                                            category: category || "أجهزة الكترونية",
                                                                                                                                    shippingCost: parseFloat(shippingCost) || 0
                                                                                                                                          },
                                                                                                                                              });
                                                                                                                                                  
                                                                                                                                                      return NextResponse.json(product);
                                                                                                                                                        } catch (error: any) {
                                                                                                                                                            console.error("PRODUCT ADD ERROR:", error);
                                                                                                                                                                return NextResponse.json({ message: 'فشل الإضافة: ' + error.message }, { status: 500 });
                                                                                                                                                                  }
                                                                                                                                                                  }