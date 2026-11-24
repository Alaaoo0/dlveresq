// ... (نفس الاستيرادات والبيانات الوهمية من الكود السابق)

return (
  <div className="min-h-screen bg-[var(--background)] pb-20 relative" dir="rtl">
    
    {/* خلفية نمطية خفيفة للصفحة الرئيسية */}
    <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ 
      backgroundImage: 'radial-gradient(#2563EB 1.5px, transparent 1.5px)', 
      backgroundSize: '20px 20px' 
    }} />

    {/* 1. الهيدر والبحث (مع خلفية متدرجة وأيقونات جانبية) */}
    <header className="bg-[var(--primary)] text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden z-10">
      {/* زخارف خلفية */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--accent)]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      {/* شريط الموقع العلوي */}
      <div className="flex justify-between items-center mb-6 text-blue-100 text-sm font-medium">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
          <span>📍</span>
          <span>التوصيل إلى: صيدا، لبنان</span>
          <span className="text-xs">▼</span>
        </div>
        <Link href="/track" className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/20 transition">
          <span>🛵</span>
          <span>تتبع طلبك</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-sm">
          جوعان؟ طلبك يوصلك<br/>لباب البيت! 🛵
        </h1>
        <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">
          أفضل المطاعم، السوبرماركت، والصيدليات في مدينتك
        </p>

        {/* شريط البحث العصري */}
        <div className="relative max-w-xl mx-auto group">
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

    {/* ... (باقي محتوى الصفحة من الأقسام والمنتجات كما هو بالكود السابق) ... */}
