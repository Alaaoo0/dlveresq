"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", weight: "500", imageUrl: "", category: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // 👇 حالات جديدة لجلب الأقسام من الداتابيز
  const [categories, setCategories] = useState<any[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    // بنجيب الأقسام اللي إنت ضفتها من لوحة التحكم
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
        setFetchingCategories(false);
      })
      .catch(() => setFetchingCategories(false));
  }, []);

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
    if (!formData.category) return alert("الرجاء اختيار قسم");
    
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
      <div className="mb-6">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold flex items-center gap-2 text-sm">
          <span>←</span> رجوع للوحة التحكم
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">إضافة منتج جديد</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="اسم المنتج" required />
        
        {/* 👇 قائمة الأقسام الديناميكية مع ألوان صح */}
        <select 
          value={formData.category} 
          onChange={(e) => setFormData({...formData, category: e.target.value})} 
          className="w-full border p-3 rounded text-black bg-white appearance-none cursor-pointer"
          required
          disabled={fetchingCategories || categories.length === 0}
        >
          {fetchingCategories ? (
            <option value="">جاري تحميل الأقسام...</option>
          ) : categories.length === 0 ? (
            <option value="">ما في أقسام، ضيف قسم أولاً</option>
          ) : (
            categories.map((cat: any) => (
              <option key={cat.id} value={cat.name} className="text-black bg-white">
                {cat.name}
              </option>
            ))
          )}
        </select>

        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="معلومات ووصف المنتج (اختياري)" rows={3}></textarea>

        <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="السعر بالدولار" required />
        <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="المخزون" required />
        <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الوزن بالغرام" required />
                
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">صورة المنتج</label>
          <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-2 rounded text-black mb-2" placeholder="أو الصق رابط الصورة هنا..." />
          <p className="text-center text-gray-500 text-sm mb-2">- أو -</p>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {uploading && <p className="text-blue-600 text-sm mt-2">جاري رفع الملف...</p>}
        </div>

        <button type="submit" disabled={loading || uploading || categories.length === 0} className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400 mt-4">
          {loading ? "جاري الحفظ..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}
