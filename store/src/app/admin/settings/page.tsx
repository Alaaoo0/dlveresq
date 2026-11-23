"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">جاري تحميل الخريطة...</div>,
});

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
    deliveryFee: 0,
    storeLatitude: 33.8938,
    storeLongitude: 35.5018,
    pricePerKm: 0.5,
    minDeliveryFee: 100,
    maxDeliveryFee: 1000,
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
          deliveryFee: data.deliveryFee !== undefined && data.deliveryFee !== null
            ? parseInt(data.deliveryFee, 10) || 0
            : 0,
          storeLatitude: parseFloat(data.storeLatitude) || 33.8938,
          storeLongitude: parseFloat(data.storeLongitude) || 35.5018,
          pricePerKm: parseFloat(data.pricePerKm) || 0.5,
          minDeliveryFee: parseInt(data.minDeliveryFee, 10) || 100,
          maxDeliveryFee: parseInt(data.maxDeliveryFee, 10) || 1000,
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
      body: JSON.stringify({
        ...formData,
        deliveryFee: Math.round(parseFloat(formData.deliveryFee as any) || 0),
      }),
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
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <div className="mb-4">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2">
          <span>←</span> رجوع للوحة التحكم
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">إعدادات المتجر العامة</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <h2 className="font-bold text-gray-800">📍 موقع التوصيل ومبلغه (الطريقة القديمة - ثابت)</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الذي يظهر في شريط التوصيل</label>
            <input type="text" value={formData.deliveryLocation} onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })} className="w-full border p-3 rounded text-black" placeholder="مثال: بيروت، لبنان" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">💰 مبلغ التوصيل الثابت (بالسنتات — 0 = مجاني)</label>
            <input type="number" value={formData.deliveryFee} onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value === '' ? 0 : Math.max(0, Math.round(parseFloat(e.target.value) || 0)) })} className="w-full border p-3 rounded text-black text-lg font-bold" min="0" step="any" dir="ltr" />
            <p className="text-xs text-gray-500 mt-2">
              المبلغ الحالي: <span className="font-bold text-red-600">${((Number(formData.deliveryFee) || 0) / 100).toFixed(2)}</span>
              {' '}— يُستخدم فقط إذا لم يُفعّل التوصيل الذكي بالأسفل.
            </p>
          </div>
        </div>

        {/* 🗺️ التوصيل الذكي */}
        <div className="border-2 border-purple-200 p-5 rounded-xl bg-purple-50 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span>🗺️</span> التوصيل الذكي (مثل يلا جو)
          </h2>
          <p className="text-sm text-gray-600">
            الزبون يحدد موقعه على الخريطة، ويُحسب سعر التوصيل تلقائياً بناءً على المسافة من المتجر.
          </p>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📌 موقع المتجر (نقطة الانطلاق) — اضغط على الخريطة لتحديد الموقع
            </label>
            <MapPicker
              centerLat={formData.storeLatitude}
              centerLng={formData.storeLongitude}
              onLocationSelect={(lat, lng) => setFormData({ ...formData, storeLatitude: lat, storeLongitude: lng })}
              height="h-72"
              showStoreMarker={true}
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-bold text-gray-600">خط العرض (Latitude)</label>
                <input type="number" step="any" value={formData.storeLatitude} onChange={(e) => setFormData({ ...formData, storeLatitude: parseFloat(e.target.value) || 0 })} className="w-full border p-2 rounded text-black text-sm" dir="ltr" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">خط الطول (Longitude)</label>
                <input type="number" step="any" value={formData.storeLongitude} onChange={(e) => setFormData({ ...formData, storeLongitude: parseFloat(e.target.value) || 0 })} className="w-full border p-2 rounded text-black text-sm" dir="ltr" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-200">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">💵 السعر لكل كم ($)</label>
              <input type="number" step="0.01" value={formData.pricePerKm} onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) || 0 })} className="w-full border p-3 rounded text-black font-bold" dir="ltr" />
              <p className="text-xs text-gray-500 mt-1">مثال: 0.50 = 50 سنت لكل كم</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">⬇️ الحد الأدنى (سنتات)</label>
              <input type="number" value={formData.minDeliveryFee} onChange={(e) => setFormData({ ...formData, minDeliveryFee: parseInt(e.target.value) || 0 })} className="w-full border p-3 rounded text-black font-bold" dir="ltr" />
              <p className="text-xs text-gray-500 mt-1">مثال: 100 = $1.00</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">⬆️ الحد الأقصى (سنتات)</label>
              <input type="number" value={formData.maxDeliveryFee} onChange={(e) => setFormData({ ...formData, maxDeliveryFee: parseInt(e.target.value) || 0 })} className="w-full border p-3 rounded text-black font-bold" dir="ltr" />
              <p className="text-xs text-gray-500 mt-1">مثال: 1000 = $10.00</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-purple-200 text-sm">
            <p className="font-bold text-gray-700 mb-1">📊 مثال توضيحي:</p>
            <p className="text-gray-600">
              إذا كان السعر <b>${formData.pricePerKm}/كم</b>، والحد الأدنى <b>${(formData.minDeliveryFee / 100).toFixed(2)}</b>، والحد الأقصى <b>${(formData.maxDeliveryFee / 100).toFixed(2)}</b>:
            </p>
            <ul className="text-gray-600 text-xs mt-1 space-y-1 list-disc pr-5">
              <li>مسافة 1 كم → ${(Math.max(formData.minDeliveryFee, Math.min(formData.maxDeliveryFee, Math.round(1 * formData.pricePerKm * 100))) / 100).toFixed(2)}</li>
              <li>مسافة 5 كم → ${(Math.max(formData.minDeliveryFee, Math.min(formData.maxDeliveryFee, Math.round(5 * formData.pricePerKm * 100))) / 100).toFixed(2)}</li>
              <li>مسافة 20 كم → ${(Math.max(formData.minDeliveryFee, Math.min(formData.maxDeliveryFee, Math.round(20 * formData.pricePerKm * 100))) / 100).toFixed(2)}</li>
            </ul>
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
