
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !password) {
      setError("يرجى إدخال رقم الهاتف وكلمة المرور");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "رقم الهاتف أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/employee");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-5" dir="rtl">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-7 shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛵</div>
          <h1 className="text-2xl font-bold text-white">
            تطبيق الموظفين
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            سجّل دخولك لمتابعة طلبات التوصيل
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم هاتفك"
              autoComplete="tel"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold rounded-xl p-4 transition"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

        </form>

        <p className="text-center text-gray-500 text-xs mt-7">
          نظام إدارة وتوصيل الطلبات
        </p>

      </div>
    </main>
  );
}
