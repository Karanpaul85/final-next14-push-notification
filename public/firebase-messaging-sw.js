importScripts(
  "https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB2YSdZvfODz38HymDhdlw-n8o4vYTjj1A",
  authDomain: "breaking-news-notification.firebaseapp.com",
  projectId: "breaking-news-notification",
  storageBucket: "breaking-news-notification.firebasestorage.app",
  messagingSenderId: "472854924420",
  appId: "1:472854924420:web:23a8c1812625004b2f46d1",
  measurementId: "G-5K92QHJVWP",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notification = payload.notification || {};
  const data = payload.data || {};

  const notificationOptions = {
    body: notification.body,
    icon: notification.icon || "/logo.png",
    image: notification.image || data.image,
    tag: "general-notification", // fallback to data.image
    data: {
      click_action: data.click_action || "https://example.com", // ensure this is named `click_action`
    },
  };

  self.registration.showNotification(notification.title, notificationOptions);
});

// self.addEventListener("install", function (event) {
//   console.log("Service Worker installed");
// });

// self.addEventListener("push", function (event) {
//   const payload = event.data?.json();

//   const data = payload.data || {};
//   const title = data.title || "Default Title";
//   const options = {
//     body: data.body,
//     icon: data.image || "/logo.png",
//     image: data.image,
//     tag: "general-notification",
//     data: {
//       click_action: data.click_action || "https://example.com",
//     },
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const click_action = event.notification.data?.click_action;

  if (click_action) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === click_action && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(click_action);
          }
        })
    );
  }
});
