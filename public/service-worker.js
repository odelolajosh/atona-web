// Handle notification click to open a specific chat or redirect
self.addEventListener('notificationclick', event => {
  console.log("Notification click")
  const clickedNotification = event.notification;
  clickedNotification.close();

  const redirectUrl = clickedNotification.data.redirectUrl ?? "/"

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith("/") && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(redirectUrl);
      }),
  );
});
