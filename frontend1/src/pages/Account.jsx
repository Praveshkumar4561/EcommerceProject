import React from "react";
import { useLocation } from "react-router-dom";

export default function Account() {
  const location = useLocation();
  let themeFolder;

  if (location.pathname.startsWith("/roiser")) {
    themeFolder =
      "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser";
  } else if (location.pathname.startsWith("/pesco")) {
    themeFolder =
      "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template";
  } else {
    themeFolder =
      "radios-electronics-ecommerce-html-template-2023-11-27-05-16-52-utc--1--2025-06-28-16-22-26-utc/radios-html-package/Radios";
  }

  const fileUrl = `http://147.93.45.171:1600/themes/static/${themeFolder}/account.html`;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <iframe
        src={fileUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Account"
      />
    </div>
  );
}
