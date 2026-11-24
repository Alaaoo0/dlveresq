import Link from "next/link";

export default function HomePage() {
  // بيانات وهمية للأقسام (يمكن استبدالها ببيانات حقيقية من API لاحقاً)
  const categories = [
    { name: "مطاعم", icon: "🍔", color: "bg-orange-100 text-orange-600" },
    { name: "سوبرماركت", icon: "🛒", color: "bg-blue-100 text-blue-600" },
    { name: "صيدليات", icon: "💊", color: "bg-green-100 text-green-600" },
    { name: "حلويات ومخابز", icon: "🍰", color: "bg-pink-100 text-pink-600" },
    { name: "خضار وفواكه", icon: "🥦", color: "bg-emerald-100 text-emerald-600" },
    { name: "هواتف وإلكترونيات", icon: "📱", color: "bg-purple-100 text-purple-600" },
  ];

  // بيانات وهمية للمنتجات الأكثر طلباً
  const popularProducts = [
    { id: 1, name: "برجر دبل تشيز", price: 3.00, rating: 4.8, time: "30-45 دقيقة", image: "🍔", discount: true },
    { id: 2, name: "شاورما عربي", price: 30.00, rating: 4.9, time: "20-30 دقيقة", image: "🌯", discount: false },
    { id: 3, name: "بيتزا مارغريتا", price: 5.50, rating: 4.7, time: "40-50 دقيقة", image: "🍕", discount: true },
    { id: 4, name: "كرسبي تشيكن", price: 4.00, rating: 4.6, time: "25-35 دقيقة", image: "🍗", discount: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 relative overflow-hidden" dir="rtl">
      
      {/* ✅ خلفية نمطية حيوية (نقاط خفيفة جداً) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'radial-gradient(#2563EB 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} 
      />

      {/* 1. الهيدر والبحث (باللون الأزرق الجديد + شريط موقع) */}
      <header className="bg-[var(--primary)] text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden z-10">
        {/* زخارف خلفية ناعمة */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--accent)]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          
          {/* شريط الموقع والتتبع العلوي */}
          <div className="flex justify-between items-center text-blue-100 text-xs font-bold mb-2">
            <Link href="/track" className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/20 transition border border-white/10">
              <span>🛵</span>
              <span>تتبع طلبك</span>
            </Link>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/20 transition border border-white/10">
              <span>📍</span>
              <span>التوصيل إلى: صيدا، لبنان</span>
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* العنوان الرئيسي */}
          <div className="text-center space-y-2 mt-4">
            <h1 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-sm">
              جوعان؟ طلبك يوصلك<br/>لباب البيت! 🛵
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">
              أفضل المطاعم، السوبرماركت، والصيدليات في مدينتك
            </p>
          </div>

          {/* شريط البحث العصري */}
          <div className="relative max-w-xl mx-auto group mt-6">
            <input 
              type="text" 
              placeholder="عن شو بتدور؟ (برجر، دواء، خضار...)"
              className="w-full py-4 pr-12 pl-4 rounded-full text-gray-900 shadow-xl focus:ring-4 focus:ring-blue-400/30 outline-none text-right transition-all group-hover:shadow-2xl"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">🔍</span>
            <button className="absolute left-2 top-2 bottom-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-gray-900 font-bold px-6 rounded-full transition-colors shadow-md">
              بحث
            </button>
          </div>
        </div>
      </header>

      {/* 2. الميزات السريعة (بطاقات عائمة) */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-20 mb-10">
        <div className="card-modern grid grid-cols-3 gap-4 text-center p-4 !py-6 border-none shadow-lg">
          <div className="space-y-2 group cursor-default">
            <span className="text-3xl block group-hover:scale-110 transition-transform">🚀</span>
            <p className="text-xs font-bold text-[var(--text-main)]">توصيل سريع</p>
          </div>
          <div className="space-y-2 border-r border-l border-gray-100 group cursor-default">
            <span className="text-3xl block group-hover:scale-110 transition-transform">💵</span>
            <p className="text-xs font-bold text-[var(--text-main)]">دفع عند الاستلام</p>
          </div>
          <div className="space-y-2 group cursor-default">
            <span className="text-3xl block group-hover:scale-110 transition-transform">🎁</span>
            <p className="text-xs font-bold text-[var(--text-main)]">عروض يومية</p>
          </div>
        </div>
      </div>

      {/* 3. الأقسام */}
      <section className="max-w-3xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
            <span>📂</span> الأقسام
          </h2>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link href={`/category/${i}`} key={i} className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. الأكثر طلباً */}
      <section className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
            <span>🔥</span> الأكثر طلباً
          </h2>
          <Link href="/products" className="text-sm font-bold text-[var(--primary)] hover:underline">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularProducts.map((product) => (
            <div key={product.id} className="card-modern !p-0 overflow-hidden group cursor-pointer border border-gray-100">
              {/* صورة المنتج (وهمية حالياً باستخدام إيموجي كبير) */}
              <div className="h-40 bg-gray-50 flex items-center justify-center text-7xl group-hover:bg-gray-100 transition-colors relative">
                {product.image}
                {product.discount && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    خصم 20%
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-black text-lg text-[var(--text-main)] mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                  <span className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 font-bold">⭐ {product.rating}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">⏱️ {product.time}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-[var(--primary)]">${product.price.toFixed(2)}</span>
                  <button className="w-10 h-10 rounded-full bg-[var(--background)] border border-gray-200 text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all active:scale-90 shadow-sm">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
