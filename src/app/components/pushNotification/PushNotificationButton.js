"use client";

import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "./../../lib/firebase"; // Adjust the import path as necessary

// const VAPID_KEY =
// "BEWVewYC3Vja2sC3qQ12-JYZubW9p0797eHaiHLZUQixgCQQ_N-oKLnAbHmcuHIpdgwUc_FAY-d5EtwP7QvmVHg";

export default function PushNotificationButton() {
  const [token, setToken] = useState(null);

  const initFCM = async () => {
    if ("serviceWorker" in navigator && messaging) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY, // Ensure this is set in your .env.local
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        setToken(currentToken);
        console.log("FCM Token:", currentToken);
      } else {
        console.warn("No FCM token available");
      }

      // onMessage(messaging, (payload) => {
      //   const { title, body, image } = payload.notification;
      //   const click_action = payload.data?.click_action;

      //   const notification = new Notification(title, {
      //     body,
      //     icon: image || "/default-icon.png",
      //   });

      //   notification.onclick = (event) => {
      //     event.preventDefault();
      //     if (click_action) {
      //       window.open(click_action, "_blank");
      //     }
      //   };
      // });
      onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        const { title, body, image } = payload.notification;
        const click_action = payload.data?.click_action;

        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification(title, {
              body,
              icon: image || "/window.svg",
              image,
              data: {
                click_action: click_action || "/",
              },
            });
          } else {
            console.warn("Service worker not registered");
          }
        });
      });
    }
  };

  const requestAndInit = async () => {
    if (Notification.permission !== "granted") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted");
          initFCM();
        } else {
          console("Notification permission denied.");
        }
      } catch (error) {
        console.error("Permission request failed:", error);
      }
    } else {
      initFCM(); // Already granted
    }
  };

  useEffect(() => {
    requestAndInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendNotification = async () => {
    const res = await fetch("/api/sendNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        title: "Hello KP Next.js!",
        body: "This is a push notification.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/330px-Altja_j%C3%B5gi_Lahemaal.jpg",
        click_action: "https://www.google.com",
      }),
    });

    const data = await res.json();
    console.log("Notification sent:", data);
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(token)
      .then(() => alert("Token copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };
  return (
    <div>
      {token ? (
        <button
          onClick={sendNotification}
          disabled={!token}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Push Notification
        </button>
      ) : (
        <button
          onClick={requestAndInit}
          disabled={token}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Allow Notification
        </button>
      )}

      <div onClick={handleCopy} style={{ marginTop: "30px" }}>
        {token}
      </div>
    </div>
  );
}
