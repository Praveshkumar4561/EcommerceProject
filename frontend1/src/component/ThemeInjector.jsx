// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const slugify = (str = "") =>
    str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;

    let aborted = false;
    let submitHandler = null;

    const isAbsoluteOrProtocol = (u = "") =>
      /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);

    const isDataOrBlobOrMail = (u = "") =>
      /^(data:|blob:|mailto:|tel:|#)/.test(u);

    const isApiPath = (u = "") =>
      typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");

    const isRelativeForRewrite = (u = "") =>
      !!u &&
      !isAbsoluteOrProtocol(u) &&
      !isDataOrBlobOrMail(u) &&
      !isApiPath(u);

    const themeBaseNormalized = (b = themeBaseUrl) =>
      b.endsWith("/") ? b : b + "/";

    const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
      if (!url) return url;
      if (isApiPath(url) || isAbsoluteOrProtocol(url)) return url;
      if (url.startsWith("/"))
        return themeBaseNormalized(base) + url.replace(/^\/+/, "");
      try {
        return new URL(url, themeBaseNormalized(base)).href;
      } catch {
        return themeBaseNormalized(base) + url.replace(/^\.*\//, "");
      }
    };

    const normalizeSpaPath = (p = "/") => {
      if (!p) return "/";
      try {
        const u = new URL(p, window.location.origin);
        p = (u.pathname || "") + (u.search || "");
      } catch {}
      p = p.replace(/\.html$/i, "").replace(/\/+/g, "/");
      if (p.length > 1) p = p.replace(/\/$/, "");
      if (!p.startsWith("/")) p = "/" + p;
      if (p === "/index") p = "/";
      return (
        "/" +
        p
          .split("/")
          .map((part) => slugify(part))
          .filter(Boolean)
          .join("/")
      );
    };

    const routeViaSPA = (path, opts = {}) => {
      const spa = normalizeSpaPath(path);
      if (typeof onNavigate === "function") {
        try {
          onNavigate(spa, opts);
          return;
        } catch (e) {
          console.warn("[ThemeInjector] onNavigate threw:", e);
        }
      }
      if (opts.replace) history.replaceState({}, "", spa);
      else history.pushState({}, "", spa);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const rewriteInjectedLinks = (container) => {
      if (!container) return;
      container.querySelectorAll("a[href]").forEach((a) => {
        let href = a.getAttribute("href");
        if (!href) return;
        if (
          isAbsoluteOrProtocol(href) ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        )
          return;
        // convert relative to SPA domain path
        href = normalizeSpaPath(href);
        a.setAttribute("href", href);
      });
    };

    const rewriteInjectedAssets = (container, base) => {
      if (!container) return;
      container.querySelectorAll("img, source, [data-src]").forEach((el) => {
        const attr =
          el.tagName.toLowerCase() === "img"
            ? "src"
            : el.getAttribute("src")
            ? "src"
            : "data-src";
        const val = el.getAttribute(attr);
        if (!val) return;
        if (isRelativeForRewrite(val) || val.startsWith("/")) {
          const abs = makeAbsoluteUrl(val, base);
          el.setAttribute(attr, abs);
        }
      });
    };

    const loadStylesheet = (href, timeoutMs = 5000) =>
      new Promise((resolve) => {
        try {
          if (
            document.head.querySelector(
              `link[rel="stylesheet"][href="${href}"]`
            )
          )
            return resolve();
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.dataset.themeInjected = "true";
          link.onload = resolve;
          link.onerror = resolve;
          document.head.appendChild(link);
          setTimeout(resolve, timeoutMs);
        } catch {
          resolve();
        }
      });

    const executeScriptsSerial = async (doc) => {
      const scripts = Array.from(doc.querySelectorAll("script"));
      for (const s of scripts) {
        if (aborted || !mountedRef.current) break;
        const src = s.getAttribute("src");
        const type = s.getAttribute("type") || "";
        if (src) {
          const abs = makeAbsoluteUrl(src, themeBaseUrl);
          await new Promise((resolve) => {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.src = abs;
            el.async = false;
            el.dataset.themeInjected = "true";
            el.onload = resolve;
            el.onerror = resolve;
            document.body.appendChild(el);
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

    const tryFetchWithFallbacks = async (origUrl) => {
      let res = await fetch(origUrl, { cache: "no-cache" }).catch(() => null);
      if (res && res.ok) return res;

      if (!origUrl.match(/\.html$/i)) {
        const alt = origUrl.replace(/\/+$/, "") + ".html";
        res = await fetch(alt, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) return res;
      }

      try {
        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetch(dynamicUrl, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) return res;
      } catch {}

      return res;
    };

    const loadTheme = async () => {
      setLoading(true);
      document.head
        .querySelectorAll('link[data-theme-injected="true"]')
        .forEach((el) => el.remove());
      document.head
        .querySelectorAll('style[data-theme-injected="true"]')
        .forEach((el) => el.remove());
      document.body
        .querySelectorAll('script[data-theme-injected="true"]')
        .forEach((el) => el.remove());
      if (containerRef.current) containerRef.current.innerHTML = "";

      try {
        const res = await tryFetchWithFallbacks(pageUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure <base> uses domain, not IP
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl).replace(
          "https://demo.webriefly.com",
          "demo.webriefly.com"
        );

        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));
        await Promise.all(
          linkNodes.map((l) => {
            const rawHref = l.getAttribute("href");
            if (!rawHref) return;
            return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl));
          })
        );
        styleNodes.forEach((s) => {
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = doc.body.innerHTML;
          rewriteInjectedAssets(containerRef.current, themeBaseUrl);
          rewriteInjectedLinks(containerRef.current);
        }

        await executeScriptsSerial(doc);

        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 300);

        submitHandler = (e) => {
          if (!containerRef.current) return;
          let node = e.target;
          while (
            node &&
            node !== containerRef.current &&
            node.tagName !== "FORM"
          )
            node = node.parentElement;
          if (!node || node.tagName !== "FORM") return;
          const action = node.getAttribute("action") || "";
          if (action && !isAbsoluteOrProtocol(action)) {
            e.preventDefault();
            const spa = normalizeSpaPath(action);
            routeViaSPA(spa || "/");
          }
        };
        containerRef.current.addEventListener("submit", submitHandler, true);
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();

    return () => {
      aborted = true;
      try {
        if (containerRef.current && submitHandler)
          containerRef.current.removeEventListener(
            "submit",
            submitHandler,
            true
          );
      } catch {}
    };
  }, [pageUrl, themeBaseUrl, onNavigate]);

  return (
    <div className="theme-wrapper" style={{ width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        className="theme-container"
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: loading ? "none" : "block",
        }}
      />
    </div>
  );
}
