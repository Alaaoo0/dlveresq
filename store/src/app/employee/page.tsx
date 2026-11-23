
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Employee = {
  id: string;
  name: string;
  phone: string;
  position: string;
  isAvailable: boolean;
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  location?: string | null;
  deliveryFee: number;
  total: number;
  status: string;
  employeeResponse: string;
  employeeRespondedAt?: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: { name: string };
  }[];
};

const statuses = [
  { value: "confirmed", label: "تأكيد استلام الطلب" },
  { value: "preparing", label: "الطلب قيد التحضير" },
  { value: "on_the_way", label: "الطلب في الطريق" },
  { value: "delivered", label: "تم التسليم" },
];

const statusNames: Record<string, string> = {
  pending: "طلب جديد",
  confirmed: "تم تأكيد الاستلام",
  preparing: "قيد التحضير",
  on_the_way: "في الطريق",
  delivered: "تم التسليم",
};

export default function EmployeePage() {
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const meResponse = await fetch("/api/employee/me", {
        cache: "no-store",
      });

      const meData = await meResponse.json();

      if (!meResponse.ok || !meData.employee) {
        router.replace("/employee/login");
        return;
      }

      setEmployee(meData.employee);

      const ordersResponse = await fetch("/api/employee/orders", {
        cache: "no-store",
      });

      const ordersData = await ordersResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(ordersData.message || "تعذر تحميل الطلبات");
      }

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحميل البيانات"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function toggleAvailability() {
    if (!employee) return;

    setBusy("availability");
    setError("");

    try {
      const response = await fetch("/api/employee/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAvailable: !employee.isAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر تحديث الحالة");
      }

      setEmployee({
        ...employee,
        isAvailable: !employee.isAvailable,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setBusy("");
    }
  }

  async function respondToOrder(
    orderId: string,
    responseType: "accepted" | "rejected"
  ) {
    setBusy(orderId);
    setError("");

    try {
      const response = await fetch(
        `/api/employee/orders/${orderId}/response`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response: responseType }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر إرسال الرد");
      }

      setOrders((oldOrders) =>
        oldOrders.map((order) =>
          order.id === orderId
            ? { ...order, employeeResponse: responseType }
            : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setBusy("");
    }
  }

  async function updateOrder(orderId: string, status: string) {
    setBusy(orderId);
    setError("");

    try {
      const response = await fetch(
        `/api/employee/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر تحديث الطلب");
      }

      setOrders((oldOrders) =>
        oldOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    setBusy("logout");

    try {
      await fetch("/api/employee/logout", {
        method: "POST",
      });

      router.replace("/employee/login");
      router.refresh();
    } catch {
      setError("تعذر تسجيل الخروج");
      setBusy("");
    }
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        جاري تحميل بيانات الموظف...
      </main>
    );
  }

  if (!employee) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        يرجى تسجيل الدخول...
      </main>
    );
  }

  const activeOrders = orders.filter(
    (order) =>
      order.employeeResponse === "accepted" &&
      order.status !== "delivered"
  );

  const waitingOrders = orders.filter(
    (order) => order.employeeResponse === "pending"
  );

  return (
    <main dir="rtl" className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-3xl mx-auto">

        <header className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">🛵 لوحة الموظف</h1>
            <p className="text-gray-400 text-sm mt-1">
              متابعة طلبات التوصيل
            </p>
          </div>

          <button
            onClick={logout}
            disabled={busy === "logout"}
            className="bg-red-600 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            تسجيل الخروج
          </button>
        </header>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
          <h2 className="text-xl font-bold">{employee.name}</h2>
          <p className="text-gray-400 mt-1">{employee.phone}</p>
          <p className="text-gray-400 text-sm mt-1">{employee.position}</p>

          <div className="flex items-center justify-between mt-5 gap-3">
            <div>
              <p className="font-bold">حالة العمل</p>
              <p className={`text-sm mt-1 ${employee.isAvailable ? "text-green-400" : "text-red-400"}`}>
                {employee.isAvailable ? "متاح لاستلام الطلبات" : "غير متاح"}
              </p>
            </div>

            <button
              onClick={toggleAvailability}
              disabled={busy === "availability"}
              className={`px-5 py-3 rounded-xl font-bold disabled:opacity-50 ${
                employee.isAvailable
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {busy === "availability"
                ? "جاري التحديث..."
                : employee.isAvailable
                ? "غير متاح"
                : "متاح"}
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        <section className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">طلباتي</h2>
          <span className="bg-yellow-500 text-black rounded-full px-3 py-1 text-sm font-bold">
            {activeOrders.length} طلب نشط
          </span>
        </section>

        {orders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
            لا توجد طلبات مسندة إليك حالياً
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isWaiting = order.employeeResponse === "pending";
              const isRejected = order.employeeResponse === "rejected";
              const isAccepted = order.employeeResponse === "accepted";

              const nextStatus = statuses.find(
                (status) =>
                  status.value ===
                  (order.status === "pending"
                    ? "confirmed"
                    : order.status === "confirmed"
                    ? "preparing"
                    : order.status === "preparing"
                    ? "on_the_way"
                    : order.status === "on_the_way"
                    ? "delivered"
                    : "")
              );

              return (
                <article
                  key={order.id}
                  className={`bg-gray-900 border rounded-2xl p-5 ${
                    isWaiting
                      ? "border-yellow-500"
                      : "border-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <h3 className="font-bold text-lg">
                      طلب #{order.id.slice(-6)}
                    </h3>

                    <span className={`text-sm font-bold ${
                      isWaiting
                        ? "text-yellow-400"
                        : isRejected
                        ? "text-red-400"
                        : "text-green-400"
                    }`}>
                      {isWaiting
                        ? "بانتظار موافقتك"
                        : isRejected
                        ? "تم رفض الطلبية"
                        : isAccepted
                        ? statusNames[order.status] || order.status
                        : "طلب غير محدد"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>👤 الزبون: {order.customerName}</p>

                    <p>
                      📞 الهاتف:{" "}
                      <a
                        href={`tel:${order.phone}`}
                        className="text-blue-400 underline"
                      >
                        {order.phone}
                      </a>
                    </p>

                    <p>📍 العنوان: {order.address}</p>

                    {order.location && (
                      <p>
                        <a
                          href={order.location}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline"
                        >
                          فتح موقع الزبون
                        </a>
                      </p>
                    )}

                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <p className="font-bold mb-2">المنتجات:</p>

                      {order.items?.map((item) => (
                        <p key={item.id} className="text-gray-300">
                          • {item.product?.name || "منتج"} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <p className="text-gray-300">
                      أجرة التوصيل: {order.deliveryFee}
                    </p>

                    <p className="font-bold text-yellow-400">
                      إجمالي الطلب: {order.total}
                    </p>
                  </div>

                  {isWaiting && (
                    <div className="mt-5 space-y-3">
                      <p className="text-yellow-300 text-center font-bold">
                        🔔 المدير أرسل لك طلبية جديدة
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            respondToOrder(order.id, "accepted")
                          }
                          disabled={busy === order.id}
                          className="bg-green-600 text-white font-bold rounded-xl p-3 disabled:opacity-50"
                        >
                          {busy === order.id ? "جاري الإرسال..." : "✓ قبول الطلبية"}
                        </button>

                        <button
                          onClick={() =>
                            respondToOrder(order.id, "rejected")
                          }
                          disabled={busy === order.id}
                          className="bg-red-600 text-white font-bold rounded-xl p-3 disabled:opacity-50"
                        >
                          {busy === order.id ? "جاري الإرسال..." : "✕ رفض الطلبية"}
                        </button>
                      </div>
                    </div>
                  )}

                  {isAccepted && nextStatus && (
                    <button
                      onClick={() =>
                        updateOrder(order.id, nextStatus.value)
                      }
                      disabled={busy === order.id}
                      className="w-full mt-5 bg-yellow-500 text-black font-bold rounded-xl p-3 disabled:opacity-50"
                    >
                      {busy === order.id
                        ? "جاري التحديث..."
                        : nextStatus.label}
                    </button>
                  )}

                  {isAccepted && !nextStatus && (
                    <div className="mt-5 bg-green-950 text-green-400 rounded-xl p-3 text-center font-bold">
                      ✅ تم تسليم الطلب
                    </div>
                  )}

                  {isRejected && (
                    <div className="mt-5 bg-red-950 text-red-300 rounded-xl p-3 text-center font-bold">
                      تم رفض الطلبية وإبلاغ النظام بالرد.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <button
          onClick={loadData}
          className="w-full mt-6 border border-gray-700 rounded-xl p-3 text-gray-300"
        >
          🔄 تحديث الطلبات
        </button>

      </div>
    </main>
  );
}
