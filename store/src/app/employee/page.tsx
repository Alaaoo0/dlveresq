"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة لجلب بيانات السائق والطلبات عند فتح الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      // قراءة كوكيز الجلسة
      const empId = document.cookie.split('; ').find(row => row.startsWith('emp_session='))?.split('=')[1];
      
      if (!empId) { 
        router.push('/employee/login'); 
        return; 
      }
      
      try {
        // جلب حالة التوفر والطلبات المسندة لهذا السائق
        const [empRes, ordersRes] = await Promise.all([
          fetch(`/api/employees?id=${empId}`).then(r => r.json()),
          fetch(`/api/employee/my-orders?empId=${empId}`).then(r => r.json())
        ]);
        
        if (empRes.length > 0) {
          setIsAvailable(empRes[0].isAvailable);
          // تصفية الطلبات التي لم يتم تسليمها بعد
          setOrders(ordersRes.filter((o: any) => o.status !== 'delivered'));
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // تبديل حالة التوفر (متاح / مشغول)
  const toggleAvailability = async () => {
    const empId = document.cookie.split('; ').find(row => row.startsWith('emp_session='))?.split('=')[1];
    await fetch('/api/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: empId, isAvailable: !isAvailable })
    });
    setIsAvailable(!isAvailable);
  };

  // تحديث حالة الطلب (بدء توصيل / تم التسليم)
  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    // تحديث الواجهة فوراً دون إعادة تحميل الصفحة
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // تسجيل الخروج
  const logout = () => {
    document.cookie = 'emp_session=; path=/; max-age=0';
    router.push('/employee/login');
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><p className="text-yellow-500 font-bold">جاري التحميل...</p></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20" dir="rtl">
      {/* الهيدر العلوي */}
      <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 z-10">
        <div>
          <h1 className="font-black text-xl text-yellow-500">🛵 لوحة السائق</h1>
          <p className="text-xs text-gray-400">متابعة طلبات التوصيل</p>
        </div>
        <button onClick={logout} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition">خروج</button>
      </header>

      {/* زر التحكم بالتوفر */}
      <div className="p-4">
        <button 
          onClick={toggleAvailability} 
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-lg ${
            isAvailable 
              ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
              : 'bg-gray-700 text-gray-400 border border-gray-600'
          }`}
        >
          {isAvailable ? '🟢 أنت متاح الآن' : '🔴 أنت غير متاح'}
        </button>
      </div>

      {/* قائمة الطلبات النشطة */}
      <div className="px-4 space-y-4">
        <h2 className="text-gray-400 text-sm font-bold mr-2">الطلبات المسندة ({orders.length})</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-600 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed mt-4">
            <p className="text-4xl mb-2">📭</p>
            <p className="font-medium">ما في طلبات مسندة لك حالياً</p>
            <p className="text-xs mt-2">انتظر حتى يقوم المدير بإسناد طلب جديد</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-lg transition-transform hover:scale-[1.02]">
              {/* رأس البطاقة */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === 'delivering' 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {order.status === 'delivering' ? '🚚 جاري التوصيل' : '🆕 طلب جديد'}
                </span>
                <span className="font-mono text-gray-500 text-xs bg-gray-900 px-2 py-1 rounded">#{order.id.slice(-6)}</span>
              </div>
              
              {/* تفاصيل الزبون */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">👤</span>
                  <p className="font-bold text-lg">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📞</span>
                  <p className="text-gray-300 font-mono" dir="ltr">{order.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">📍</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{order.address.split('|')[0]}</p>
                </div>
                {order.location && (
                  <a 
                    href={`https://www.google.com/maps?q=${order.location}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 text-xs bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition mt-1"
                  >
                    🔗 فتح موقع الزبون بالخريطة
                  </a>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-700">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'delivering')} 
                    className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    🛵 بدء التوصيل
                  </button>
                )}
                {order.status === 'delivering' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'delivered')} 
                    className="w-full bg-green-600 hover:bg-green-500 active:scale-95 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    ✅ تأكيد التسليم
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
