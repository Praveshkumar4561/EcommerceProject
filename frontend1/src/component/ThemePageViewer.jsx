import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ThemePageViewer() {
  const { pageName } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState(null);

  const themeName =
    "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc";

  useEffect(() => {
    fetch(
      `https://demo.webriefly.com/api/theme-page/${themeName}/${
        pageName || "index"
      }`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((html) => {
        setHtmlContent(html);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [pageName]);

  useEffect(() => {
    if (!htmlContent) return;

    setTimeout(() => {
      const container = document.getElementById("theme-container");
      if (!container) return;

      container.querySelectorAll("a[href$='.html']").forEach((link) => {
        const href = link.getAttribute("href");

        if (/^(https?:|mailto:|#)/.test(href)) return;

        link.onclick = (e) => {
          e.preventDefault();
          const next =
            href
              .replace(/^\/+/, "")
              .replace(/\.html$/, "")
              .trim() || "index";

          navigate(`/${next}`);
        };
      });
    }, 0);
  }, [htmlContent, navigate]);

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>
    );
  }

  return (
    <div
      id="theme-container"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
