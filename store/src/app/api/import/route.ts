import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

export const dynamic = 'force-dynamic'; // السطر السحري

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
      const formData = await req.formData();
          const file = formData.get('file') as File;
              
                  if (!file) {
                        return NextResponse.json({ message: 'ما في ملف مرفوع' }, { status: 400 });
                            }

                                const text = await file.text();
                                    const records = parse(text, { columns: true, skip_empty_lines: true }) as any[];

                                        let count = 0;
                                            for (const row of records) {
                                                  const name = row.Title || row.name;
                                                        const priceString = row['Sale Price'] || row.price || '0';
                                                              const cleanPrice = parseFloat(String(priceString).replace(/[^0-9.]/g, '')) * 100;
                                                                    
                                                                          if (!name || !cleanPrice) continue;

                                                                                const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50) + '-' + Math.floor(Math.random() * 10000);
                                                                                      
                                                                                            const imgString = row.Images ? String(row.Images) : '';
                                                                                                  const imageUrl = imgString ? imgString.split(',')[0] : '';

                                                                                                        await prisma.product.create({
                                                                                                                data: {
                                                                                                                          name: String(name),
                                                                                                                                    slug: slug,
                                                                                                                                              price: Math.round(cleanPrice),
                                                                                                                                                        weight: 500,
                                                                                                                                                                  imageUrl: imageUrl,
                                                                                                                                                                            description: '',
                                                                                                                                                                                      stock: 10
                                                                                                                                                                                              }
                                                                                                                                                                                                    });
                                                                                                                                                                                                          count++;
                                                                                                                                                                                                              }

                                                                                                                                                                                                                  return NextResponse.json({ message: `تم استيراد ${count} منتج بنجاح!` });
                                                                                                                                                                                                                    } catch (error: any) {
                                                                                                                                                                                                                        console.error(error);
                                                                                                                                                                                                                            return NextResponse.json({ message: 'فشل الاستيراد', error: error.message }, { status: 500 });
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                              }