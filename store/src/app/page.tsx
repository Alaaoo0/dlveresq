import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  const products = await prisma.product.findMany({ 
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    take: 8 
  });

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* 1. Hero Section (شعار التطبيق والبحث) */}
      <div className="bg-red-600 text-white pb-16 pt-10 px-4 rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            {settings?.heroTitle || "جوعان؟ طلبك يوصلك!"}
          </h1>
          <p className="text-red-100 mb-6 text-lg">
            {settings?.heroSubtitle || "مطاعم، سوبرماركت، وصيدليات توصلك لباب البيت"}
          </p>
          
          {/* شريط البحث الوهمي (للتصميم) */}
          <div className="bg-white rounded-full p-2 flex items-center shadow-xl max-w-lg mx-auto">
            <span className="text-gray-400 mr-3 text-xl">🔍</span>
            <input 
              type="text" 
              placeholder="عن شو بتدور؟ (برجر، دواء، خضار...)" 
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition">
              بحث
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        {/* 2. الأقسام (Categories) */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📂</span> الأقسام
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/products?category=${cat.name}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-100 transition border border-red-100">
                  {cat.name.split(' ')[0]} {/* يأخذ الإيموجي */}
                </div>
                <span className="text-sm font-semibold text-gray-700 text-center">
                  {cat.name.split(' ').slice(1).join(' ')} {/* يأخذ النص */}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. المنتجات / المطاعم المميزة */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🔥</span> الأكثر طلباً
            </h2>
            <Link href="/products" className="text-red-600 text-sm font-bold hover:underline">
              عرض الكل ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product?slug=${product.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🍽️</div>
                  )}
                  {settings?.discountBadge && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {settings.discountBadge}
                    </span>
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <span>⭐ 4.8</span>
                    <span>•</span>
                    <span>🕒 30-45 دقيقة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-black text-lg">${(product.price / 100).toFixed(2)}</span>
                    <button className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
