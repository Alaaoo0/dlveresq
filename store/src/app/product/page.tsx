import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddToCartButton from "./AddToCartButton";
import { PrismaClient } from "@prisma/client"; // جبنا المكتبة مباشرة

const prisma = new PrismaClient(); // شغلناها هون

async function ProductDetails({ searchParams }: { searchParams: Promise<{ slug: string }> }) {
  const { slug } = await searchParams;
      
        const product = await prisma.product.findFirst({
            where: {
                  OR: [
                          { slug: slug },
                                  { id: slug }
                                        ]
                                            }
                                              });

                                                if (!product) {
                                                    notFound();
                                                      }

                                                        return (
                                                            <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                  <div>
                                                                          {product.imageUrl ? (
                                                                                    <img
                                                                                                src={product.imageUrl}
                                                                                                            alt={product.name}
                                                                                                                        className="w-full h-80 object-cover rounded-lg bg-gray-100"
                                                                                                                                  />
                                                                                                                                          ) : (
                                                                                                                                                    <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                                                                                                                                لا توجد صورة
                                                                                                                                                                          </div>
                                                                                                                                                                                  )}
                                                                                                                                                                                        </div>
                                                                                                                                                                                              
                                                                                                                                                                                                    <div>
                                                                                                                                                                                                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                                                                                                                                                                                                                    <p className="text-3xl text-green-600 font-bold mb-6">
                                                                                                                                                                                                                              ${(product.price / 100).toFixed(2)}
                                                                                                                                                                                                                                      </p>
                                                                                                                                                                                                                                              <p className="text-gray-600 mb-6">الوزن: {product.weight} غرام</p>
                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                              <AddToCartButton 
                                                                                                                                                                                                                                                                        product={{ 
                                                                                                                                                                                                                                                                                    id: product.id, 
                                                                                                                                                                                                                                                                                                name: product.name, 
                                                                                                                                                                                                                                                                                                            price: product.price, 
                                                                                                                                                                                                                                                                                                                        imageUrl: product.imageUrl 
                                                                                                                                                                                                                                                                                                                                  }} 
                                                                                                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                                      export default function ProductPage({ searchParams }: { searchParams: Promise<{ slug: string }> }) {
                                                                                                                                                                                                                                                                                                                                                        return (
                                                                                                                                                                                                                                                                                                                                                            <main className="max-w-4xl mx-auto p-6" dir="rtl">
                                                                                                                                                                                                                                                                                                                                                                  <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
                                                                                                                                                                                                                                                                                                                                                                          ← رجوع للمتجر
                                                                                                                                                                                                                                                                                                                                                                                </Link>
                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                            <Suspense fallback={<p className="text-center text-gray-500">جاري تحميل المنتج...</p>}>
                                                                                                                                                                                                                                                                                                                                                                                                    <ProductDetails searchParams={searchParams} />
                                                                                                                                                                                                                                                                                                                                                                                                          </Suspense>
                                                                                                                                                                                                                                                                                                                                                                                                              </main>
                                                                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                                                                }