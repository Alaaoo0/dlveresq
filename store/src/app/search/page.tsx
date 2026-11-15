import Link from "next/link";
import { PrismaClient } from "@prisma/client";

export const instant = false;
const prisma = new PrismaClient();

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
    const query = q || "";

      // البحث بالداتابيز (بيبحث بالاسم وبيكون حساس لحالة الأحرف)
        const products = await prisma.product.findMany({
            where: {
                  name: {
                          contains: query,
                                  mode: "insensitive", 
                                        },
                                            },
                                                orderBy: { createdAt: "desc" },
                                                  });

                                                    return (
                                                        <main className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen" dir="rtl">
                                                              <div className="mb-6 border-b pb-4">
                                                                      <h1 className="text-2xl font-bold text-gray-900">
                                                                                نتائج البحث عن: <span className="text-red-600">"{query}"</span>
                                                                                        </h1>
                                                                                                <p className="text-gray-500 mt-1">تم العثور على {products.length} منتج</p>
                                                                                                      </div>

                                                                                                            {products.length === 0 ? (
                                                                                                                    <div className="text-center py-20">
                                                                                                                              <p className="text-4xl mb-4">🔍</p>
                                                                                                                                        <h2 className="text-xl font-bold text-gray-800 mb-2">ما لقينا أي منتج!</h2>
                                                                                                                                                  <p className="text-gray-500 mb-6">جرب تدور بكلمة تانية أو تأكد من الإملاء.</p>
                                                                                                                                                            <Link href="/" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">
                                                                                                                                                                        ارجع للمتجر
                                                                                                                                                                                  </Link>
                                                                                                                                                                                          </div>
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                                                                                                                                                                                                  {products.map((product) => (
                                                                                                                                                                                                                              <Link key={product.id} href={`/product?slug=${product.slug}`} className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                                                                                                                                                                                                                                            <div className="relative w-full h-40 sm:h-48 bg-gray-50 overflow-hidden">
                                                                                                                                                                                                                                                            {product.imageUrl && (
                                                                                                                                                                                                                                                                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                          <div className="p-2 sm:p-3">
                                                                                                                                                                                                                                                                                                                                          <h2 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-tight h-9">{product.name}</h2>
                                                                                                                                                                                                                                                                                                                                                          <div className="mt-1 flex items-baseline gap-1">
                                                                                                                                                                                                                                                                                                                                                                            <p className="text-base sm:text-lg font-black text-red-600">${(product.price / 100).toFixed(2)}</p>
                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                      </Link>
                                                                                                                                                                                                                                                                                                                                                                                                                                ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                  </main>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                                                                                                                                                                                    }