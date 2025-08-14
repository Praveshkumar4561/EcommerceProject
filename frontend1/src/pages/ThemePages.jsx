import React, { useEffect, useState, useRef } from "react";

export default function ThemePages() {
  const [themeFolder, setThemeFolder] = useState(null);
  const [rawHtml, setRawHtml] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    async function loadTheme() {
      setLoading(true);
      setError(null);

      try {
        const resp = await fetch("http://147.93.45.171:1600/themes/active");
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const { folder_name } = await resp.json();
        if (!folder_name) throw new Error("No active theme found.");
        setThemeFolder(folder_name);

        const htmlResp = await fetch(`/themes/${folder_name}/index.html`);
        if (!htmlResp.ok)
          throw new Error(`Status ${htmlResp.status} when fetching index.html`);
        const text = await htmlResp.text();

        const fixed = text
          .replace(/href="css\//g, `href="/themes/${folder_name}/css/`)
          .replace(/src="js\//g, `src="/themes/${folder_name}/js/`)
          .replace(/src="assets\//g, `src="/themes/${folder_name}/assets/`);

        setRawHtml(fixed);
      } catch (err) {
        console.error("Error loading theme HTML:", err);
        setError(err.message || "Unknown error loading theme");
      } finally {
        setLoading(false);
      }
    }

    loadTheme();
  }, []);

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading theme preview…</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        <p>Error loading theme HTML:</p>
        <pre>{error}</pre>
      </div>
    );
  }

  const rewrittenHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Theme Preview: ${themeFolder}</title>
        <!-- Link exactly the theme’s CSS so nothing else seeps in -->
        <link rel="stylesheet" href="/themes/${themeFolder}/style.css" />
        <!-- If the theme needs more CSS (e.g. /themes/${themeFolder}/css/bootstrap.min.css), add those here -->
      </head>
      <body style="margin:0; padding:0;">
        ${rawHtml}
      </body>
    </html>
  `;

  return (
    <div style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}>
      <iframe
        ref={iframeRef}
        title={`Preview of ${themeFolder}`}
        srcDoc={rewrittenHtml}
        sandbox="allow-same-origin allow-scripts"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
