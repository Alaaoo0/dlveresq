import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updateStatus } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: '📝 جديد',
  confirmed: '✅ مؤكد',
  preparing: '👨‍🍳 قيد التحضير',
  on_the_way: '🛵 في الطريق',
  delivered: '🎉 تم التوصيل',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-purple-100 text-purple-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  on_the_way: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } }
  });

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="mb-6">
        <Link href="/admin" className="text-gray-600 hover:text-black font-bold">← رجوع للوحة التحكم</Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">إدارة الطلبات ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 border">
          ما في طلبات حاليًا.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-mono font-bold text-sm" dir="ltr">
                      #{order.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                  <p className="text-gray-600 text-sm" dir="ltr">📞 {order.phone}</p>
                  <p className="text-gray-600 text-sm">📍 {order.address}</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleString('ar-LB')}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-red-600">${(order.total / 100).toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.pending}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.product?.name || 'منتج محذوف'} × {item.quantity}</span>
                    <span className="text-gray-600">${(item.price / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={updateStatus.bind(null, order.id, 'confirmed')}>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-purple-700">تأكيد</button>
                </form>
                <form action={updateStatus.bind(null, order.id, 'preparing')}>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-yellow-600">قيد التحضير</button>
                </form>
                <form action={updateStatus.bind(null, order.id, 'on_the_way')}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-700">في الطريق</button>
                </form>
                <form action={updateStatus.bind(null, order.id, 'delivered')}>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700">تم التوصيل</button>
                </form>
                <a href={`/track?id=${order.id}`} target="_blank" className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold hover:bg-gray-900">
                  🔗 رابط التتبع
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
