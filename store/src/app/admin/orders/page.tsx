"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/all-orders", { cache: 'no-store' });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  if (loading) return <p className="text-center mt-20 text-black font-bold">جاري تحميل الطلبات...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
        <Link href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">رجوع</Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 border-b">رقم الطلب</th>
              <th className="p-4 border-b">الزبون</th>
              <th className="p-4 border-b">المجموع</th>
              <th className="p-4 border-b">التاريخ</th>
              <th className="p-4 border-b">حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 border-b font-mono text-sm font-bold text-gray-800">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-500" dir="ltr">{order.phone}</p>
                </td>
                <td className="p-4 border-b text-red-600 font-bold">${(order.total / 100).toFixed(2)}</td>
                <td className="p-4 border-b text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-LB')}</td>
                <td className="p-4 border-b">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`p-2 rounded-lg font-bold text-sm border-none outline-none cursor-pointer ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    <option value="pending">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center p-6 text-gray-500">ما في طلبات حالياً.</p>}
      </div>
    </div>
  );
}
