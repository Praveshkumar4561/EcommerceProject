// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

// ThemeInjector (non-SPA behavior)
// - Keeps normal browser navigation for links/forms (full page reload)
// - Converts relative asset and link URLs to absolute URLs so clicks cause real navigations
// - Injects styles and scripts for fetched HTML when staying on same page
// - Handles aborts and avoids duplicate injected resources

export default function ThemeInjector({ pageUrl, themeBaseUrl }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const abortControllerRef = useRef(null);
  const injectedResourcesRef = useRef(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const slugify = (str = "") =>
    String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");

  const isAbsoluteOrProtocol = (u = "") =>
    /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);
  const isDataOrBlobOrMail = (u = "") =>
    /^(data:|blob:|mailto:|tel:|#)/.test(u);
  const isApiPath = (u = "") =>
    typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");
  const isRelativeForRewrite = (u = "") =>
    !!u && !isAbsoluteOrProtocol(u) && !isDataOrBlobOrMail(u) && !isApiPath(u);

  const themeBaseNormalized = (b = themeBaseUrl) =>
    b ? (b.endsWith("/") ? b : b + "/") : "";

  const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
    if (!url) return url;
    if (isApiPath(url) || isAbsoluteOrProtocol(url)) return url;
    if (!base) return url;
    if (url.startsWith("/"))
      return themeBaseNormalized(base) + url.replace(/^\/+/, "");
    try {
      return new URL(url, themeBaseNormalized(base)).href;
    } catch {
      return themeBaseNormalized(base) + url.replace(/^\.*\//, "");
    }
  };

  const rewriteInjectedAssets = (container, base) => {
    if (!container) return;
    container.querySelectorAll("img, source, [data-src]").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const attr =
        tag === "img" ? "src" : el.getAttribute("src") ? "src" : "data-src";
      const val = el.getAttribute(attr);
      if (!val) return;
      if (isRelativeForRewrite(val) || val.startsWith("/")) {
        const abs = makeAbsoluteUrl(val, base);
        el.setAttribute(attr, abs);
      }
    });
  };

  // IMPORTANT: For non-SPA behavior we convert relative links to absolute URLs
  // so that when the user clicks them the browser performs a normal navigation
  const rewriteInjectedLinks = (container, base) => {
    if (!container) return;
    container.querySelectorAll("a[href]").forEach((a) => {
      let href = a.getAttribute("href");
      if (!href) return;
      // leave hash-only, mailto, tel, and absolute links untouched
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        isAbsoluteOrProtocol(href)
      )
        return;
      // convert relative to absolute so browser navigates away normally
      const abs = makeAbsoluteUrl(href, base);
      if (abs) a.setAttribute("href", abs);
    });
  };

  const loadStylesheet = (href, timeoutMs = 7000) =>
    new Promise((resolve) => {
      try {
        if (!href) return resolve();
        const abs = makeAbsoluteUrl(href, themeBaseUrl);
        if (injectedResourcesRef.current.has(abs)) return resolve();
        if (
          document.head.querySelector(`link[rel="stylesheet"][href="${abs}"]`)
        ) {
          injectedResourcesRef.current.add(abs);
          return resolve();
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = abs;
        link.dataset.themeInjected = "true";
        const done = () => {
          injectedResourcesRef.current.add(abs);
          resolve();
        };
        link.onload = done;
        link.onerror = done;
        document.head.appendChild(link);
        setTimeout(done, timeoutMs);
      } catch {
        resolve();
      }
    });

  const executeScriptsSerial = async (doc) => {
    const scripts = Array.from(doc.querySelectorAll("script"));
    for (const s of scripts) {
      if (!mountedRef.current) break;
      const src = s.getAttribute("src");
      const type = s.getAttribute("type") || "";

      if (src) {
        const abs = makeAbsoluteUrl(src, themeBaseUrl);
        if (injectedResourcesRef.current.has(abs)) continue;
        await new Promise((resolve) => {
          try {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.src = abs;
            el.async = false;
            el.dataset.themeInjected = "true";
            el.onload = () => {
              injectedResourcesRef.current.add(abs);
              resolve();
            };
            el.onerror = () => {
              injectedResourcesRef.current.add(abs);
              resolve();
            };
            document.body.appendChild(el);
          } catch {
            resolve();
          }
        });
      } else {
        const content = s.textContent || "";
        if (/document\.write/.test(content)) continue;
        try {
          const el = document.createElement("script");
          if (type) el.type = type;
          el.text = content;
          el.dataset.themeInjected = "true";
          document.body.appendChild(el);
        } catch {}
      }
    }
  };

  const tryFetchWithFallbacks = async (origUrl, signal) => {
    let res = null;
    try {
      res = await fetch(origUrl, { cache: "no-cache", signal }).catch(
        () => null
      );
      if (res && res.ok) return res;
    } catch {}

    try {
      if (!origUrl.match(/\.html$/i)) {
        const alt = origUrl.replace(/\/+$/, "") + ".html";
        res = await fetch(alt, { cache: "no-cache", signal }).catch(() => null);
        if (res && res.ok) return res;
      }
    } catch {}

    try {
      const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
      res = await fetch(dynamicUrl, { cache: "no-cache", signal }).catch(
        () => null
      );
      if (res && res.ok) return res;
    } catch {}

    return res;
  };

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;

    // abort any previous in-flight fetch
    try {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    } catch {}

    const controller = new AbortController();
    abortControllerRef.current = controller;
    let localAborted = false;

    const loadTheme = async () => {
      if (!mountedRef.current) return;
      setLoading(true);

      try {
        const res = await tryFetchWithFallbacks(pageUrl, controller.signal);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current || localAborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag exists and points to theme base
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));

        await Promise.all(
          linkNodes.map((l) => loadStylesheet(l.getAttribute("href")))
        );

        styleNodes.forEach((s) => {
          try {
            const newStyle = document.createElement("style");
            newStyle.innerHTML = s.innerHTML || "";
            newStyle.dataset.themeInjected = "true";
            document.head.appendChild(newStyle);
          } catch {}
        });

        const temp = document.createElement("div");
        temp.innerHTML = doc.body.innerHTML || "";

        // convert relative assets and links to absolute so normal navigation works
        rewriteInjectedAssets(temp, themeBaseUrl);
        rewriteInjectedLinks(temp, themeBaseUrl);

        // only replace container content once we have fully prepared HTML to avoid blank flicker
        if (mountedRef.current && containerRef.current) {
          try {
            containerRef.current.innerHTML = temp.innerHTML;
            containerRef.current.scrollTop = 0;
          } catch {}
        }

        // run scripts after mounting
        await executeScriptsSerial(doc);

        // lifecycle events (short delay)
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 150);
      } catch (err) {
        if (err && err.name === "AbortError") {
          // ignore
        } else {
          console.error("[ThemeInjector] loadTheme failed:", err);
        }
      } finally {
        if (!localAborted && mountedRef.current) setLoading(false);
      }
    };

    loadTheme();

    return () => {
      localAborted = true;
      try {
        if (abortControllerRef.current) abortControllerRef.current.abort();
      } catch {}
    };
  }, [pageUrl, themeBaseUrl]);

  return (
    <div
      className="theme-wrapper"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <div
        ref={containerRef}
        className="theme-container"
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "block",
        }}
      />

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
