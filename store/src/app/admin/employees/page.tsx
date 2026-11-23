"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", position: "", address: "", password: "" });
  const fetchEmployees = () => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({ name: "", phone: "", position: "", address: "" });
    fetchEmployees();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد من حذف هذا الموظف؟")) return;
    await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await fetch("/api/employees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isAvailable: !currentStatus }),
    });
    fetchEmployees();
  };

  if (loading) return <p className="text-center mt-20">جاري التحميل...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="mb-6">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold">← رجوع للوحة التحكم</Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين ({employees.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
          {showForm ? "إلغاء" : "+ إضافة موظف"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">إضافة موظف جديد</h2>
          <input type="text" placeholder="الاسم الكامل" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-3 rounded text-black" required />
          <input type="tel" placeholder="رقم الهاتف" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border p-3 rounded text-black" dir="ltr" required />
          <input type="text" placeholder="المنصب (سائق، مندوب...)" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full border p-3 rounded text-black" required />
          <input type="text" placeholder="العنوان" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border p-3 rounded text-black" />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">حفظ الموظف</button>
        </form>
      )}

      <div className="space-y-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                <p className="text-gray-600 text-sm">📞 <span dir="ltr">{emp.phone}</span></p>
                <p className="text-gray-600 text-sm">💼 {emp.position}</p>
                {emp.address && <p className="text-gray-500 text-sm">📍 {emp.address}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(emp.id, emp.isAvailable)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${emp.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  {emp.isAvailable ? '✅ متاح' : '❌ غير متاح'}
                </button>
                <button onClick={() => handleDelete(emp.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700">
                  🗑️ حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
