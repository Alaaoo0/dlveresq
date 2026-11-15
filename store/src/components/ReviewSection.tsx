"use client";
import { useState, useEffect } from "react";

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = () => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => res.json())
      .then(data => { setReviews(data); setLoading(false); });
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    setSubmitting(false);
    
    if (res.ok) {
      setComment("");
      setRating(5);
      fetchReviews();
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">التقييمات والمراجعات</h2>

      {/* إضافة تقييم */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">أضف تقييمك</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-gray-700">التقييم:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
              ★
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب مراجعتك هنا (اختياري)..." className="w-full border p-3 rounded text-black mb-3" rows={2}></textarea>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" disabled={submitting} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400">
          {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
        </button>
      </form>

      {/* عرض التقييمات */}
      {loading ? (
        <p className="text-gray-500">جاري تحميل التقييمات...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-800">{rev.user?.name || "زائر"}</span>
                <span className="text-yellow-500">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                <span className="text-gray-400 text-xs mr-auto">{new Date(rev.createdAt).toLocaleDateString('ar-LB')}</span>
              </div>
              {rev.comment && <p className="text-gray-600 text-sm">{rev.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
