"use client";

import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const steps = [
  { key: "pending", label: "تم استلام الطلب", icon: "📝", desc: "طلبك وصلنا بنجاح وجاري المراجعة" },
  { key: "confirmed", label: "تم تأكيد الطلب", icon: "✅", desc: "تم تأكيد طلبك من قبل الإدارة" },
  { key: "preparing", label: "قيد التحضير", icon: "👨‍🍳", desc: "يتم تحضير طلبك الآن" },
  { key: "on_the_way", label: "في الطريق إليك", icon: "🛵", desc: "السائق في الطريق لتوصيل طلبك" },
  { key: "delivered", label: "تم التوصيل", icon: "🎉", desc: "تم توصيل طلبك بنجاح، بالهنا والشفا!" },
];

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError("يرجى إدخال رقم الطلب");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track-order?id=${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.message || "لم يتم العثور على الطلب");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = order ? steps.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛵</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">تتبع طلبك</h1>
          <p className="text-gray-600">أدخل رقم الطلب لمتابعة حالة التوصيل</p>
        </div>

        {/* نموذج إدخال رقم الطلب */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <form onSubmit={handleTrack} className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="أدخل رقم الطلب هنا"
              className="flex-1 border-2 border-gray-200 p-4 rounded-xl text-black text-lg focus:border-red-500 outline-none transition"
              dir="ltr"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading ? "جاري البحث..." : "تتبع"}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-bold">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* عرض حالة الطلب */}
        {order && (
          <>
            {/* معلومات الطلب */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل الطلب <span className="font-mono text-red-600" dir="ltr">#{order.id.slice(0, 12)}</span>
                </h2>
                <span className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString("ar-LB")}
                </span>
              </div>
              <div className="text-gray-700 space-y-2 text-sm">
                <p>
                  <strong>الزبون:</strong> {order.customerName}
                </p>
                <p>
                  <strong>العنوان:</strong> {order.address}
                </p>
                <p>
                  <strong>الهاتف:</strong> <span dir="ltr">{order.phone}</span>
                </p>
                <p>
                  <strong>الإجمالي:</strong>{" "}
                  <span className="text-red-600 font-bold text-lg">${(order.total / 100).toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">مراحل التوصيل</h2>
              {steps.map((step, index) => {
                const isDone = index <= currentIndex;
                const isCurrent = index === currentIndex;
                return (
                  <div key={step.key} className="flex gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition ${
                          isDone ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-green-200 animate-pulse" : ""}`}
                      >
                        {step.icon}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-1 h-12 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className={`font-bold text-lg ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm ${isDone ? "text-gray-600" : "text-gray-400"}`}>{step.desc}</p>
                      {isCurrent && (
                        <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                          ● المرحلة الحالية
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
