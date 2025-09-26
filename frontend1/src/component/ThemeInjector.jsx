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

    // ---------- helpers (unchanged) ----------
    const isAbsoluteOrProtocol = (u = "") =>
      /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);
    const isDataOrBlobOrMail = (u = "") =>
      /^(data:|blob:|mailto:|tel:|#)/.test(u);
    const isApiPath = (u = "") =>
      typeof u === "string" && u.startsWith("http://147.93.45.171:1600/");
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
      return "/" + p.split("/").map(slugify).filter(Boolean).join("/");
    };

    const routeViaSPA = (path, opts = {}) => {
      const spa = normalizeSpaPath(path);
      if (typeof onNavigate === "function") {
        try {
          onNavigate(spa, opts);
          return;
        } catch (e) {
          console.warn(e);
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
        a.setAttribute("href", normalizeSpaPath(href));
      });
    };

    const rewriteInjectedAssets = (container, base) => {
      if (!container) return;
      container.querySelectorAll("img, source, [data-src]").forEach((el) => {
        const attr = el.getAttribute("src") ? "src" : "data-src";
        const val = el.getAttribute(attr);
        if (!val) return;
        if (isRelativeForRewrite(val) || val.startsWith("/")) {
          el.setAttribute(attr, makeAbsoluteUrl(val, base));
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
          const el = document.createElement("script");
          if (type) el.type = type;
          el.text = content;
          el.dataset.themeInjected = "true";
          document.body.appendChild(el);
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
      return null;
    };

    // ---- ADDED: check pagesdata before loading theme ----
    const checkPageExists = async (slug) => {
      try {
        const r = await fetch("http://147.93.45.171:1600/pagesdata");
        if (!r.ok) return false;
        const arr = await r.json();
        const lower = slugify(slug);
        return arr.find(
          (p) =>
            slugify(p.permalink) === lower &&
            String(p.status).toLowerCase() === "published"
        );
      } catch {
        return false;
      }
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
        const spaPath = normalizeSpaPath(pageUrl);
        const slug = spaPath.replace(/^\/+/, "");
        const found = await checkPageExists(slug);

        // If no page found, force dynamic.html and fetch Page Not Found record
        let targetUrl = pageUrl;
        let pageNotFoundData = null;
        if (!found) {
          targetUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
          // find the special "Page Not Found" record
          try {
            const r = await fetch("http://147.93.45.171:1600/pagesdata");
            const arr = await r.json();
            pageNotFoundData = arr.find(
              (p) => slugify(p.permalink) === "page-not-found"
            );
          } catch {}
        }

        const res = await tryFetchWithFallbacks(targetUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${targetUrl}`);
        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // update title if fallback
        if (!found && pageNotFoundData) {
          document.title = pageNotFoundData.name || "Page Not Found";
          const holder = doc.querySelector("#dynamic-content");
          if (holder)
            holder.innerHTML = `<h1>${pageNotFoundData.name}</h1><p>${pageNotFoundData.description}</p>`;
        } else {
          const newTitle = doc.querySelector("title")?.textContent?.trim();
          if (newTitle) document.title = newTitle;
        }

        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl).replace(
          "147.93.45.171:1600",
          "srv689968.hstgr.cloud"
        );

        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));
        await Promise.all(
          linkNodes.map((l) => {
            const rawHref = l.getAttribute("href");
            return (
              rawHref && loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl))
            );
          })
        );
        styleNodes.forEach((s) => {
          const st = document.createElement("style");
          st.innerHTML = s.innerHTML || "";
          st.dataset.themeInjected = "true";
          document.head.appendChild(st);
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = doc.body.innerHTML;
          rewriteInjectedAssets(containerRef.current, themeBaseUrl);
          rewriteInjectedLinks(containerRef.current);
        }

        await executeScriptsSerial(doc);

        setTimeout(() => {
          document.dispatchEvent(
            new Event("DOMContentLoaded", { bubbles: true })
          );
          window.dispatchEvent(new Event("load", { bubbles: true }));
          window.dispatchEvent(new Event("pageshow", { bubbles: true }));
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
      if (containerRef.current && submitHandler)
        containerRef.current.removeEventListener("submit", submitHandler, true);
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
