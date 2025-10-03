import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const themes = {
  roiser:
    "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser",
  radios:
    "radios-electronics-ecommerce-html-template-2023-11-27-05-16-52-utc--1--2025-06-28-16-22-26-utc/radios-html-package/Radios",
  pesco:
    "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template",
};

export default function IframeLoader() {
  const [src, setSrc] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedTheme = localStorage.getItem("selectedTheme") || "roiser";
    const folder = themes[selectedTheme];
    if (!folder) return navigate("/404", { replace: true });

    let rawPath = location.pathname.replace(/^\//, "");
    if (rawPath === "") rawPath = "index.html";
    const cleanPath = rawPath.replace(/[^a-zA-Z0-9_\-/.]/g, "");
    const url = `https://demo.webriefly.com/api/themes/static/${folder}/${cleanPath}`;

    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setSrc(url);
        } else {
          navigate("/404", { replace: true });
        }
      })
      .catch(() => navigate("/404", { replace: true }));
  }, [location.pathname, navigate]);

  if (!src) return null;

  return (
    <iframe
      src={src}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      title="static-theme-iframe"
    />
  );
}
