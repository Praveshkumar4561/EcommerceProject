import React, { useEffect } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const PushNotifications = () => {
  useEffect(() => {
    if (localStorage.getItem("pushSubscriptionSent") === "true") {
      console.log("Push subscription already sent; skipping duplicate.");
      return;
    }
    if ("serviceWorker" in navigator && "PushManager" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeUser();
        } else if (permission === "denied") {
          console.log("Notifications blocked; no data stored.");
        } else {
          console.log("User dismissed the notification prompt.");
        }
      });
    } else {
      console.log("Push notifications are not supported in this browser.");
    }
  }, []);

  const subscribeUser = async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        await fetch("http://89.116.170.231:1600/notify-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });
        localStorage.setItem("pushSubscriptionSent", "true");
      } else {
        console.log("Existing subscription found:", subscription);
        localStorage.setItem("pushSubscriptionSent", "true");
      }
    } catch (error) {
      console.error("Error during push subscription:", error);
    }
  };
  return null;
};

export default PushNotifications;
