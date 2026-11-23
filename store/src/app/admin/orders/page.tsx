"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // لتتبع الزر اللي عم ينضغط

  // جلب البيانات عند فتح الصفحة
  const fetchData = async () => {
    try {
      const [ordersRes, employeesRes] = await Promise.all([
        fetch("/api/orders").then(r => r.json()),
        fetch("/api/employees").then(r => r.json())
      ]);
      setOrders(ordersRes);
      setEmployees(employeesRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // دالة لتحديث حالة الطلب (بدء التوصيل / تم التسليم)
  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير الحالة إلى: ${newStatus === 'delivering' ? 'جاري التوصيل' : 'تم التسليم'}؟`)) return;
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("فشل في تحديث الحالة");
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال");
    }
  };

  // دالة إسناد الموظف (هنا الإصلاح الرئيسي)
  const handleAssignEmployee = async (orderId: string, employeeId: string) => {
    if (!employeeId) return;
    setUpdating(orderId); // تفعيل حالة التحميل للزر
    
    try {
      // إرسال طلب لتحديث assignedEmployeeId
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedEmployeeId: employeeId }),
      });

      if (res.ok) {
        // تحديث الواجهة فوراً بدون ريفرش
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, assignedEmployeeId: employeeId } : o
        ));
        alert("✅ تم إسناد الطلب بنجاح!");
      } else {
        const err = await res.json();
        alert(`❌ فشل الإسناد: ${err.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      alert("❌ حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">جاري تحميل الطلبات...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">إدارة الطلبات</h1>
        <Link href="/admin" className="bg-white border px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">
          ← رجوع للوحة التحكم
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* رأس البطاقة */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <div>
                <span className="font-mono text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">#{order.id.slice(-8)}</span>
                <span className="mr-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('ar-LB')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'delivering' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {order.status === 'delivered' ? '🎉 تم التسليم' :
                   order.status === 'delivering' ? '🚚 جاري التوصيل' : '⏳ قيد الانتظار'}
                </span>
                <span className="text-xl font-black text-red-600">${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* معلومات الزبون */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{order.customerName}</h3>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>📞</span> <span className="font-bold" dir="ltr">{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1">📍</span> 
                    <div>
                      <p className="font-bold">{order.address.split('|')[0]}</p>
                      {order.location && (
                        <a href={`https://www.google.com/maps?q=${order.location}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                          🔗 فتح الموقع على الخريطة
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">المنتجات:</p>
                  <ul className="space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded border">
                        <span>{item.product?.name || 'منتج'} × {item.quantity}</span>
                        <span className="font-bold">${(item.price / 100).toFixed(2)}</span>
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

              {/* قسم الإجراءات والإسناد */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-5 h-fit">
                
                {/* ✅ هنا زر الإسناد المصلح */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🛵 إسناد لموظف توصيل</label>
                  <select 
                    value={order.assignedEmployeeId || ""} 
                    onChange={(e) => handleAssignEmployee(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                  >
                    <option value="">اختر موظفاً للإسناد...</option>
                    {employees.filter((e: any) => e.isAvailable).map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  
                  {order.assignedEmployeeId && (
                    <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1">
                      ✅ الموظف الحالي: {employees.find((e: any) => e.id === order.assignedEmployeeId)?.name || 'غير معروف'}
                    </p>
                  )}
                  {updating === order.id && (
                    <p className="text-xs text-blue-600 mt-2 font-bold animate-pulse">⏳ جاري الحفظ...</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => updateStatus(order.id, 'delivering')}
                    disabled={order.status === 'delivering' || order.status === 'delivered'}
                    className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    بدء التوصيل
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'delivered')}
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
