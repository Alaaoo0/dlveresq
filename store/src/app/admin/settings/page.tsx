"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    siteName: "",
    heroTitle: "",
    heroSubtitle: "",
    heroBtnText: "",
    discountBadge: "",
    whatsapp: "",
    whishNumber: "",
    email: "",
    deliveryLocation: "بيروت، لبنان",
    deliveryFee: 200,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          siteName: data.siteName || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroBtnText: data.heroBtnText || "",
          discountBadge: data.discountBadge || "",
          whatsapp: data.whatsapp || "",
          whishNumber: data.whishNumber || "",
          email: data.email || "",
          deliveryLocation: data.deliveryLocation || "بيروت، لبنان",
          // ✅ إصلاح: السماح بقيمة 0
          deliveryFee: data.deliveryFee !== undefined && data.deliveryFee !== null 
            ? parseInt(data.deliveryFee) 
            : 200,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const handleResetStats = async () => {
    if (!confirm("هل أنت متأكد من مسح جميع الطلبات والإحصائيات؟ لا يمكن التراجع!")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/admin/stats/reset", { method: "POST" });
      if (res.ok) {
        alert("تم مسح جميع الطلبات وتصفير الإحصائيات بنجاح!");
        router.push("/admin");
      } else {
        alert("حدث خطأ أثناء المسح.");
      }
    } catch (e) {
      alert("خطأ في الاتصال.");
    }
    setResetting(false);
  };

  if (loading) return <p className="text-center mt-20 text-black">جاري التحميل...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <div className="mb-4">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2">
          <span>←</span> رجوع للوحة التحكم
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">إعدادات المتجر العامة</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">اسم المتجر (اللوجو)</label>
          <input type="text" value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} className="w-full border p-3 rounded text-black" required />
        </div>

        <div className="border p-4 rounded bg-gray-50 space-y-4">
          <h2 className="font-bold text-gray-800">البانر الإعلاني (الرئيسية)</h2>
          <input type="text" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} className="w-full border p-3 rounded text-black" placeholder="العنوان الرئيسي" required />
          <input type="text" value={formData.heroSubtitle} onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })} className="w-full border p-3 rounded text-black" placeholder="العنوان الفرعي" required />
          <input type="text" value={formData.heroBtnText} onChange={(e) => setFormData({ ...formData, heroBtnText: e.target.value })} className="w-full border p-3 rounded text-black" placeholder="نص الزر" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">شعار الخصم (على المنتجات)</label>
          <input type="text" value={formData.discountBadge} onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })} className="w-full border p-3 rounded text-black" placeholder="مثال: خصم 20%" required />
        </div>

        <div className="border p-4 rounded bg-gray-50 space-y-4">
          <h2 className="font-bold text-gray-800">معلومات التواصل والدفع</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم الواتساب</label>
            <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full border p-3 rounded text-black" dir="ltr" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم الويش</label>
            <input type="text" value={formData.whishNumber} onChange={(e) => setFormData({ ...formData, whishNumber: e.target.value })} className="w-full border p-3 rounded text-black" dir="ltr" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border p-3 rounded text-black" dir="ltr" required />
          </div>
        </div>

        <div className="border p-4 rounded bg-blue-50 space-y-4">
          <h2 className="font-bold text-gray-800">📍 موقع التوصيل ومبلغه</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الذي يظهر في شريط التوصيل</label>
            <input
              type="text"
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              className="w-full border p-3 rounded text-black"
              placeholder="مثال: بيروت، لبنان"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">💰 مبلغ التوصيل (بالسنتات - مثال: 200 = $2.00، 0 = مجاني)</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              className="w-full border p-3 rounded text-black text-lg font-bold"
              min="0"
              step="50"
              dir="ltr"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              المبلغ الحالي: <span className="font-bold text-red-600">${(formData.deliveryFee / 100).toFixed(2)}</span>
              — اكتب 0 لجعل التوصيل مجاني.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="flex-1 bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400">
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
          <button type="button" onClick={handleResetStats} disabled={resetting} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 disabled:bg-gray-100">
            {resetting ? "جاري المسح..." : "مسح الطلبات"}
          </button>
        </div>
      </form>
    </div>
  );
}
