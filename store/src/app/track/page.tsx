import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const steps = [
  { key: 'pending', label: 'تم استلام الطلب', icon: '📝', desc: 'طلبك وصلنا بنجاح' },
  { key: 'confirmed', label: 'تم تأكيد الطلب', icon: '✅', desc: 'البائع أكد طلبك' },
  { key: 'preparing', label: 'قيد التحضير', icon: '👨‍🍳', desc: 'يتم تحضير طلبك' },
  { key: 'on_the_way', label: 'في الطريق إليك', icon: '🛵', desc: 'السائق في الطريق' },
  { key: 'delivered', label: 'تم التوصيل', icon: '🎉', desc: 'طلبك وصل، بالهنا والشفا' },
];

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-5xl mb-4">🛵</div>
          <h1 className="text-2xl font-bold mb-2">تتبع طلبك</h1>
          <p className="text-gray-600 mb-6">أدخل رقم الطلب لمتابعة حالة التوصيل</p>
          <form className="flex gap-2">
            <input name="id" placeholder="رقم الطلب" className="flex-1 border-2 border-gray-200 p-3 rounded-xl text-black focus:border-red-500 outline-none" />
            <button className="bg-red-600 text-white px-6 rounded-xl font-bold hover:bg-red-700">تتبع</button>
          </form>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (!order) notFound();

  const currentIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* معلومات الطلب */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">طلب <span dir="ltr" className="font-mono text-red-600">#{order.id.slice(0, 8)}</span></h1>
            <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-LB')}</span>
          </div>
          <div className="text-gray-700 space-y-1 text-sm">
            <p><strong>الزبون:</strong> {order.customerName}</p>
            <p><strong>العنوان:</strong> {order.address}</p>
            <p><strong>الإجمالي:</strong> <span className="text-red-600 font-bold">${(order.total / 100).toFixed(2)}</span></p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">مراحل التوصيل</h2>
          {steps.map((step, index) => {
            const isDone = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition ${
                    isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse' : ''}`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-1 h-10 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className={`font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</h3>
                  <p className={`text-sm ${isDone ? 'text-gray-600' : 'text-gray-400'}`}>{step.desc}</p>
                  {isCurrent && <p className="text-xs text-green-600 font-bold mt-1">● المرحلة الحالية</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
