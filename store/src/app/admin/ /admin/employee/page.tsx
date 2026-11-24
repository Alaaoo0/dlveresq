"use client";
import { useState } from "react";

export default function AdminEmployeesPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ تم إضافة الموظف بنجاح!");
        setName(""); setPhone(""); setPassword("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">إضافة موظف جديد</h1>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm text-center font-bold ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddEmployee} className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الموظف" required className="w-full border p-3 rounded-lg" />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" required className="w-full border p-3 rounded-lg" dir="ltr" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة السر" required className="w-full border p-3 rounded-lg" />
        
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
          {loading ? "جاري الإضافة..." : "حفظ الموظف"}
        </button>
      </form>
    </div>
  );
}
