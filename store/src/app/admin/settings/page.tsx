"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    siteName: "", heroTitle: "", heroSubtitle: "", heroBtnText: "", 
    discountBadge: "", whatsapp: "", email: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    alert("تم حفظ الإعدادات بنجاح!");
    router.push("/admin");
  };

  if (loading) return <p className="text-center mt-20 text-black">جاري التحميل...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">إعدادات المتجر العامة</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">اسم المتجر (اللوجو)</label>
          <input type="text" value={formData.siteName} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full border p-3 rounded text-black" required />
        </div>

        <div className="border p-4 rounded bg-gray-50 space-y-4">
          <h2 className="font-bold text-gray-800">البانر الإعلاني (الرئيسية)</h2>
          <input type="text" value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="العنوان الرئيسي" required />
          <input type="text" value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="العنوان الفرعي" required />
          <input type="text" value={formData.heroBtnText} onChange={(e) => setFormData({...formData, heroBtnText: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="نص الزر" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">شعار الخصم (على المنتجات)</label>
          <input type="text" value={formData.discountBadge} onChange={(e) => setFormData({...formData, discountBadge: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="مثال: خصم 20%" required />
        </div>

        <div className="border p-4 rounded bg-gray-50 space-y-4">
          <h2 className="font-bold text-gray-800">معلومات التواصل</h2>
          <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="رقم الواتساب" dir="ltr" required />
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الإيميل" dir="ltr" required />
        </div>

        <button type="submit" disabled={saving} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400">
          {saving ? "جاري الحفظ..." : "حفظ كل الإعدادات"}
        </button>
      </form>
    </div>
  );
}
