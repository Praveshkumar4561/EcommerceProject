// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ThemeInjector — improved
 * - fetches theme HTML from the theme host (handles SPA paths)
 * - rewrites injected script/XHR/fetch API calls that use /api or /uploads to the theme origin
 * - waits for stylesheets (with timeout) before swapping content (avoids blank/FOUC)
 * - preserves previous DOM until new content is ready
 * - caches fetched HTML (in-memory + sessionStorage) for robustness
 */
export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  const htmlCacheRef = useRef({});
  const networkPatchRef = useRef({
    patched: false,
    origFetch: null,
    origXhrOpen: null,
  });

  useEffect(() => {
    mountedRef.current = true;
    // restore cache from sessionStorage if present
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
    String(str || "")
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
      typeof u === "string" && /^\/?api\/?/i.test(u); // path starting with api or /api

    const themeBaseNormalized = (b = themeBaseUrl) =>
      b.endsWith("/") ? b : b + "/";

    const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
      if (!url) return url;
      if (isAbsoluteOrProtocol(url)) return url;
      if (url.startsWith("/")) {
        // If it appears like an api/uploads call, map to theme origin root (not themeBase path)
        if (/^\/?(api|uploads)\//i.test(url)) {
          try {
            const origin = new URL(base).origin;
            return origin + (url.startsWith("/") ? url : "/" + url);
          } catch {
            // fallback to demo host origin
            return (
              "https://demo.webriefly.com" +
              (url.startsWith("/") ? url : "/" + url)
            );
          }
        }
        // otherwise make relative to themeBase
        return themeBaseNormalized(base) + url.replace(/^\/+/, "");
      }
      try {
        return new URL(url, themeBaseNormalized(base)).href;
      } catch {
        return themeBaseNormalized(base) + url.replace(/^\.*\//, "");
      }
    };

    // Build absolute fetch URL for theme HTML.
    // If pageUrl is '/blog-details/slug' — resolve to themeBase + 'blog-details/slug' (and fallback to .html)
    const makeFetchUrl = (p = "") => {
      if (!p) p = "/";
      if (isAbsoluteOrProtocol(p)) return p;
      const clean = p.replace(/^\/*/, "");
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
        const href = a.getAttribute("href");
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
        const tag = el.tagName.toLowerCase();
        const attr =
          tag === "img" ? "src" : el.getAttribute("src") ? "src" : "data-src";
        const val = el.getAttribute(attr);
        if (!val) return;
        if (/^\/?(api|uploads)\//i.test(val)) {
          // map leading /api or /uploads to theme origin
          el.setAttribute(attr, makeAbsoluteUrl(val, base));
        } else if (
          !isAbsoluteOrProtocol(val) &&
          (val.startsWith("/") || val.indexOf("..") === 0 || /^[^\/]/.test(val))
        ) {
          // other relative assets -> make absolute relative to theme base
          el.setAttribute(attr, makeAbsoluteUrl(val, base));
        }
      });
    };

    // load stylesheet and wait (with timeout)
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

    // execute external scripts async and inline scripts during idle
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
            el.async = true;
            if (type) el.type = type;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          }
        } else {
          const content = s.textContent || "";
          if (/document\.write/.test(content)) return;
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

    // patch network calls (fetch + XHR) so theme scripts that call `/api/...` or `/uploads/...`
    // are routed to the theme origin (e.g. https://demo.webriefly.com/api/...)
    const patchNetworkForTheme = () => {
      if (networkPatchRef.current.patched) return;
      networkPatchRef.current.patched = true;

      // derive theme origin
      let themeOrigin = null;
      try {
        themeOrigin = new URL(themeBaseUrl).origin;
      } catch {
        themeOrigin = "https://demo.webriefly.com";
      }

      // save originals
      networkPatchRef.current.origFetch = window.fetch;
      networkPatchRef.current.origXhrOpen =
        window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;

      // patch fetch
      window.fetch = async function (input, init) {
        try {
          let url = input;
          // Request object
          if (typeof input === "object" && input && input.url) {
            url = input.url;
          }
          if (typeof url === "string") {
            // if url starts with /api or api/ or /uploads or uploads/ -> rewrite to theme origin
            if (/^\/?(api|uploads)\//i.test(url)) {
              const cleaned = url.replace(/^\/*/, "");
              url = themeOrigin + "/" + cleaned;
            }
          }
          if (typeof input === "object" && input && input.url) {
            // recreate Request if necessary
            const req = input instanceof Request ? input : new Request(input);
            // use patched url
            return networkPatchRef.current.origFetch.call(
              this,
              url,
              init || {}
            );
          }
          return networkPatchRef.current.origFetch.call(this, url, init);
        } catch (e) {
          // fall back to original fetch on errors
          return networkPatchRef.current.origFetch.call(this, input, init);
        }
      };

      // patch XHR.open
      if (window.XMLHttpRequest && networkPatchRef.current.origXhrOpen) {
        window.XMLHttpRequest.prototype.open = function (
          method,
          url,
          async,
          user,
          password
        ) {
          try {
            if (typeof url === "string" && /^\/?(api|uploads)\//i.test(url)) {
              const cleaned = url.replace(/^\/*/, "");
              url = themeOrigin + "/" + cleaned;
            }
          } catch {}
          return networkPatchRef.current.origXhrOpen.call(
            this,
            method,
            url,
            async === undefined ? true : async,
            user,
            password
          );
        };
      }
    };

    const unpatchNetworkForTheme = () => {
      if (!networkPatchRef.current.patched) return;
      try {
        if (networkPatchRef.current.origFetch)
          window.fetch = networkPatchRef.current.origFetch;
        if (networkPatchRef.current.origXhrOpen && window.XMLHttpRequest) {
          window.XMLHttpRequest.prototype.open =
            networkPatchRef.current.origXhrOpen;
        }
      } catch {}
      networkPatchRef.current.patched = false;
      networkPatchRef.current.origFetch = null;
      networkPatchRef.current.origXhrOpen = null;
    };

    // fetch helper with fallback (works with absolute fetch URLs)
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

    // tryFetchWithFallbacks expects an absolute fetch URL
    const tryFetchWithFallbacks = async (absoluteUrl) => {
      // cached ?
      if (htmlCacheRef.current[absoluteUrl]) {
        return new Response(htmlCacheRef.current[absoluteUrl], { status: 200 });
      }

      // attempt direct
      let res = await fetchWithTimeout(absoluteUrl, 10000);
      if (res && res.ok) {
        const html = await res.text();
        htmlCacheRef.current[absoluteUrl] = html;
        return new Response(html);
      }

      // attempt .html
      if (!absoluteUrl.match(/\.html$/i)) {
        const alt = absoluteUrl.replace(/\/+$/, "") + ".html";
        res = await fetchWithTimeout(alt, 8000);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[absoluteUrl] = html;
          return new Response(html);
        }
      }

      // attempt dynamic.html at theme base
      try {
        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetchWithTimeout(dynamicUrl, 8000);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[absoluteUrl] = html;
          return new Response(html);
        }
      } catch {}

      return res;
    };

    // insert or swap content (keeps current DOM until new content is ready)
    const swapContentSafely = (htmlString, baseForRewrite) => {
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
        if (hadContent) {
          containerRef.current.style.transition = "opacity 0.18s";
          containerRef.current.style.opacity = "0";
          setTimeout(() => {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = temp.innerHTML;
            containerRef.current.style.opacity = "1";
          }, 180);
        } else {
          containerRef.current.innerHTML = temp.innerHTML;
        }
      } catch (err) {
        console.error("[ThemeInjector] swapContentSafely failed:", err);
      }
    };

    // MAIN load flow
    const loadTheme = async () => {
      setLoading(true);

      // build absolute fetch URL for the requested page
      const fetchUrl = makeFetchUrl(pageUrl);

      // patch network so scripts inside theme can call /api and /uploads successfully
      patchNetworkForTheme();

      try {
        const res = await tryFetchWithFallbacks(fetchUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${fetchUrl}`);

        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // apply <title> if present
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag points at theme base (helps resolving relative URLs)
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        // load theme CSS links (wait for them to load or timeout)
        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));
        const sheetPromises = linkNodes.map((l) => {
          const rawHref = l.getAttribute("href");
          if (!rawHref) return Promise.resolve();
          return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl), 7000);
        });

        // append inline <style> nodes immediately
        styleNodes.forEach((s) => {
          try {
            const newStyle = document.createElement("style");
            newStyle.innerHTML = s.innerHTML || "";
            newStyle.dataset.themeInjected = "true";
            document.head.appendChild(newStyle);
          } catch {}
        });

        // wait for all stylesheet starts/loads (bounded by timeout)
        await Promise.all(sheetPromises);

        // finally prepare and swap body HTML
        const bodyHtml = doc.body.innerHTML || "";
        swapContentSafely(bodyHtml, themeBaseUrl);

        // form capture inside injected content — remove old handler then attach
        if (containerRef.current) {
          try {
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
        // don't wipe previous content — only show friendly message if nothing existed before
        const hadPrev = Boolean(
          containerRef.current &&
            containerRef.current.innerHTML &&
            containerRef.current.innerHTML.trim().length
        );
        if (!hadPrev && containerRef.current) {
          containerRef.current.innerHTML =
            '<div style="padding:40px;text-align:center;color:#666">Sorry, page failed to load. Try refreshing.</div>';
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    // start loading
    loadTheme();

    // handle popstate (back/forward)
    const onPop = () => {
      const cur = window.location.pathname + window.location.search;
      if (typeof onNavigate === "function") {
        try {
          onNavigate(cur, { replace: true });
          return;
        } catch {}
      }
      // fallback: attempt direct load
      (async () => {
        setLoading(true);
        try {
          const abs = makeFetchUrl(cur);
          const r = await tryFetchWithFallbacks(abs);
          if (r && r.ok) {
            const html = await r.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            swapContentSafely(doc.body.innerHTML || "", themeBaseUrl);
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
      // unpatch network and cleanup handlers
      try {
        if (containerRef.current && submitHandler)
          containerRef.current.removeEventListener(
            "submit",
            submitHandler,
            true
          );
      } catch {}
      try {
        // restore fetch / XHR if patched
        if (networkPatchRef.current.patched) {
          if (networkPatchRef.current.origFetch)
            window.fetch = networkPatchRef.current.origFetch;
          if (networkPatchRef.current.origXhrOpen && window.XMLHttpRequest) {
            window.XMLHttpRequest.prototype.open =
              networkPatchRef.current.origXhrOpen;
          }
          networkPatchRef.current.patched = false;
          networkPatchRef.current.origFetch = null;
          networkPatchRef.current.origXhrOpen = null;
        }
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
            background: "transparent",
          }}
          aria-hidden
        >
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
              __html: "@keyframes ti-spin{to{transform:rotate(360deg)}} ",
            }}
          />
        </div>
      )}
    </div>
  );
}
