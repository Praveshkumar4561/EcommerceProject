import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeInjector from "../component/ThemeInjector";

export default function Account() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const pageUrl = `https://demo.webriefly.com/api/themes/static/${themeFolder}/account.html`;
  const themeBaseUrl = `https://demo.webriefly.com/api/themes/static/${themeFolder}/`;

  const onNavigate = (path) => {
    if (path === "/") navigate("/", { replace: false });
    else navigate(path, { replace: false });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ThemeInjector
        pageUrl={pageUrl}
        themeBaseUrl={themeBaseUrl}
        onNavigate={onNavigate}
      />
    </div>
  );
}
