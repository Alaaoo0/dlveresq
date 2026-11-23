
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updateStatus, assignEmployee } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "📝 جديد",
  confirmed: "✅ مؤكد",
  preparing: "👨‍🍳 قيد التحضير",
  on_the_way: "🛵 في الطريق",
  delivered: "🎉 تم التوصيل",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-purple-100 text-purple-700",
  preparing: "bg-yellow-100 text-yellow-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
};

function lebanonDayStart() {
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Beirut",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Beirut",
    timeZoneName: "longOffset",
  })
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value;

  const match = offset?.match(/GMT([+-]\d{2}:\d{2})/);
  const zone = match ? match[1] : "+02:00";

  return new Date(`${date}T00:00:00${zone}`);
}

export default async function AdminOrdersPage() {
  const [orders, employees] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        employee: true,
      },
    }),
    prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        isAvailable: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const todayStart = lebanonDayStart();

  const dailyStats = employees.map((employee) => {
    const assignedToday = orders.filter(
      (order) =>
        order.employeeId === employee.id &&
        order.assignedAt &&
        order.assignedAt >= todayStart
    );

    return {
      ...employee,
      total: assignedToday.length,
      delivered: assignedToday.filter(
        (order) => order.status === "delivered"
      ).length,
      remaining: assignedToday.filter(
        (order) => order.status !== "delivered"
      ).length,
    };
  });

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-gray-600 hover:text-black font-bold"
        >
          ← رجوع للوحة التحكم
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        إدارة الطلبات ({orders.length})
      </h1>

      <section className="bg-white border rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold mb-4">
          📊 إحصائيات الموظفين اليوم
        </h2>

        {employees.length === 0 ? (
          <p className="text-gray-500">لا يوجد موظفون حالياً.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">الموظف</th>
                  <th className="p-3">المسندة اليوم</th>
                  <th className="p-3">تم تسليمها</th>
                  <th className="p-3">المتبقية</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="p-3 font-bold">
                      {employee.name}
                    </td>
                    <td className="p-3 text-blue-700 font-bold">
                      {employee.total}
                    </td>
                    <td className="p-3 text-green-700 font-bold">
                      {employee.delivered}
                    </td>
                    <td className="p-3 text-orange-600 font-bold">
                      {employee.remaining}
                    </td>
                    <td className="p-3">
                      {employee.isAvailable ? "🟢 متاح" : "🔴 غير متاح"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500 border">
          ما في طلبات حاليًا.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border p-5"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-mono font-bold text-sm" dir="ltr">
                      #{order.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {order.customerName}
                  </h3>
                  <p className="text-gray-600 text-sm" dir="ltr">
                    📞 {order.phone}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📍 {order.address}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleString("ar-LB")}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-2xl font-black text-red-600">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    statusColors[order.status] || statusColors.pending
                  }`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>
                      {item.product?.name || "منتج محذوف"} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      ${(item.price / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-3 mb-4">
                <p className="font-bold text-gray-800 mb-2">
                  🛵 موظف التوصيل
                </p>

                {order.employee ? (
                  <p className="text-sm text-green-700 mb-2">
                    الموظف الحالي: {order.employee.name}
                    {!order.employee.isAvailable && " (غير متاح حالياً)"}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mb-2">
                    لم يتم إسناد الطلب لأي موظف بعد.
                  </p>
                )}

                <form
                  action={assignEmployee.bind(null, order.id)}
                  className="flex flex-wrap gap-2"
                >
                  <select
                    name="employeeId"
                    required
                    defaultValue={order.employeeId || ""}
                    className="border rounded-lg p-2 flex-1 min-w-[180px] bg-white"
                  >
                    <option value="" disabled>
                      اختر موظف التوصيل
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                        disabled={
                          !employee.isAvailable &&
                          employee.id !== order.employeeId
                        }
                      >
                        {employee.name} - {employee.phone}
                        {!employee.isAvailable ? " (غير متاح)" : " (متاح)"}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    إسناد الطلب
                  </button>
                </form>

                {employees.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    لا يوجد موظفون. أضف موظفاً أولاً من إدارة الموظفين.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={updateStatus.bind(null, order.id, "confirmed")}>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold">
                    تأكيد
                  </button>
                </form>

                <form action={updateStatus.bind(null, order.id, "preparing")}>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold">
                    قيد التحضير
                  </button>
                </form>

                <form action={updateStatus.bind(null, order.id, "on_the_way")}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                    في الطريق
                  </button>
                </form>

                <form action={updateStatus.bind(null, order.id, "delivered")}>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                    تم التوصيل
                  </button>
                </form>

                <a
                  href={`/track?id=${order.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold"
                >
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
