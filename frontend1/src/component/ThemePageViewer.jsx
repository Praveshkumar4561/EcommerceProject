import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://147.93.45.171:1600";

export default function ThemePageViewer() {
  const { pageName } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const themeName =
    "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc";

  useEffect(() => {
    const fetchThemePage = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${BACKEND_URL}/theme-page/${themeName}/${pageName || "index"}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const sanitizedHtml = DOMPurify.sanitize(html);
        setHtmlContent(sanitizedHtml);
      } catch (err) {
        console.error("Error fetching theme page:", err);
        setError(err.message || "Failed to load theme page");
      } finally {
        setLoading(false);
      }
    };

    fetchThemePage();
  }, [pageName]);

  useEffect(() => {
    if (!htmlContent || loading) return;

    const setupNavigation = () => {
      const container = document.getElementById("theme-container");
      if (!container) {
        console.warn("Theme container not found");
        return;
      }

      try {
        container.querySelectorAll("a[href$='.html']").forEach((link) => {
          const href = link.getAttribute("href");

          if (!href || /^(https?:|mailto:|#)/.test(href)) return;

          link.onclick = (e) => {
            e.preventDefault();
            const nextPage =
              href
                .replace(/^\/+/, "")
                .replace(/\.html$/, "")
                .trim() || "index";

            navigate(`/${nextPage}`);
          };
        });
      } catch (err) {
        console.error("Error setting up navigation:", err);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupNavigation, 100);

    return () => clearTimeout(timeoutId);
  }, [htmlContent, navigate, loading]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Loading theme page...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>
        <h3>Error Loading Page</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="theme-container"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
