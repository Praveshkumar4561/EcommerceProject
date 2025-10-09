// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ThemeInjector
 * - keeps existing DOM until new theme HTML + CSS ready (prevents blank)
 * - waits for stylesheets (with timeout) before swapping content
 * - caches fetched HTML (in-memory + sessionStorage)
 * - inserts external scripts async and inline scripts during idle
 * - handles form submit SPA interception
 */
export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  // small in-memory cache and session fallback
  const htmlCacheRef = useRef({});
  useEffect(() => {
    mountedRef.current = true;
    // restore session cache if exists
    try {
      const s = sessionStorage.getItem("themeInjectorHtmlCache");
      if (s) htmlCacheRef.current = JSON.parse(s);
    } catch {}
    return () => {
      mountedRef.current = false;
      // persist cache lightly
      try {
        sessionStorage.setItem(
          "themeInjectorHtmlCache",
          JSON.stringify(htmlCacheRef.current || {})
        );
      } catch {}
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

    // build absolute fetch url for theme HTML (handles /path or absolute url)
    const makeFetchUrl = (p = "") => {
      if (!p) p = "/";
      if (isAbsoluteOrProtocol(p)) return p;
      const clean = p.replace(/^\/*/, "");
      // prefer explicit index.html if just root
      if (clean === "" || clean === "/")
        return themeBaseNormalized(themeBaseUrl) + "index.html";
      return themeBaseNormalized(themeBaseUrl) + clean;
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
        const newHref = normalizeSpaPath(href);
        a.setAttribute("href", newHref);
      });
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
          // add lazy loading for non-critical images (helps perceived performance)
          if (tag === "img" && !el.hasAttribute("loading")) {
            el.setAttribute("loading", "lazy");
          }
        }
      });
    };

    // inject stylesheet and wait until loaded or timeout
    const loadStylesheet = (href, timeoutMs = 7000) =>
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
          const done = () => resolve();
          link.onload = done;
          link.onerror = done;
          document.head.appendChild(link);
          setTimeout(done, timeoutMs);
        } catch {
          resolve();
        }
      });

    // load external scripts async and inline scripts during idle
    const executeScripts = (doc) => {
      const scripts = Array.from(doc.querySelectorAll("script"));
      scripts.forEach((s) => {
        const src = s.getAttribute("src");
        const type = s.getAttribute("type") || "";
        if (src) {
          const abs = makeAbsoluteUrl(src, themeBaseUrl);
          if (!document.body.querySelector(`script[src="${abs}"]`)) {
            const el = document.createElement("script");
            el.src = abs;
            el.async = true; // don't block paint
            if (type) el.type = type;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          }
        } else {
          const content = s.textContent || "";
          if (/document\.write/.test(content)) return;
          // run inline scripts during idle so they don't block initial render
          const runInline = () => {
            try {
              const el = document.createElement("script");
              if (type) el.type = type;
              el.text = content;
              el.dataset.themeInjected = "true";
              document.body.appendChild(el);
            } catch {}
          };
          if ("requestIdleCallback" in window) {
            try {
              requestIdleCallback(runInline, { timeout: 200 });
            } catch {
              setTimeout(runInline, 50);
            }
          } else {
            setTimeout(runInline, 50);
          }
        }
      });
    };

    // fetch wrapper with timeout
    const fetchWithTimeout = async (url, ms = 10000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          cache: "no-cache",
        });
        clearTimeout(id);
        return res;
      } catch (e) {
        clearTimeout(id);
        return null;
      }
    };

    // try fetch with fallbacks and small retry attempts
    const tryFetchWithFallbacks = async (origUrl) => {
      // fast return from cache
      if (htmlCacheRef.current[origUrl]) {
        return new Response(htmlCacheRef.current[origUrl], { status: 200 });
      }

      // attempt 1: direct
      let res = await fetchWithTimeout(origUrl, 10000);
      if (res && res.ok) {
        const html = await res.text();
        htmlCacheRef.current[origUrl] = html;
        return new Response(html);
      }

      // attempt 2: try with .html appended
      if (!origUrl.match(/\.html$/i)) {
        const alt = origUrl.replace(/\/+$/, "") + ".html";
        res = await fetchWithTimeout(alt, 8000);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[origUrl] = html;
          return new Response(html);
        }
      }

      // attempt 3: dynamic.html at theme base
      try {
        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetchWithTimeout(dynamicUrl, 8000);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[origUrl] = html;
          return new Response(html);
        }
      } catch {}

      // last: null
      return res;
    };

    // swap content only when ready; if previous content exists -> fade; else show loader then set
    const swapContentSafely = (htmlString, baseForRewrite, options = {}) => {
      if (!containerRef.current) return;
      try {
        const temp = document.createElement("div");
        temp.innerHTML = htmlString || "";
        rewriteInjectedAssets(temp, baseForRewrite);
        rewriteInjectedLinks(temp);

        const hadContent = Boolean(
          containerRef.current &&
            containerRef.current.innerHTML &&
            containerRef.current.innerHTML.trim().length
        );
        // if hadContent -> fade out old and replace to avoid blank flash
        if (hadContent) {
          // small fade out/in
          containerRef.current.style.transition = "opacity 0.18s";
          containerRef.current.style.opacity = "0";
          setTimeout(() => {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = temp.innerHTML;
            containerRef.current.style.opacity = "1";
          }, 180);
        } else {
          // no previous content -> set content once ready
          containerRef.current.innerHTML = temp.innerHTML;
        }
      } catch (err) {
        console.error("[ThemeInjector] swapContentSafely failed:", err);
      }
    };

    // main loader
    const loadTheme = async () => {
      // keep spinner only if no existing content
      const hadContent = Boolean(
        containerRef.current &&
          containerRef.current.innerHTML &&
          containerRef.current.innerHTML.trim().length
      );
      if (!hadContent) setLoading(true);

      const fetchUrl = makeFetchUrl(pageUrl);

      try {
        const res = await tryFetchWithFallbacks(fetchUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${fetchUrl}`);

        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // set title if present
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag for relative assets
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        // stylesheets: start loading and wait either for them to load or for timeout
        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));
        const sheetPromises = linkNodes.map((l) => {
          const rawHref = l.getAttribute("href");
          if (!rawHref) return Promise.resolve();
          return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl), 7000);
        });

        // append inline style nodes now (they are usually small and needed for initial paint)
        styleNodes.forEach((s) => {
          try {
            const newStyle = document.createElement("style");
            newStyle.innerHTML = s.innerHTML || "";
            newStyle.dataset.themeInjected = "true";
            document.head.appendChild(newStyle);
          } catch {}
        });

        // wait for stylesheets to settle (maximum of all promises)
        await Promise.all(sheetPromises);

        // prepare body HTML, but do not inject until CSS loaded above
        const bodyHtml = doc.body.innerHTML || "";

        // insert or swap content safely — this will avoid blank page
        swapContentSafely(bodyHtml, themeBaseUrl);

        // form submit SPA handling (remove previous then add)
        if (containerRef.current) {
          try {
            // remove any previously attached handler (best-effort)
            containerRef.current.removeEventListener(
              "submit",
              submitHandler,
              true
            );
          } catch {}
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
        }

        // execute scripts (external async, inline during idle)
        executeScripts(doc);
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
        // on failure: if we have previous content, keep it (no blank)
        const hadPrev = Boolean(
          containerRef.current &&
            containerRef.current.innerHTML &&
            containerRef.current.innerHTML.trim().length
        );
        if (!hadPrev && containerRef.current) {
          containerRef.current.innerHTML =
            '<div style="padding:40px;text-align:center;color:#666">Sorry, this page failed to load. Please try refreshing.</div>';
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    // initial load
    loadTheme();

    // handle popstate (back/forward)
    const onPop = () => {
      // derive SPA path from window location
      const cur = window.location.pathname + window.location.search;
      // if consumer provided onNavigate, call it so parent updates pageUrl prop
      if (typeof onNavigate === "function") {
        try {
          onNavigate(cur, { replace: true });
          return;
        } catch {}
      }
      // fallback: directly attempt to fetch new path (without modifying history)
      (async () => {
        setLoading(true);
        try {
          const abs = makeFetchUrl(cur);
          const res = await tryFetchWithFallbacks(abs);
          if (res && res.ok) {
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const bodyHtml = doc.body.innerHTML || "";
            swapContentSafely(bodyHtml, themeBaseUrl);
            executeScripts(doc);
          }
        } catch (e) {
          console.error("[ThemeInjector] popstate load failed", e);
        } finally {
          setLoading(false);
        }
      })();
    };

    window.addEventListener("popstate", onPop);

    return () => {
      aborted = true;
      window.removeEventListener("popstate", onPop);
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
          opacity: 1,
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
            background: "rgba(255,255,255,0.0)",
          }}
          aria-hidden
        >
          {/* tiny spinner */}
          <div
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              border: "3px solid rgba(0,0,0,0.08)",
              borderTopColor: "#444",
              animation: "ti-spin 1s linear infinite",
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: "@keyframes ti-spin{to{transform:rotate(360deg)}}",
            }}
          />
        </div>
      )}
    </div>
  );
}
