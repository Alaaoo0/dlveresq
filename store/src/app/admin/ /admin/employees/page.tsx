"use client";
import { useState } from "react";

export default function AdminEmployeesPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("سائق توصيل");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      // ⚠️ انتبه: الرابط هنا /api/employee (بدون s) عشان يطابق مجلدك
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, position }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ تم إضافة الموظف بنجاح!");
        setName(""); setPhone(""); setPassword("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-100" dir="rtl">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
        <span>👤</span> إضافة موظف جديد
      </h1>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm text-center font-bold border ${
          message.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddEmployee} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="مثال: أحمد محمد" 
            required 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="مثال: 70123456" 
            required 
            dir="ltr"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">كلمة السر</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••" 
            required 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">المنصب</label>
          <select 
            value={position} 
            onChange={(e) => setPosition(e.target.value)} 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="سائق توصيل">سائق توصيل</option>
            <option value="مشرف">مشرف</option>
            <option value="محاسب">محاسب</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all mt-2"
        >
          {loading ? "جاري الحفظ..." : "حفظ الموظف"}
        </button>
      </form>
    </div>
  );
}
