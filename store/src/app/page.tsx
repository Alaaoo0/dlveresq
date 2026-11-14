import Link from "next/link";
import { PrismaClient } from "@prisma/client";

// هالسطر السحري بيمنع Next.js من عمل Prerender وبيمنع الخطأ
export const instant = false;

const prisma = new PrismaClient();

async function ProductList() {
  const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
        });

          if (products.length === 0) {
              return <p className="text-center text-gray-500 py-10">ما في منتجات حالياً.</p>;
                }

                  return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                    <Link key={product.id} href={`/product?slug=${product.slug}`} className="block hover:shadow-lg transition-shadow">
                                              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                                                          {product.imageUrl ? (
                                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4 bg-gray-100" />
                                                                                    ) : (
                                                                                                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">لا توجد صورة</div>
                                                                                                              )}
                                                                                                                          <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                                                                                                                                      <p className="text-green-600 font-bold mt-2 text-lg">${(product.price / 100).toFixed(2)}</p>
                                                                                                                                                </div>
                                                                                                                                                        </Link>
                                                                                                                                                              ))}
                                                                                                                                                                  </div>
                                                                                                                                                                    );
                                                                                                                                                                    }

                                                                                                                                                                    export default async function Home() {
                                                                                                                                                                      return (
                                                                                                                                                                          <main className="max-w-6xl mx-auto p-4" dir="rtl">
                                                                                                                                                                                <h1 className="text-3xl font-bold mb-8 text-center mt-6 text-gray-900">كل المنتجات</h1>
                                                                                                                                                                                      <ProductList />
                                                                                                                                                                                          </main>
                                                                                                                                                                                            );
                                                                                                                                                                                            }