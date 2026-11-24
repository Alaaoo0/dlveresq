"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // محاكاة جلب الطلبات عند فتح الصفحة
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        { id: "ORD-8821", customer: "أحمد محمد", address: "بيروت، الحمرا، شارع بغداد", price: "15,000 ل.ل", distance: "2.5 كم" },
        { id: "ORD-9932", customer: "سارة علي", address: "المصيطبة، قرب مستشفى أوتيل ديو", price: "22,000 ل.ل", distance: "4.1 كم" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    // هنا لاحقاً نربط مع الـ API لتغيير حالة التوفر
  };

  const acceptOrder = (id: string) => {
    alert(`تم قبول الطلب ${id}! جاري توجيهك للخريطة...`);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24" dir="rtl">
      
      {/* 1. الهيدر العلوي */}
      <header className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-white">لوحة الكابتن</h1>
          <p className="text-xs text-gray-400">مرحباً بك، كابتن يوسف 👋</p>
        </div>
        <button onClick={() => router.push("/employee/login")} className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition">
          🚪
        </button>
      </header>

      {/* 2. زر التوفر الرئيسي (On/Off) */}
      <div className="p-6">
        <button 
          onClick={toggleOnline}
          className={`w-full py-5 rounded-2xl font-black text-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${
            isOnline 
              ? 'bg-green-500 text-white shadow-green-500/30 scale-[1.02]' 
              : 'bg-gray-900 text-gray-500 border border-gray-800'
          }`}
        >
          {isOnline ? (
            <>
              <span className="w-4 h-4 bg-white rounded-full animate-pulse" />
              أنت متاح الآن
            </>
          ) : (
            <>
              <span className="text-2xl">🔒</span>
              اضغط لبدء العمل
            </>
          )}
        </button>
        
        {!isOnline && (
          <p className="text-center text-xs text-gray-600 mt-3">فعّل التوفر لاستقبال طلبات التوصيل الجديدة</p>
        )}
      </div>

      {/* 3. قائمة الطلبات النشطة */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-lg font-bold text-gray-300">الطلبات المتاحة ({orders.length})</h2>
          <span className="text-xs text-[var(--accent)] font-bold cursor-pointer">تحديث القائمة ↻</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-40 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
            <span className="text-5xl mb-4 block opacity-50">📭</span>
            <p className="text-gray-500 font-medium">لا توجد طلبات جديدة حالياً</p>
            <p className="text-xs text-gray-600 mt-2">انتظر قليلاً أو تأكد من أنك في منطقة نشطة</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card-modern bg-gray-900 border-gray-800 !p-0 overflow-hidden group">
              
              {/* رأس البطاقة */}
              <div className="p-4 border-b border-gray-800 flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg mb-2">#{order.id}</span>
                  <h3 className="font-black text-lg text-white">{order.customer}</h3>
                </div>
                <div className="text-left">
                  <p className="text-[var(--accent)] font-black text-xl">{order.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.distance}</p>
                </div>
              </div>

              {/* تفاصيل العنوان */}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">📍</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{order.address}</p>
                </div>
                
                {/* أزرار الإجراءات */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="py-3 rounded-xl bg-gray-800 text-gray-400 font-bold text-sm hover:bg-gray-700 transition">
                    التفاصيل
                  </button>
                  <button 
                    onClick={() => acceptOrder(order.id)}
                    className="py-3 rounded-xl bg-[var(--primary)] text-white font-black text-sm hover:bg-[var(--primary-dark)] transition shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    قبول الطلب ✓
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* شريط تنقل سفلي ثابت (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-6 py-3 flex justify-around items-center z-30 pb-safe">
        <button className="flex flex-col items-center gap-1 text-[var(--primary)]">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold">إحصائياتي</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-bold">الإعدادات</span>
        </button>
      </nav>

    </div>
  );
}
