"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ id }: { id: string }) {
  const router = useRouter();
    const [formData, setFormData] = useState({ name: "", price: "", stock: "", weight: "", imageUrl: "" });
      const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetch(`/api/products/${id}`)
                  .then((res) => res.json())
                        .then((data) => {
                                setFormData({
                                          name: data.name || "",
                                                    price: (data.price / 100).toString() || "",
                                                              stock: data.stock?.toString() || "",
                                                                        weight: data.weight?.toString() || "",
                                                                                  imageUrl: data.imageUrl || "",
                                                                                          });
                                                                                                  setLoading(false);
                                                                                                        });
                                                                                                          }, [id]);

                                                                                                            const handleSubmit = async (e: React.FormEvent) => {
                                                                                                                e.preventDefault();
                                                                                                                    await fetch(`/api/products/${id}`, {
                                                                                                                          method: "PUT",
                                                                                                                                headers: { "Content-Type": "application/json" },
                                                                                                                                      body: JSON.stringify(formData),
                                                                                                                                          });
                                                                                                                                              router.push("/admin");
                                                                                                                                                };

                                                                                                                                                  if (loading) return null;

                                                                                                                                                    return (
                                                                                                                                                        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md border" dir="rtl">
                                                                                                                                                              <h1 className="text-2xl font-bold mb-6 text-gray-900">تعديل المنتج</h1>
                                                                                                                                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                                                                                                                                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="اسم المنتج" required />
                                                                                                                                                                                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="السعر بالدولار" required />
                                                                                                                                                                                            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="المخزون" required />
                                                                                                                                                                                                    <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="الوزن بالغرام" required />
                                                                                                                                                                                                            <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-3 rounded text-black" placeholder="رابط الصورة" />
                                                                                                                                                                                                                    <button type="submit" className="w-full bg-black text-white p-3 rounded font-bold hover:bg-gray-800">حفظ التعديلات</button>
                                                                                                                                                                                                                          </form>
                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                }