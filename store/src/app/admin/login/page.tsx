"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ التحقق تلقائياً إذا كان المدير مسجل دخول سابقاً
  useEffect(() => {
    const isAdminLoggedIn = document.cookie.includes('admin_session=true');
    if (isAdminLoggedIn) {
      // إذا كان مسجل دخول، نحوله فوراً للوحة التحكم
      window.location.href = "/admin";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ⚠️ غيّر "123456" لكلمة السر اللي بدك ياها للمدير
    const ADMIN_PASSWORD = "123456"; 

    if (password === ADMIN_PASSWORD) {
      // حفظ الجلسة لمدة 30 يوم
      document.cookie = `admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
      
      // ✅ إعادة تحميل كاملة للصفحة للدخول للإدارة دغري
      window.location.href = "/admin"; 
    } else {
      setError("كلمة المرور غير صحيحة!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">دخول الإدارة</h1>
        <p className="text-gray-500 text-sm mb-6">أدخل كلمة المرور للوصول للوحة التحكم</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-red-500 outline-none transition-all"
            placeholder="••••••"
            required
            autoFocus
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
