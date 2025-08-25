import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function IframePage() {
  const { page } = useParams();
  const navigate = useNavigate();

  const normalize = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  const pageKey = normalize(page || "index");

  const themes = [
    {
      name: "roiser",
      folder:
        "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser",
    },
    // {
    //   name: "radios",
    //   folder:
    //     "radios-electronics-ecommerce-html-template-2023-11-27-05-16-52-utc--1--2025-06-28-16-22-26-utc/radios-html-package/Radios",
    // },
    // {
    //   name: "pesco",
    //   folder:
    //     "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template",
    // },
  ];

  const staticFiles = new Set([
    "about.html",
    "blog-details.html",
    "blog-list.html",
    "blog-grid.html",
    "cart.html",
    "checkout.html",
    "contact.html",
    "error.html",
    "faq.html",
    "index-2.html",
    "index-3.html",
    "index.html",
    "login.html",
    "register.html",
    "shop-details.html",
    "shop-grid.html",
    "shop.html",
    "wishlist.html",
  ]);

  const [iframeSrc, setIframeSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const tryResolve = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://147.93.45.171:1600/pagesdata");
        if (response.ok) {
          const pages = await response.json();

          if (Array.isArray(pages)) {
            const matched = pages.find((p) => {
              const permalink = normalize(p?.permalink || "");
              const name = normalize(p?.name || "");
              return permalink === pageKey || name === pageKey;
            });

            if (matched && !cancelled) {
              const status = String(matched?.status || "")
                .trim()
                .toLowerCase();

              if (status === "pending") {
                if (!cancelled) setLoading(false);
                navigate("/error", { replace: true });
                return;
              }

              const allowed = new Set(["published", "draft"]);
              if (matched?.status && !allowed.has(status)) {
                if (!cancelled) setLoading(false);
                navigate("/error", { replace: true });
                return;
              }

              const theme = themes[0];
              const slug = matched.permalink || matched.name || pageKey;
              const url = `http://147.93.45.171:1600/themes/static/${
                theme.folder
              }/dynamic.html?slug=${encodeURIComponent(slug)}`;
              if (!cancelled) {
                setIframeSrc(url);
                setLoading(false);
              }
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Error fetching data:", err);
      }

      const candidate = `${pageKey}.html`;
      if (staticFiles.has(candidate) && !cancelled) {
        const theme = themes[0];
        const url = `http://147.93.45.171:1600/themes/static/${theme.folder}/${candidate}`;
        setIframeSrc(url);
        setLoading(false);
        return;
      }

      if ((pageKey === "index" || pageKey === "") && !cancelled) {
        const theme = themes[0];
        const url = `http://147.93.45.171:1600/themes/static/${theme.folder}/index.html`;
        setIframeSrc(url);
        setLoading(false);
        return;
      }

      if (!cancelled) {
        setLoading(false);
        navigate("/error", { replace: true });
      }
    };

    tryResolve();

    return () => {
      cancelled = true;
    };
  }, [pageKey, navigate]);

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div></div>
      </div>
    );
  }

  if (!iframeSrc) return null;

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
        src={iframeSrc}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title={pageKey}
      />
    </div>
  );
}
