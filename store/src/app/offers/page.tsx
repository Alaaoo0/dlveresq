"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OffersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coupons")
      .then(res => res.json())
      .then(data => {
        const activeCoupons = data.filter((c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date()));
        setCoupons(activeCoupons);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <p className="text-center mt-20 font-bold">جاري تحميل العروض...</p>;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 mt-10 min-h-screen" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">🎁 العروض والكوبونات</h1>
        <p className="text-gray-500 text-lg">وفر أكثر مع كوبونات الخصم الحصرية. انسخ الكود واستخدمه عند الدفع!</p>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-2xl shadow-sm border">
          <p className="text-5xl mb-4">😔</p>
          <h2 className="text-xl font-bold text-gray-800">ما في عروض حالياً</h2>
          <p className="text-gray-500 mt-2">تابعنا قريباً، نحن دائماً نحضر لك المفاجآت!</p>
          <Link href="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-lg font-bold">تسوق الآن</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-l from-red-500 to-orange-400 p-4 text-white text-center">
                <span className="text-3xl font-black">
                  {coupon.type === "PERCENTAGE" ? `${coupon.value}% خصم` : `$${coupon.value} خصم`}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-600 mb-2">الحد الأدنى للطلب: <span className="font-bold">${coupon.minOrderValue}</span></p>
                  {coupon.maxUses && (
                    <p className="text-gray-500 text-sm mb-2">متبقي: {coupon.maxUses - coupon.usedCount} استخدام</p>
                  )}
                  {coupon.expiresAt && (
                    <p className="text-red-500 text-sm font-bold mb-4">ينتهي في: {new Date(coupon.expiresAt).toLocaleDateString('ar-LB')}</p>
                  )}
                </div>
                
                <div 
                  onClick={() => copyToClipboard(coupon.code)}
                  className="mt-4 border-2 border-dashed border-red-300 bg-red-50 p-3 rounded-xl text-center cursor-pointer hover:bg-red-100 transition-colors"
                >
                  <p className="text-sm text-red-600 font-bold mb-1">اضغط لنسخ الكود</p>
                  <p className="text-xl font-mono font-black text-gray-900 tracking-widest">{coupon.code}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {copiedCode && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg z-50 animate-bounce">
          ✅ تم نسخ الكود: {copiedCode}
        </div>
      )}
    </main>
  );
}
