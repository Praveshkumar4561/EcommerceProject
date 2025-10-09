// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  const htmlCacheRef = useRef({});
  const lastContentRef = useRef("");

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

    const makeFetchUrl = (p = "") => {
      if (!p) p = "/";
      if (isAbsoluteOrProtocol(p)) return p;
      const clean = p.replace(/^\/*/, "");
      if (clean === "" || clean === "/")
        return themeBaseNormalized(themeBaseUrl) + "index.html";
      return themeBaseNormalized(themeBaseUrl) + clean;
    };

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
          if (tag === "img" && !el.hasAttribute("loading")) {
            el.setAttribute("loading", "lazy");
          }
        }
      });
    };

    const loadStylesheet = (href, timeoutMs = 8000) =>
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
          try {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.text = content;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          } catch {}
        }
      });
    };

    const tryFetchWithFallbacks = async (absoluteUrl) => {
      if (htmlCacheRef.current[absoluteUrl]) {
        return new Response(htmlCacheRef.current[absoluteUrl], { status: 200 });
      }

      let res = await fetch(absoluteUrl, { cache: "no-cache" }).catch(
        () => null
      );
      if (res && res.ok) {
        const html = await res.text();
        htmlCacheRef.current[absoluteUrl] = html;
        return new Response(html);
      }

      if (!absoluteUrl.match(/\.html$/i)) {
        const alt = absoluteUrl.replace(/\/+$/, "") + ".html";
        res = await fetch(alt, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[absoluteUrl] = html;
          return new Response(html);
        }
      }

      try {
        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetch(dynamicUrl, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) {
          const html = await res.text();
          htmlCacheRef.current[absoluteUrl] = html;
          return new Response(html);
        }
      } catch {}

      return res;
    };

    const insertContentSafely = (htmlString, baseForRewrite) => {
      if (!containerRef.current) return;
      try {
        const temp = document.createElement("div");
        temp.innerHTML = htmlString || "";
        rewriteInjectedAssets(temp, baseForRewrite);
        rewriteInjectedLinks(temp);

        const oldOverflow = containerRef.current.style.overflow;
        containerRef.current.style.overflow = "hidden";
        containerRef.current.innerHTML = temp.innerHTML;
        lastContentRef.current = temp.innerHTML;
        containerRef.current.style.transition = "opacity 0.25s";
        containerRef.current.style.opacity = "1";
        containerRef.current.style.overflow = oldOverflow;
      } catch (err) {
        console.error("[ThemeInjector] insertContentSafely failed:", err);
      }
    };

    const loadTheme = async () => {
      setLoading(true);

      const fetchUrl = makeFetchUrl(pageUrl);

      try {
        const res = await tryFetchWithFallbacks(fetchUrl);
        if (!res || !res.ok) {
          throw new Error(`Failed to fetch ${fetchUrl}`);
        }

        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

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
          linkNodes.map((l) => {
            const rawHref = l.getAttribute("href");
            if (!rawHref) return Promise.resolve();
            return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl));
          })
        );

        styleNodes.forEach((s) => {
          try {
            const newStyle = document.createElement("style");
            newStyle.innerHTML = s.innerHTML || "";
            newStyle.dataset.themeInjected = "true";
            document.head.appendChild(newStyle);
          } catch {}
        });

        const bodyHtml = doc.body.innerHTML || "";
        insertContentSafely(bodyHtml, themeBaseUrl);

        if (mountedRef.current && !aborted && containerRef.current) {
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
          try {
            containerRef.current.removeEventListener(
              "submit",
              submitHandler,
              true
            );
          } catch {}
          containerRef.current.addEventListener("submit", submitHandler, true);
        }

        executeScripts(doc);

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
        console.error("[ThemeInjector] loadTheme failed:", err);
        if (!lastContentRef.current && containerRef.current) {
          containerRef.current.innerHTML =
            '<div style="padding:40px;text-align:center;color:#666">Sorry, the page failed to load. Try refreshing or come back later.</div>';
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    loadTheme();

    const onPop = () => {
      const cur = window.location.pathname + window.location.search;
      if (cur !== pageUrl) {
        if (typeof onNavigate === "function") {
          try {
            onNavigate(cur, { replace: true });
          } catch {}
        } else {
          (async () => {
            setLoading(true);
            try {
              const abs = makeFetchUrl(cur);
              const res = await tryFetchWithFallbacks(abs);
              if (res && res.ok) {
                const html = await res.text();
                if (!mountedRef.current || aborted) return;
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const newTitle = doc
                  .querySelector("title")
                  ?.textContent?.trim();
                if (newTitle) document.title = newTitle;
                const bodyHtml = doc.body.innerHTML || "";
                insertContentSafely(bodyHtml, themeBaseUrl);
                executeScripts(doc);
              }
            } catch (e) {
              console.error("[ThemeInjector] popstate load failed", e);
            } finally {
              if (!aborted && mountedRef.current) setLoading(false);
            }
          })();
        }
      }
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
          }}
          aria-hidden
        ></div>
      )}
    </div>
  );
}
