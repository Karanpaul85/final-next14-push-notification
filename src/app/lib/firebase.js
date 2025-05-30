import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB2YSdZvfODz38HymDhdlw-n8o4vYTjj1A",
  authDomain: "breaking-news-notification.firebaseapp.com",
  projectId: "breaking-news-notification",
  storageBucket: "breaking-news-notification.firebasestorage.app",
  messagingSenderId: "472854924420",
  appId: "1:472854924420:web:23a8c1812625004b2f46d1",
  measurementId: "G-5K92QHJVWP",
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { messaging, getToken, onMessage };
