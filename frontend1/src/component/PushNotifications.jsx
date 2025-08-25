import React, { useEffect, useState } from "react";
import axios from "axios";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// Utility: convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const PushNotifications = () => {
  const [notificationStatus, setNotificationStatus] = useState("");

  useEffect(() => {
    console.log("🔔 Checking push support...");

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("❌ Service workers or Push messaging aren't supported.");
      setNotificationStatus("unsupported");
      return;
    }

    console.log(
      "🔍 Current Notification.permission =",
      Notification.permission
    );

    if (Notification.permission === "granted") {
      setNotificationStatus("allowed");
      registerAndSubscribe();
    } else if (Notification.permission === "denied") {
      setNotificationStatus("blocked");
      console.warn("🚫 Notifications are blocked by the user.");
    } else {
      console.log("📢 Asking for notification permission...");
      Notification.requestPermission().then((permission) => {
        console.log("🔑 Permission result:", permission);
        if (permission === "granted") {
          setNotificationStatus("allowed");
          registerAndSubscribe();
        } else if (permission === "denied") {
          setNotificationStatus("blocked");
          console.warn("🚫 User denied notifications.");
        } else {
          setNotificationStatus("default");
          console.log("ℹ️ Permission dismissed (default).");
        }
      });
    }
  }, []);

  const registerAndSubscribe = async () => {
    try {
      console.log("⚙️ Registering service worker...");
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("✅ Service worker registered:", registration);

      await navigator.serviceWorker.ready;
      console.log("✅ Service worker is ready");

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        console.log("📡 No subscription found, creating new one...");
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log("✅ New subscription created:", subscription);

        // Send subscription to backend
        await axios.post(`${BACKEND_URL}/subscribe`, subscription, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("📤 Subscription sent to backend:", BACKEND_URL);
      } else {
        console.log("🔄 Existing subscription detected:", subscription);
      }
    } catch (error) {
      console.error("❌ Error during subscription process:", error);
    }
  };

  return null;
};

export default PushNotifications;
