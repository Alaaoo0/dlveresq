"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["أجهزة الكترونية", "موضة نسائية", "موضة رجالية", "هواتف وإكسسوارات", "أدوات منزلية", "عطور", "ساعات", "رياضة", "ألعاب"];

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", weight: "500", imageUrl: "", category: categories[0] });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, imageUrl: data.url });
        alert("تم رفع الملف بنجاح!");
      } else { alert("فشل رفع الملف"); }
    } catch (error) { alert("صار خطأ أثناء الرفع"); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push("/admin");
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="اسم المنتج" required />
        
        {/* قائمة الأقسام */}
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border p-3 rounded text-black">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="السعر بالدولار" required />
        <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="المخزون" required />
        <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الوزن بالغرام" required />
        
        <div className="border p-4 rounded bg-gray-50">
          <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-2 rounded text-black mb-2" placeholder="رابط الصورة" />
          <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {uploading && <p className="text-blue-600 text-sm mt-2">جاري رفع الملف...</p>}
        </div>

        <button type="submit" disabled={loading || uploading} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400">
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}
