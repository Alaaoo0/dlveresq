
"use client";

import { useEffect, useRef, useState } from "react";
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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function EmployeePage() {
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  const seenOrderIds = useRef<Set<string> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioEnabledRef = useRef(false);

  function playNotification() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      const playTone = (frequency: number, startTime: number) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(
          0.25,
          startTime + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          startTime + 0.35
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.36);
      };

      const now = audioContext.currentTime;

      playTone(880, now);
      playTone(1175, now + 0.25);
      playTone(880, now + 0.5);
    } catch (err) {
      console.error("Notification sound error:", err);
    }
  }

  async function enableSound() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) {
        setError("متصفحك لا يدعم تشغيل صوت التنبيه");
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      await audioContextRef.current.resume();

      audioEnabledRef.current = true;
      setAudioEnabled(true);

      playNotification();
    } catch {
      setError("تعذر تفعيل الصوت. حاول مرة أخرى.");
    }
  }

  async function enablePushNotifications() {
    setPushBusy(true);
    setError("");

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("متصفحك لا يدعم إشعارات الموبايل");
      }

      if (!("Notification" in window)) {
        throw new Error("الإشعارات غير مدعومة في هذا المتصفح");
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("مفتاح الإشعارات العام غير موجود في إعدادات الموقع");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("يجب السماح بالإشعارات من إعدادات المتصفح");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const response = await fetch("/api/employee/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر حفظ اشتراك الإشعارات");
      }

      setPushEnabled(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر تفعيل إشعارات الموبايل"
      );
    } finally {
      setPushBusy(false);
    }
  }

  async function checkPushStatus() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration("/");

      if (!registration) return;

      const subscription = await registration.pushManager.getSubscription();

      if (subscription && Notification.permission === "granted") {
        setPushEnabled(true);

        const response = await fetch("/api/employee/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
          }),
        });

        if (!response.ok) {
          setPushEnabled(false);
        }
      }
    } catch (err) {
      console.error("Push status error:", err);
    }
  }

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

      const freshOrders: Order[] = Array.isArray(ordersData)
        ? ordersData
        : ordersData.orders || [];

      const currentIds = new Set(
        freshOrders.map((order) => order.id)
      );

      if (seenOrderIds.current === null) {
        seenOrderIds.current = currentIds;
      } else {
        const newOrders = freshOrders.filter(
          (order) =>
            !seenOrderIds.current!.has(order.id) &&
            order.employeeResponse === "pending"
        );

        if (newOrders.length > 0) {
          setNewOrderAlert((count) => count + newOrders.length);

          if (audioEnabledRef.current) {
            playNotification();
          }
        }

        seenOrderIds.current = currentIds;
      }

      setOrders(freshOrders);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل البيانات"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    void checkPushStatus();

    const interval = window.setInterval(() => {
      void loadData();
    }, 10000);

    return () => {
      window.clearInterval(interval);

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
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
      <main
        dir="rtl"
        className="min-h-screen bg-gray-950 text-white flex items-center justify-center"
      >
        جاري تحميل بيانات الموظف...
      </main>
    );
  }

  if (!employee) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-gray-950 text-white flex items-center justify-center"
      >
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

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">🔔 إشعارات الموبايل</p>
              <p className="text-gray-400 text-sm mt-1">
                {pushEnabled
                  ? "إشعارات الطلبات مفعّلة"
                  : "فعّل الإشعارات حتى تصلك الطلبات على هاتفك"}
              </p>
            </div>

            <button
              onClick={enablePushNotifications}
              disabled={pushBusy || pushEnabled}
              className={`px-4 py-3 rounded-xl font-bold disabled:opacity-50 ${
                pushEnabled
                  ? "bg-green-700"
                  : "bg-blue-600"
              }`}
            >
              {pushBusy
                ? "جاري التفعيل..."
                : pushEnabled
                ? "✓ الإشعارات مفعّلة"
                : "تفعيل إشعارات الموبايل"}
            </button>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">🔔 صوت تنبيه الطلبيات</p>
              <p className="text-gray-400 text-sm mt-1">
                {audioEnabled
                  ? "الصوت مفعّل أثناء فتح الصفحة"
                  : "فعّل الصوت حتى تسمع عند وصول طلبية جديدة"}
              </p>
            </div>

            <button
              onClick={enableSound}
              className={`px-4 py-3 rounded-xl font-bold ${
                audioEnabled ? "bg-green-700" : "bg-yellow-500 text-black"
              }`}
            >
              {audioEnabled ? "✓ الصوت مفعّل" : "تفعيل صوت التنبيه"}
            </button>
          </div>

          {newOrderAlert > 0 && (
            <div className="mt-4 bg-yellow-950 border border-yellow-700 rounded-xl p-3 text-yellow-300 font-bold">
              🔔 وصلتك {newOrderAlert} طلبية جديدة!
            </div>
          )}
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
          <h2 className="text-xl font-bold">{employee.name}</h2>
          <p className="text-gray-400 mt-1">{employee.phone}</p>
          <p className="text-gray-400 text-sm mt-1">{employee.position}</p>

          <div className="flex items-center justify-between mt-5 gap-3">
            <div>
              <p className="font-bold">حالة العمل</p>
              <p
                className={`text-sm mt-1 ${
                  employee.isAvailable ? "text-green-400" : "text-red-400"
                }`}
              >
                {employee.isAvailable
                  ? "متاح لاستلام الطلبات"
                  : "غير متاح"}
              </p>
            </div>

            <button
              onClick={toggleAvailability}
              disabled={busy === "availability"}
              className={`px-5 py-3 rounded-xl font-bold disabled:opacity-50 ${
                employee.isAvailable ? "bg-red-600" : "bg-green-600"
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
                    isWaiting ? "border-yellow-500" : "border-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <h3 className="font-bold text-lg">
                      طلب #{order.id.slice(-6)}
                    </h3>

                    <span
                      className={`text-sm font-bold ${
                        isWaiting
                          ? "text-yellow-400"
                          : isRejected
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
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
                          {busy === order.id
                            ? "جاري الإرسال..."
                            : "✓ قبول الطلبية"}
                        </button>

                        <button
                          onClick={() =>
                            respondToOrder(order.id, "rejected")
                          }
                          disabled={busy === order.id}
                          className="bg-red-600 text-white font-bold rounded-xl p-3 disabled:opacity-50"
                        >
                          {busy === order.id
                            ? "جاري الإرسال..."
                            : "✕ رفض الطلبية"}
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
          onClick={() => {
            setNewOrderAlert(0);
            void loadData();
          }}
          className="w-full mt-6 border border-gray-700 rounded-xl p-3 text-gray-300"
        >
          🔄 تحديث الطلبات
        </button>

        {waitingOrders.length > 0 && (
          <p className="text-center text-yellow-400 text-sm mt-4">
            لديك {waitingOrders.length} طلبية بانتظار موافقتك
          </p>
        )}
      </div>
    </main>
  );
}
