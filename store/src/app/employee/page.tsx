"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const empId = document.cookie.split('; ').find(row => row.startsWith('emp_session='))?.split('=')[1];
      if (!empId) { router.push('/employee/login'); return; }
      
      // جلب بيانات الموظف والطلبات المسندة له
      const [empRes, ordersRes] = await Promise.all([
        fetch(`/api/employees?id=${empId}`).then(r => r.json()),
        fetch(`/api/employee/my-orders?empId=${empId}`).then(r => r.json())
      ]);
      
      if (empRes.length > 0) {
        setIsAvailable(empRes[0].isAvailable);
        setOrders(ordersRes.filter((o: any) => o.status !== 'delivered'));
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const toggleAvailability = async () => {
    const empId = document.cookie.split('; ').find(row => row.startsWith('emp_session='))?.split('=')[1];
    await fetch('/api/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: empId, isAvailable: !isAvailable })
    });
    setIsAvailable(!isAvailable);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const logout = () => {
    document.cookie = 'emp_session=; path=/; max-age=0';
    router.push('/employee/login');
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><p className="text-yellow-500 font-bold">جاري التحميل...</p></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20" dir="rtl">
      {/* الهيدر */}
      <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 z-10">
        <div>
          <h1 className="font-black text-xl text-yellow-500">🛵 لوحة السائق</h1>
          <p className="text-xs text-gray-400">متابعة طلبات التوصيل</p>
        </div>
        <button onClick={logout} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-lg">خروج</button>
      </header>

      {/* زر التوفر */}
      <div className="p-4">
        <button onClick={toggleAvailability} className={`w-full py-4 rounded-2xl font-black text-xl transition-all ${isAvailable ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-gray-700 text-gray-400'}`}>
          {isAvailable ? '🟢 أنت متاح الآن' : '🔴 أنت غير متاح'}
        </button>
      </div>

      {/* قائمة الطلبات */}
      <div className="px-4 space-y-4">
        <h2 className="text-gray-400 text-sm font-bold mr-2">الطلبات النشطة ({orders.length})</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-2">📭</p>
            <p>ما في طلبات مسندة لك حالياً</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'delivering' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {order.status === 'delivering' ? 'جاري التوصيل' : 'طلب جديد'}
                </span>
                <span className="font-mono text-gray-500 text-xs">#{order.id.slice(-6)}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="font-bold text-lg">{order.customerName}</p>
                <p className="text-gray-400 text-sm flex items-center gap-2">📞 <span dir="ltr">{order.phone}</span></p>
                <p className="text-gray-300 text-sm">{order.address.split('|')[0]}</p>
                {order.location && (
                  <a href={`https://www.google.com/maps?q=${order.location}`} target="_blank" className="text-blue-400 text-xs flex items-center gap-1 mt-1">📍 فتح الموقع بالخريطة</a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700">
                {order.status === 'pending' && (
                  <button onClick={() => updateStatus(order.id, 'delivering')} className="col-span-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold">بدء التوصيل</button>
                )}
                {order.status === 'delivering' && (
                  <button onClick={() => updateStatus(order.id, 'delivered')} className="col-span-2 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold">✅ تم التسليم</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
