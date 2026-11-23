"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then(res => res.json()),
      fetch("/api/employees").then(res => res.json()),
      fetch("/api/admin/stats").then(res => res.json())
    ]).then(([ordersData, employeesData, statsData]) => {
      setOrders(ordersData);
      setEmployees(employeesData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const assignEmployee = async (orderId: string, employeeId: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedEmployeeId: employeeId }),
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, assignedEmployeeId: employeeId } : o));
  };

  if (loading) return <p className="text-center mt-20 text-gray-600 font-bold">جاري تحميل الطلبات...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <span>←</span> رجوع للوحة التحكم
        </Link>
        <h1 className="text-3xl font-black text-gray-900">إدارة الطلبات ({orders.length})</h1>
      </div>

      {/* 📊 إحصائيات الموظفين */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> إحصائيات الموظفين اليوم
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="p-3 border-b">الموظف</th>
                  <th className="p-3 border-b">المسندة اليوم</th>
                  <th className="p-3 border-b">تم تسليمها</th>
                  <th className="p-3 border-b">المتبقية</th>
                  <th className="p-3 border-b">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp: any) => {
                  const empStats = stats.employeeStats?.[emp.id] || {};
                  return (
                    <tr key={emp.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{emp.name}</td>
                      <td className="p-3 text-blue-600 font-bold">{empStats.assignedToday || 0}</td>
                      <td className="p-3 text-green-600 font-bold">{empStats.delivered || 0}</td>
                      <td className="p-3 text-orange-600 font-bold">{empStats.remaining || 0}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {emp.isAvailable ? '🟢 متاح' : '🔴 مشغول'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📦 قائمة الطلبات */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* رأس البطاقة */}
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">#{order.id.slice(-12)}</span>
                  <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('ar-LB')}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900">{order.customerName}</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {order.status === 'delivered' ? '🎉 تم التوصيل' :
                   order.status === 'pending' ? '⏳ قيد الانتظار' : '🚚 جاري التوصيل'}
                </span>
                <span className="text-2xl font-black text-red-600">${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* تفاصيل الطلب */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl mt-1">📞</span>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-bold text-gray-900" dir="ltr">{order.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-gray-700">
                  <span className="text-xl mt-1">📍</span>
                  <div>
                    <p className="text-sm text-gray-500">العنوان والموقع</p>
                    <p className="font-bold text-gray-900 leading-relaxed">
                      {order.address.split('|')[0]}
                      {order.location && (
                        <a 
                          href={`https://www.google.com/maps?q=${order.location}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block mt-1 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          🔗 فتح الموقع على الخريطة
                        </a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">المنتجات:</p>
                  <ul className="space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded border border-gray-100">
                        <span className="font-medium text-gray-800">{item.product?.name || 'منتج محذوف'} × {item.quantity}</span>
                        <span className="font-bold text-gray-900">${(item.price / 100).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm mt-2 text-orange-600 font-bold bg-orange-50 p-2 rounded border border-orange-100">
                      <span>🚚 مبلغ التوصيل (نقداً)</span>
                      <span>${(order.deliveryFee / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* إجراءات الطلب */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🛵 إسناد لموظف توصيل</label>
                  <select 
                    value={order.assignedEmployeeId || ''} 
                    onChange={(e) => assignEmployee(order.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">اختر موظفاً...</option>
                    {employees.filter((e: any) => e.isAvailable).map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  {order.assignedEmployeeId && (
                    <p className="text-xs text-green-600 mt-2 font-bold">
                      ✅ الموظف الحالي: {employees.find((e: any) => e.id === order.assignedEmployeeId)?.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'delivering')}
                    disabled={order.status === 'delivering' || order.status === 'delivered'}
                    className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    بدء التوصيل
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    disabled={order.status === 'delivered'}
                    className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    تم التسليم
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
