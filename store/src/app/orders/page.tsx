"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/orders")
      .then(res => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) setOrders(data);
        setLoading(false);
      });
  }, []);

  const handleConfirmReceipt = async (orderId: string) => {
    if (!confirm("هل أنت متأكد أنك استلمت هذا الطلب؟")) return;
    
    try {
      const res = await fetch(`/api/user/orders/${orderId}`, { method: "PUT" });
      if (res.ok) {
        // تحديث الواجهة فوراً
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
      } else {
        alert("حدث خطأ، حاول مرة أخرى.");
      }
    } catch (error) {
      alert("خطأ في الاتصال بالسيرفر.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">قيد المعالجة</span>;
      case 'shipped': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">تم الشحن</span>;
      case 'delivered': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">تم التوصيل</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">قيد المعالجة</span>;
    }
  };

  if (loading) return <p className="text-center mt-20 text-black font-bold">جاري تحميل طلباتك...</p>;

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6 mt-8 min-h-screen" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-red-500 font-semibold">← العودة للرئيسية</Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center border">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ما عندك طلبات بعد!</h2>
          <p className="text-gray-500 mb-6">تصفح منتجاتنا واطلب أول شي إلك.</p>
          <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700">تسوق الآن</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">رقم الطلب: <span className="font-mono text-gray-800 font-bold">#{order.id.slice(-6).toUpperCase()}</span></p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('ar-LB')}</p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <p className="text-lg font-black text-red-600">${(order.total / 100).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="p-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded"></div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.product?.name || 'منتج محذوف'}</p>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-700">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}

                {/* هون زر تم الاستلام للزبون */}
                {order.status !== 'delivered' && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <button 
                      onClick={() => handleConfirmReceipt(order.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>✅</span> تم استلام الطلب
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
