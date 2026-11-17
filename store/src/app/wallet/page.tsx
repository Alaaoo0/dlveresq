"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert("أدخل مبلغ صحيح");
    setSubmitting(true);
    setMessage("");
    const res = await fetch("/api/wallet/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setMessage("✅ " + data.message);
      setAmount("");
    } else {
      setMessage("❌ " + data.message);
    }
  };

  if (loading) return <p className="text-center mt-20 font-bold">جاري التحميل...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <div className="mb-6">
        <Link href="/" className="text-gray-600 hover:text-black font-bold flex items-center gap-2 text-sm">
          <span>←</span> رجوع للرئيسية
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">المحفظة الإلكترونية</h1>
      <div className="bg-gradient-to-l from-red-600 to-red-400 text-white p-6 rounded-xl mb-8 shadow-md">
        <p className="text-sm opacity-90 mb-1">رصيدك الحالي</p>
        <p className="text-4xl font-black">${user?.walletBalance?.toFixed(2) || "0.00"}</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">طلب شحن رصيد</h2>
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ المطلوب ($)</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border p-3 rounded-lg text-black" placeholder="مثال: 10.00" required />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
            {submitting ? "جاري الإرسال..." : "إرسال طلب الشحن"}
          </button>
        </form>
        {message && <p className={`mt-4 text-sm font-bold text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
        <p className="text-xs text-gray-500 text-center mt-4">* سيتم مراجعة طلبك من قبل الإدارة، وسيتم إضافة الرصيد بعد الموافقة.</p>
      </div>
    </div>
  );
}
