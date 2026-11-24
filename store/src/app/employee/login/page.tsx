"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // محاكاة تسجيل الدخول (لاحقاً نربطها بالـ API)
    setTimeout(() => {
      setLoading(false);
      router.push("/employee"); 
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden" dir="rtl">
      
      {/* خلفية متحركة بسيطة لإعطاء عمق */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[var(--accent)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8">
        
        {/* الشعار والعنوان */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-4xl">🏍️</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">بوابة الكابتن</h1>
          <p className="text-gray-400 text-sm font-medium">سجل دخولك لبدء استقبال طلبات التوصيل</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="space-y-5 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">رقم الهاتف</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="70 123 456"
              dir="ltr"
              className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-xl focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-lg font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-xl focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all text-lg"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20 text-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>ابدأ الوردة</span>
                <span>🚀</span>
              </>
            )}
          </button>
        </form>

        {/* روابط مساعدة */}
        <div className="text-center space-y-4 pt-4">
          <button className="text-sm text-gray-500 hover:text-white transition-colors">
            نسيت كلمة المرور؟
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <span>مدعوم من</span>
            <span className="font-bold text-gray-400">توصيل سريع</span>
          </div>
        </div>

      </div>
    </div>
  );
}
