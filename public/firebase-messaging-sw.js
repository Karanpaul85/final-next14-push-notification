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
  console.log("Background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: notification.icon || "/logo.png",
    image: notification.image || data.image,
    data: {
      url: data.click_action || "https://example.com",
    },
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(urlToOpen));
});
