"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(true);
  const [charging, setCharging] = useState(false);
  const router = useRouter();

  const fetchBalance = () => {
    fetch("/api/user/wallet")
      .then(res => {
        if (res.status === 401) router.push("/login");
        return res.json();
      })
      .then(data => {
        if (data) setBalance(data.walletBalance || 0);
        setLoading(false);
      });
  };

  useEffect(() => { fetchBalance(); }, []);

  const handleCharge = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert("أدخل مبلغ صحيح");
    
    setCharging(true);
    const res = await fetch("/api/user/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    
    if (res.ok) {
      alert("تم شحن الرصيد بنجاح!");
      fetchBalance();
    } else {
      alert("فشل الشحن، حاول مرة أخرى.");
    }
    setCharging(false);
  };

  if (loading) return <p className="text-center mt-20 font-bold text-black">جاري التحميل...</p>;

  return (
    <main className="max-w-2xl mx-auto p-4 md:p-6 mt-10 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-red-600">محفظتي</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-red-500 font-semibold">← العودة للرئيسية</Link>
      </div>

      <div className="bg-gradient-to-l from-red-600 to-orange-500 rounded-2xl p-8 text-white shadow-lg mb-8 text-center">
        <p className="text-lg opacity-90 mb-2">رصيدك الحالي</p>
        <p className="text-5xl font-black">${(balance / 100).toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">شحن الرصيد</h2>
        
        <div className="flex gap-2 mb-4">
          {["5", "10", "20", "50"].map((val) => (
            <button 
              key={val} 
              onClick={() => setAmount(val)}
              className={`flex-1 py-2 rounded-lg font-bold border ${amount === val ? 'bg-red-50 border-red-600 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              ${val}
            </button>
          ))}
        </div>

        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="w-full border p-3 rounded-lg text-black mb-4 text-center text-xl font-bold" 
          placeholder="مبلغ آخر..."
        />
        
        <button 
          onClick={handleCharge} 
          disabled={charging}
          className="w-full bg-green-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {charging ? "جاري الشحن..." : `شحن $${amount}`}
        </button>
        
        <p className="text-xs text-gray-400 text-center mt-3">* الدفع الإلكتروني قيد التطوير، حالياً يتم الشحن مباشرة.</p>
      </div>
    </main>
  );
}
