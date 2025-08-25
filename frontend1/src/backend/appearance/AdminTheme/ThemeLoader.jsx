import React, { useEffect } from "react";

const ThemeLoader = ({ themeId, themePath }) => {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const iframe = document.createElement("iframe");
        iframe.id = "theme-preview-frame";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.zIndex = "1000";
        iframe.src = `/themes/${themePath}/index.html`;

        iframe.onload = () => {
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;

            const base = iframeDoc.createElement("base");
            base.href = `/themes/${themePath}/`;
            iframeDoc.head.insertBefore(base, iframeDoc.head.firstChild);

            const fixRelativeUrls = (elements, attribute) => {
              elements.forEach((el) => {
                const url = el.getAttribute(attribute);
                if (url && !url.startsWith("http") && !url.startsWith("/")) {
                  el.setAttribute(attribute, `/themes/${themePath}/${url}`);
                }
              });
            };

            fixRelativeUrls(
              iframeDoc.querySelectorAll('link[rel="stylesheet"]'),
              "href"
            );
            fixRelativeUrls(iframeDoc.querySelectorAll("script[src]"), "src");
            fixRelativeUrls(iframeDoc.querySelectorAll("img[src]"), "src");

            iframeDoc.addEventListener("click", (e) => {
              const link = e.target.closest("a");
              if (link && link.href) {
                e.preventDefault();
                const url = new URL(link.href);
                if (url.pathname.endsWith(".html")) {
                  iframe.src = `/themes/${themePath}/${url.pathname}`;
                }
              }
            });
          } catch (error) {
            console.error("Error setting up iframe:", error);
          }
        };

        document.body.appendChild(iframe);

        return () => {
          iframe.remove();
        };
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();
  }, [themeId, themePath]);

  return null;
};

export default ThemeLoader;
