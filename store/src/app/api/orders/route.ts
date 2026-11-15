import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';



export async function POST(req: Request) {
  try {
      const { customerName, phone, address, items, total } = await req.json();

          if (!customerName || !phone || !address || !items || items.length === 0) {
                return NextResponse.json({ message: 'البيانات ناقصة' }, { status: 400 });
                    }

                        // بنشوف إذا في زبون مسجل دخول
                            const cookieStore = await cookies();
                                const userId = cookieStore.get('user_session')?.value;

                                    const order = await prisma.order.create({
                                          data: {
                                                  customerName,
                                                          phone,
                                                                  address,
                                                                          total: Math.round(total),
                                                                                  userId: userId || null, // هون ربطنا الطلب بالزبون
                                                                                          items: {
                                                                                                    create: items.map((item: any) => ({
                                                                                                                productId: item.id,
                                                                                                                            quantity: item.quantity,
                                                                                                                                        price: Math.round(item.price),
                                                                                                                                                  })),
                                                                                                                                                          },
                                                                                                                                                                },
                                                                                                                                                                    });

                                                                                                                                                                        return NextResponse.json({ message: 'تم استلام الطلب', orderId: order.id }, { status: 201 });
                                                                                                                                                                          } catch (error: any) {
                                                                                                                                                                              console.error("API ERROR:", error.message);
                                                                                                                                                                                  return NextResponse.json({ message: 'فشل في السيرفر', error: error.message }, { status: 500 });
                                                                                                                                                                                    }
                                                                                                                                                                                    }