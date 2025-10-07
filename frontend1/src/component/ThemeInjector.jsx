// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    let clickHandler = null;
    let ariaObserver = null;

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
        const tag = el.tagName.toLowerCase();
        const attr =
          tag === "link" || tag === "source"
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

    // --- NEW: preload helper for LCP candidate ---
    const addPreloadForLcp = (doc) => {
      try {
        // heuristic: prefer hero image or first large image
        const hero = doc.querySelector(
          ".hero-image img, .hero img, img[data-lcp], picture img"
        );
        let candidate = hero || doc.querySelector("img");
        if (!candidate) return;
        const src =
          candidate.getAttribute("src") || candidate.getAttribute("data-src");
        if (!src) return;
        const abs = makeAbsoluteUrl(src, themeBaseUrl);

        // create preload if not already present
        if (
          !document.head.querySelector(`link[rel="preload"][href="${abs}"]`)
        ) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = abs;
          // if remote host supports CORS, set crossorigin
          // we don't assume demo domain supports it silently; it's safe to omit
          link.crossOrigin = "anonymous";
          link.dataset.themeInjected = "true";
          document.head.appendChild(link);
        }

        // mark candidate in doc so later we set attributes when injecting
        candidate.setAttribute("data-theme-lcp", "true");
      } catch (e) {
        // ignore
      }
    };

    // accessibility: ensure aria-hidden elements contain no focusable descendants
    const syncAriaHiddenFocus = (root) => {
      if (!root) return;
      const FOCUSABLE_SELECTOR =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
      // for each aria-hidden element inside root
      const nodes = root.querySelectorAll('[aria-hidden="true"]');
      nodes.forEach((n) => {
        n.querySelectorAll(FOCUSABLE_SELECTOR).forEach((el) => {
          if (!el.hasAttribute("data-prev-tabindex")) {
            const prev = el.getAttribute("tabindex");
            el.setAttribute(
              "data-prev-tabindex",
              prev === null ? "none" : prev
            );
          }
          el.setAttribute("tabindex", "-1");
        });
      });
    };

    // observe aria-hidden changes and restore/disable focusables accordingly
    const observeAriaChanges = (root) => {
      if (!root) return null;
      const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (const m of mutations) {
          if (m.type === "attributes" && m.attributeName === "aria-hidden") {
            shouldRun = true;
            break;
          } else if (m.type === "childList") {
            shouldRun = true;
            break;
          }
        }
        if (shouldRun) {
          if (window.__theme_aria_sync_timeout)
            clearTimeout(window.__theme_aria_sync_timeout);
          window.__theme_aria_sync_timeout = setTimeout(() => {
            try {
              // restore focusables for visible elements
              const FOCUSABLE_SELECTOR_ALL =
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex], [contenteditable="true"]';
              // restore for nodes that became visible
              root
                .querySelectorAll('[aria-hidden="false"], :not([aria-hidden])')
                .forEach((n) => {
                  n.querySelectorAll("[data-prev-tabindex]").forEach((el) => {
                    const prev = el.getAttribute("data-prev-tabindex");
                    if (prev === "none") el.removeAttribute("tabindex");
                    else el.setAttribute("tabindex", prev);
                    el.removeAttribute("data-prev-tabindex");
                  });
                });
              // again ensure hidden nodes have no focusables
              syncAriaHiddenFocus(root);
            } catch (e) {}
          }, 40);
        }
      });

      observer.observe(root, {
        attributes: true,
        subtree: true,
        attributeFilter: ["aria-hidden"],
        childList: true,
      });
      return observer;
    };

    // click handler: intercept internal links and route via SPA
    const attachLinkInterceptor = (root) => {
      clickHandler = (e) => {
        if (!root) return;
        const a = e.target.closest("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href) return;
        if (
          href.startsWith("http") ||
          href.startsWith("//") ||
          a.target === "_blank"
        )
          return;
        // it's internal — do SPA navigation
        e.preventDefault();
        routeViaSPA(href);
      };
      root.addEventListener("click", clickHandler, true);
    };

    const loadTheme = async () => {
      setLoading(true);
      setError(null);

      // cleanup previous injected assets
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

        // set document title if present in template
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag points to correct absolute theme base
        // IMPORTANT: set absolute URL with protocol so relative assets resolve correctly
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        // use absolute URL
        base.href = themeBaseNormalized(themeBaseUrl);

        // PRELOAD LCP candidate before injecting to speed up LCP
        addPreloadForLcp(doc);

        // load external stylesheets from the template, waiting for them to be available
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
        // inject inline styles
        styleNodes.forEach((s) => {
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        // rewrite asset urls inside the doc BEFORE injecting
        rewriteInjectedAssets(doc, themeBaseUrl);
        // mark LCP img attributes so browser loads eagerly after inject
        const lcpImg = doc.querySelector('img[data-theme-lcp="true"]');
        if (lcpImg) {
          // ensure src is absolute
          const abs = makeAbsoluteUrl(
            lcpImg.getAttribute("src") || lcpImg.getAttribute("data-src"),
            themeBaseUrl
          );
          lcpImg.setAttribute("src", abs);
          lcpImg.setAttribute("loading", "eager");
          // modern browsers support fetchpriority
          lcpImg.setAttribute("fetchpriority", "high");
          // decoding sync for LCP
          lcpImg.setAttribute("decoding", "sync");
          // ensure width/height if available as attributes (helps CLS)
          if (!lcpImg.getAttribute("width") && lcpImg.naturalWidth) {
            lcpImg.setAttribute("width", String(lcpImg.naturalWidth));
          }
          if (!lcpImg.getAttribute("height") && lcpImg.naturalHeight) {
            lcpImg.setAttribute("height", String(lcpImg.naturalHeight));
          }
        }

        if (containerRef.current) {
          // inject body html
          containerRef.current.innerHTML = doc.body.innerHTML;

          // now fix assets and links for injected DOM (images, sources etc)
          rewriteInjectedAssets(containerRef.current, themeBaseUrl);
          rewriteInjectedLinks(containerRef.current);

          // after injected, ensure LCP image in live DOM has attributes we set earlier
          const liveLcp =
            containerRef.current.querySelector('img[data-theme-lcp="true"]') ||
            containerRef.current.querySelector("img");
          if (liveLcp) {
            liveLcp.setAttribute("loading", "eager");
            liveLcp.setAttribute("fetchpriority", "high");
            liveLcp.setAttribute("decoding", "sync");
          }
        }

        // run scripts from the parsed doc serially
        await executeScriptsSerial(doc);

        // accessibility: make sure aria-hidden nodes have no focusable children
        syncAriaHiddenFocus(containerRef.current);
        ariaObserver = observeAriaChanges(containerRef.current);

        // intercept form submissions inside injected content
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

        // attach click interceptor to convert internal link clicks to SPA navigation
        attachLinkInterceptor(containerRef.current);

        // dispatch some events to mimic normal page lifecycle (optional)
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 300);
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
        if (!aborted && mountedRef.current)
          setError(err.message || String(err));
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
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
        if (containerRef.current && clickHandler)
          containerRef.current.removeEventListener("click", clickHandler, true);
        if (ariaObserver) ariaObserver.disconnect();
      } catch {}
    };
  }, [pageUrl, themeBaseUrl, onNavigate]);

  return (
    <div className="theme-wrapper" style={{ width: "100%", height: "100%" }}>
      {loading && (
        <div aria-busy="true" style={{ padding: 20 }}>
          Loading…
        </div>
      )}
      {!loading && error && (
        <div role="alert" style={{ color: "red", padding: 20 }}>
          Failed to load theme: {error}
        </div>
      )}
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
