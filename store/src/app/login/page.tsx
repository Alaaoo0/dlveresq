"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// تحميل الخريطة بشكل ديناميكي لتحسين الأداء ومنع أخطاء SSR
const MapComponent = dynamic(() => import("@/components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-100 animate-pulse" /> 
});

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "locating" | "found">("idle");
  const router = useRouter();

  // محاكاة تحديد الموقع عند فتح الصفحة لإعطاء شعور احترافي
  useEffect(() => {
    setLocationStatus("locating");
    setTimeout(() => setLocationStatus("found"), 1500);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // محاكاة تسجيل الدخول (لاحقاً نربطها بالـ API الفعلي)
    setTimeout(() => {
      setLoading(false);
      router.push("/"); 
    }, 1500);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50" dir="rtl">
      
      {/* 1. خلفية الخريطة التفاعلية */}
      <div className="absolute inset-0 z-0 opacity-90">
        <MapComponent 
          centerLat={33.8938} 
          centerLng={35.5018} 
          height="h-full" 
          showStoreMarker={false}
          onLocationSelect={() => {}} // ✅ التصحيح: إضافة دالة فارغة لتجنب خطأ الـ Build
        />
        {/* طبقة تدرج لوني عشان النص يكون واضح فوق الخريطة */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* 2. المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-12 px-6 max-w-md mx-auto">
        
        {/* رسالة ترحيبية متحركة */}
        <div className="mb-8 text-center space-y-2 animate-fade-in-up">
          <div className="inline-block p-3 bg-[var(--primary)] rounded-2xl shadow-lg mb-2 transform -rotate-6">
            <span className="text-3xl">🛵</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)]">أهلاً بك في توصيل سريع</h1>
          <p className="text-[var(--text-muted)] font-medium">سجل دخولك لتتبع طلباتك لحظة بلحظة</p>
        </div>

        {/* بطاقة تسجيل الدخول العائمة */}
        <form onSubmit={handleLogin} className="card-modern space-y-4 backdrop-blur-sm bg-white/95 border-none shadow-[var(--shadow-lg)]">
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-[var(--text-muted)] mr-1">رقم الهاتف</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="70 123 456"
              dir="ltr"
              className="input-modern text-left font-mono tracking-wide"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-[var(--text-muted)] mr-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-modern"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2 text-lg py-4"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>دخول آمن</span>
                <span>←</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-[var(--text-muted)]">
              ليس لديك حساب؟ <button type="button" onClick={() => router.push("/register")} className="text-[var(--primary)] font-bold hover:underline">أنشئ حساب جديد</button>
            </p>
          </div>
        </form>

        {/* مؤشر حالة الموقع */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)] bg-white/80 py-2 px-4 rounded-full w-fit mx-auto backdrop-blur-md shadow-sm">
          {locationStatus === "locating" ? (
            <>
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              جاري تحديد موقعك...
            </>
          ) : locationStatus === "found" ? (
            <>
              <span className="w-2 h-2 bg-[var(--success)] rounded-full" />
              تم تحديد موقعك بدقة ✅
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
