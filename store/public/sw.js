self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: "وصلتك طلبية جديدة" };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "🔔 طلبية جديدة",
      {
        body: data.body || "المدير أرسل لك طلبية جديدة",
        tag: data.tag || "new-order",
        renotify: true,
        requireInteraction: true,
        data: { url: "/employee" }
      }
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/employee")
  );
});
