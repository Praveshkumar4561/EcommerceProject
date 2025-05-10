import React, { useEffect, useState } from "react";
import axios from "axios";
const VAPID_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const PushNotifications = () => {
  const [notificationStatus, setNotificationStatus] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (Notification.permission === "granted") {
        setNotificationStatus("Allowed");
        registerAndSubscribe();
      } else if (Notification.permission === "denied") {
        setNotificationStatus("Blocked");
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setNotificationStatus("Allowed");
            registerAndSubscribe();
          } else if (permission === "denied") {
            setNotificationStatus("Blocked");
            console.log("User denied notifications.");
          } else {
            setNotificationStatus("Default");
          }
        });
      }
    } else {
      console.warn(
        "Service workers or Push messaging aren't supported in this browser."
      );
    }
  }, []);

  const registerAndSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        await axios.post("http://89.116.170.231:1600/subscribe", subscription, {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("Error during subscription process:", error);
    }
  };
  return null;
};

export default PushNotifications;
