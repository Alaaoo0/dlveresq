"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden" dir="rtl">
      
      {/* 1. خلفية متحركة حيوية (نمط نقاط + أيقونات عائمة) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {/* نمط النقاط */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} />
        
        {/* أيقونات التوصيل العائمة والمتحركة */}
        <div className="absolute top-20 right-10 text-6xl animate-bounce-slow opacity-50 rotate-12">🛵</div>
        <div className="absolute bottom-40 left-10 text-5xl animate-pulse opacity-40 -rotate-12">🚗</div>
        <div className="absolute top-1/2 right-1/4 text-4xl animate-bounce opacity-30">📦</div>
        <div className="absolute bottom-20 right-1/3 text-6xl animate-spin-slow opacity-20">🍔</div>
      </div>

      {/* 2. المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 pt-20">
        
        {/* اللوجو والترحيب */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-500 border-4 border-[var(--primary)]/10">
            <span className="text-7xl filter drop-shadow-lg">🛵</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] leading-tight">
            توصيل سريع<br/>
            <span className="text-[var(--primary)]">لباب بيتك!</span>
          </h1>
          
          <p className="text-[var(--text-muted)] text-lg max-w-xs mx-auto leading-relaxed">
            أسرع خدمة توصيل في المدينة. مطاعم، سوبرماركت، وكل شي بدك ياه.
          </p>
        </div>

        {/* الأزرار السفلية */}
        <div className="space-y-4 w-full max-w-sm mx-auto pb-8">
          <button 
            onClick={() => router.push("/")}
            className="btn-primary w-full py-5 text-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
          >
            <span>ابدأ الطلب الآن</span>
            <span className="group-hover:-translate-x-2 transition-transform">←</span>
          </button>

          <button 
            onClick={() => router.push("/employee/login")}
            className="w-full py-4 bg-white border-2 border-gray-200 text-[var(--text-muted)] font-bold rounded-[1rem] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2"
          >
            <span>🏍️</span>
            <span>بوابة السائقين</span>
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            بالتسجيل أنت توافق على شروط الاستخدام وسياسة الخصوصية
          </p>
        </div>

      </div>

      {/* تعريف الأنيميشن المخصصة */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
