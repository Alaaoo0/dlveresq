import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let settings: any = null;
  let categories: any[] = [];
  let products: any[] = [];

  try {
    settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
  } catch (error) {
    console.error("خطأ في الاتصال بقاعدة البيانات:", error);
    settings = {
      heroTitle: "جوعان؟ طلبك يوصلك!",
      heroSubtitle: "مطاعم، سوبرماركت، وصيدليات توصلك لباب البيت",
      discountBadge: "توصيل مجاني",
      deliveryLocation: "بيروت، لبنان",
    };
    categories = [
      { id: '1', name: '🍔 مطاعم' },
      { id: '2', name: '🛒 سوبرماركت' },
      { id: '3', name: '💊 صيدليات' },
    ];
  }

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-red-600 text-lg">📍</span>
            <span>التوصيل إلى: <span className="text-red-600">{settings?.deliveryLocation || 'بيروت، لبنان'}</span></span>
          </div>
          <Link href="/track" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
            🛵 تتبع طلبك
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white pb-20 pt-10 px-4 rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">{settings?.heroTitle || "جوعان؟ طلبك يوصلك!"}</h1>
          <p className="text-red-100 mb-6 text-lg">{settings?.heroSubtitle || "مطاعم، سوبرماركت، وصيدليات توصلك لباب البيت"}</p>
          <div className="bg-white rounded-full p-2 flex items-center shadow-xl max-w-lg mx-auto">
            <span className="text-gray-400 mr-3 text-xl">🔍</span>
            <input type="text" placeholder="عن شو بتدور؟ (برجر، دواء، خضار...)" className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400" />
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition">بحث</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1"><span className="text-2xl">🚀</span><span className="text-xs font-bold text-gray-700">توصيل سريع</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-2xl">💵</span><span className="text-xs font-bold text-gray-700">دفع عند الاستلام</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-2xl">🎁</span><span className="text-xs font-bold text-gray-700">عروض يومية</span></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📂</span> الأقسام</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.name}`} className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px] group">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-100 transition border border-red-100">{cat.name.split(' ')[0]}</div>
                <span className="text-sm font-semibold text-gray-700 text-center">{cat.name.split(' ').slice(1).join(' ')}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>🔥</span> الأكثر طلباً</h2>
            <Link href="/products" className="text-red-600 text-sm font-bold hover:underline">عرض الكل ←</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.length > 0 ? products.map((product) => (
              <Link key={product.id} href={`/product?slug=${product.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="relative h-40 bg-gray-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🍽️</div>
                  )}
                  {settings?.discountBadge && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">{settings.discountBadge}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2"><span>⭐ 4.8</span><span>•</span><span>🕒 30-45 دقيقة</span></div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-black text-lg">${(product.price / 100).toFixed(2)}</span>
                    <button className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-2xl border border-gray-100">لا توجد منتجات متاحة حالياً.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
