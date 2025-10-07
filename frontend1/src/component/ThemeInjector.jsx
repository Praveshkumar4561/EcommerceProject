// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Improved ThemeInjector
 * - Keeps previous content visible while new theme HTML loads and scripts execute.
 * - Attempts parallel fetch of scripts and evaluates them serially (fast).
 * - Falls back to adding <script src=> if fetch fails (CORS or other).
 * - Marks injected <img>/<source> with loading="lazy" and decoding="async".
 * - Adds safe fallback to unhide root if theme preloader hides it.
 */

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
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

  // helpers from your original file (unchanged logic)
  const isAbsoluteOrProtocol = (u = "") =>
    /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);
  const isDataOrBlobOrMail = (u = "") =>
    /^(data:|blob:|mailto:|tel:|#)/.test(u);
  const isApiPath = (u = "") =>
    typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");
  const isRelativeForRewrite = (u = "") =>
    !!u && !isAbsoluteOrProtocol(u) && !isDataOrBlobOrMail(u) && !isApiPath(u);

  const themeBaseNormalized = (b = themeBaseUrl) =>
    b && b.endsWith("/") ? b : (b || "") + "/";

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
      href = normalizeSpaPath(href);
      a.setAttribute("href", href);
    });
  };

  const rewriteInjectedAssets = (container, base) => {
    if (!container) return;
    container.querySelectorAll("img, source, [data-src]").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      let attr = "src";
      if (tag === "source") attr = "src";
      else if (el.getAttribute("src")) attr = "src";
      else attr = "data-src";
      const val = el.getAttribute(attr);
      if (!val) return;
      if (isRelativeForRewrite(val) || val.startsWith("/")) {
        const abs = makeAbsoluteUrl(val, base);
        el.setAttribute(attr, abs);
      }
      // performance: ensure lazy loading for non-critical images
      if (tag === "img") {
        if (!el.hasAttribute("loading")) el.setAttribute("loading", "lazy");
        if (!el.hasAttribute("decoding")) el.setAttribute("decoding", "async");
      }
    });
  };

  // stylesheet loader (kept similar)
  const loadStylesheet = (href, timeoutMs = 5000) =>
    new Promise((resolve) => {
      try {
        if (
          document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)
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

  // smarter script loader:
  // 1) Try fetch(src) in parallel for all scripts; then evaluate in order by injecting text scripts.
  // 2) If fetch fails (CORS or network), fallback to appending <script src=> and wait onload.
  const fetchScriptText = async (src) => {
    try {
      const res = await fetch(src, { cache: "no-cache" });
      if (!res.ok) throw new Error("fetch failed");
      return await res.text();
    } catch (e) {
      return null;
    }
  };

  const executeScriptsSmart = async (doc) => {
    const scripts = Array.from(doc.querySelectorAll("script"));
    if (!scripts.length) return;

    // prepare array of {src, content, origNode}
    const entries = scripts.map((s) => {
      const src = s.getAttribute("src");
      const type = s.getAttribute("type") || "";
      const content = s.textContent || "";
      return { src, content, type, orig: s };
    });

    // first try to fetch all external script texts in parallel
    const fetchPromises = entries.map((e) => {
      if (e.src) {
        const abs = makeAbsoluteUrl(e.src, themeBaseUrl);
        return fetchScriptText(abs).then((txt) => ({
          ...e,
          abs,
          fetchedText: txt,
        }));
      } else {
        return Promise.resolve({ ...e, abs: null, fetchedText: e.content });
      }
    });

    const fetched = await Promise.all(fetchPromises);

    // evaluate serially preserving order
    for (const e of fetched) {
      if (!mountedRef.current) break;
      try {
        if (e.abs && e.fetchedText) {
          // evaluate fetched text by injecting script text node (keeps order)
          const el = document.createElement("script");
          if (e.type) el.type = e.type;
          el.dataset.themeInjected = "true";
          try {
            el.appendChild(document.createTextNode(e.fetchedText));
            document.body.appendChild(el);
          } catch {
            // some browsers limit large text nodes; fallback
            el.text = e.fetchedText;
            document.body.appendChild(el);
          }
          // small microtask wait to let script run
          await new Promise((r) => setTimeout(r, 5));
        } else if (e.abs && !e.fetchedText) {
          // fetch failed (likely CORS) -> fallback to <script src=...>
          await new Promise((resolve) => {
            const el = document.createElement("script");
            if (e.type) el.type = e.type;
            el.src = e.abs;
            el.async = false; // preserve order
            el.dataset.themeInjected = "true";
            el.onload = resolve;
            el.onerror = resolve;
            // add a safety timeout so we don't wait forever
            const to = setTimeout(resolve, 5000);
            el.onload = el.onerror = () => {
              clearTimeout(to);
              resolve();
            };
            document.body.appendChild(el);
          });
        } else {
          // inline script content
          if (e.fetchedText) {
            const el = document.createElement("script");
            if (e.type) el.type = e.type;
            el.dataset.themeInjected = "true";
            try {
              el.appendChild(document.createTextNode(e.fetchedText));
              document.body.appendChild(el);
            } catch {
              el.text = e.fetchedText;
              document.body.appendChild(el);
            }
            await new Promise((r) => setTimeout(r, 5));
          }
        }
      } catch (err) {
        console.warn("script eval error", err);
        // continue to next script
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

  // safe function to remove theme-injected nodes
  const removeInjected = () => {
    document.head
      .querySelectorAll('link[data-theme-injected="true"]')
      .forEach((el) => el.remove());
    document.head
      .querySelectorAll('style[data-theme-injected="true"]')
      .forEach((el) => el.remove());
    document.body
      .querySelectorAll('script[data-theme-injected="true"]')
      .forEach((el) => el.remove());
  };

  // small helper: unhide possible preloader classes on <html> or body or root
  const safeUnhide = () => {
    try {
      document.documentElement.classList.remove(
        "preload",
        "page-loading",
        "site-loading"
      );
      document.body.classList.remove("preload", "page-loading", "site-loading");
      const root = document.getElementById("root");
      if (root) {
        root.style.visibility = "visible";
        root.style.opacity = "1";
        root.style.display = "block";
      }
    } catch {}
  };

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;
    let aborted = false;
    let submitHandler = null;

    // loadTheme: now does work in a detached off-DOM container and swaps when ready
    const loadTheme = async () => {
      if (!mountedRef.current) return;
      setLoading(true);

      try {
        // remove previous injected assets to avoid duplicates
        removeInjected();

        // fetch HTML (with fallbacks)
        const res = await tryFetchWithFallbacks(pageUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        // parse into a detached doc
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // title
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base (as before) but simpler: only add if missing
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        // load all stylesheets in parallel (like before)
        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));
        await Promise.all(
          linkNodes.map((l) => {
            const rawHref = l.getAttribute("href");
            if (!rawHref) return Promise.resolve();
            return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl));
          })
        );
        // inject inline styles (if any)
        styleNodes.forEach((s) => {
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        // prepare content in a DocumentFragment so we don't touch visible DOM yet
        const frag = document.createDocumentFragment();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = doc.body.innerHTML || "";
        // rewrite assets & links in tempDiv before it hits DOM
        rewriteInjectedAssets(tempDiv, themeBaseUrl);
        rewriteInjectedLinks(tempDiv);

        // execute scripts smartly (this appends scripts into real document.body)
        await executeScriptsSmart(doc);

        // after scripts executed (or fallback), swap in new content atomically
        if (!mountedRef.current || aborted) return;
        if (containerRef.current) {
          // optional: keep scroll at top for new page
          containerRef.current.scrollTop = 0;
          containerRef.current.innerHTML = ""; // remove old content
          // move children from tempDiv to containerRef
          while (tempDiv.firstChild) {
            containerRef.current.appendChild(tempDiv.firstChild);
          }
        }

        // small re-init touch: set lazy & decoding again for safety
        rewriteInjectedAssets(containerRef.current, themeBaseUrl);
        rewriteInjectedLinks(containerRef.current);

        // dispatch a couple of events but don't rely on them
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 200);

        // attach submit handler for forms inside injected content (like before)
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
        containerRef.current &&
          containerRef.current.addEventListener("submit", submitHandler, true);
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
        // if fail, try to at least unhide root so user sees whatever is there
        safeUnhide();
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          // ensure we unhide after a short delay if theme left page hidden
          setTimeout(safeUnhide, 800);
        }
      }
    };

    // call loader
    loadTheme();

    // safety: if scripts hang or are very slow, force unhide after 3s
    const safetyUnhide = setTimeout(() => {
      safeUnhide();
    }, 3000);

    return () => {
      aborted = true;
      clearTimeout(safetyUnhide);
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

  // UX: show previous content by not hiding container while loading.
  // But optionally show a small overlay spinner if you want. We'll keep it simple.
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
          // don't set display:none while loading — keep visible to avoid blank screen
          display: "block",
        }}
      />
      {/* small optional loader overlay; uncomment if you prefer an overlay */}
      {loading ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // subtle translucent overlay
            background: "transparent",
          }}
        />
      ) : null}
    </div>
  );
}
