"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/employee/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password, action: "login" }),
    });
    const data = await res.json();
    if (res.ok) {
      document.cookie = `emp_session=${data.id}; path=/; max-age=86400`;
      router.push("/employee");
      router.refresh();
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6 text-center">🛵 بوابة السائقين</h1>
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">رقم الهاتف</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-xl focus:border-yellow-500 outline-none" placeholder="مثال: 70123456" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">كلمة السر</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-xl focus:border-yellow-500 outline-none" placeholder="••••••" required />
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transition-colors text-lg">دخول</button>
        </form>
      </div>
    </div>
  );
}
