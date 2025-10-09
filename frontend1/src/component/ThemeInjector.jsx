import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);
  const fetchControllerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (fetchControllerRef.current) {
        try {
          fetchControllerRef.current.abort();
        } catch {}
      }
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
    let timeoutHandles = [];

    const isAbsoluteOrProtocol = (u = "") =>
      new RegExp("^(?:[a-zA-Z][a-zA-Z0-9+\\-.]*:|//)").test(u);

    const isDataOrBlobOrMail = (u = "") =>
      /^(data:|blob:|mailto:|tel:|#)/.test(u);

    const isApiPath = (u = "") =>
      typeof u === "string" &&
      (u.startsWith("https://") ||
        u.startsWith("http://") ||
        u.startsWith("/api/"));

    const isRelativeForRewrite = (u = "") =>
      !!u &&
      !isAbsoluteOrProtocol(u) &&
      !isDataOrBlobOrMail(u) &&
      !isApiPath(u);

    const themeBaseNormalized = (b = themeBaseUrl) =>
      b.endsWith("/") ? b : b + "/";

    const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
      if (!url) return url;
      if (isAbsoluteOrProtocol(url)) return url;
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
      // images, sources, elements with data-src, and srcset
      container.querySelectorAll("img, source, [data-src]").forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const attr =
          tag === "img" || el.getAttribute("src") ? "src" : "data-src";
        const val = el.getAttribute(attr);
        if (!val) return;
        if (isRelativeForRewrite(val) || val.startsWith("/")) {
          const abs = makeAbsoluteUrl(val, base);
          el.setAttribute(attr, abs);
        }
        // handle srcset if present
        const srcset = el.getAttribute("srcset");
        if (srcset) {
          const transformed = srcset
            .split(",")
            .map((part) => {
              const p = part.trim().split(/\s+/);
              const url = p[0];
              const rest = p.slice(1).join(" ");
              const abs =
                isRelativeForRewrite(url) || url.startsWith("/")
                  ? makeAbsoluteUrl(url, base)
                  : url;
              return rest ? `${abs} ${rest}` : abs;
            })
            .join(", ");
          el.setAttribute("srcset", transformed);
        }
      });
    };

    const loadStylesheet = (href, timeoutMs = 7000) =>
      new Promise((resolve) => {
        try {
          const abs = makeAbsoluteUrl(href, themeBaseUrl);
          if (
            document.head.querySelector(`link[rel="stylesheet"][href="${abs}"]`)
          )
            return resolve();
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = abs;
          link.dataset.themeInjected = "true";
          const done = () => resolve();
          link.onload = done;
          link.onerror = done;
          document.head.appendChild(link);
          timeoutHandles.push(
            setTimeout(() => {
              try {
                done();
              } catch {}
            }, timeoutMs)
          );
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
          if (document.body.querySelector(`script[src="${abs}"]`)) continue;
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
          if (/document\.write/.test(content)) continue; // avoid dangerous document.write
          await new Promise((resolve) => {
            try {
              const el = document.createElement("script");
              if (type) el.type = type;
              el.text = content;
              el.dataset.themeInjected = "true";
              document.body.appendChild(el);
              resolve();
            } catch (e) {
              resolve();
            }
          });
        }
      }
    };

    const tryFetchWithFallbacks = async (origUrl) => {
      try {
        if (fetchControllerRef.current)
          try {
            fetchControllerRef.current.abort();
          } catch {}
        fetchControllerRef.current = new AbortController();
        let res = await fetch(origUrl, {
          cache: "no-cache",
          signal: fetchControllerRef.current.signal,
        }).catch(() => null);
        if (res && res.ok) return res;

        if (!origUrl.match(/\.html$/i)) {
          const alt = origUrl.replace(/\/+$/, "") + ".html";
          res = await fetch(alt, { cache: "no-cache" }).catch(() => null);
          if (res && res.ok) return res;
        }

        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetch(dynamicUrl, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) return res;

        return res;
      } catch (e) {
        return null;
      }
    };

    const removePreviouslyInjected = () => {
      try {
        // remove previously injected elements (styles/scripts) that we marked
        const sel = '[data-theme-injected="true"]';
        Array.from(document.querySelectorAll(sel)).forEach((el) => {
          // keep <link rel=stylesheet> to avoid flash if it's still the same href
          if (el.tagName.toLowerCase() === "link" && el.rel === "stylesheet")
            return;
          try {
            el.remove();
          } catch {}
        });
      } catch {}
    };

    const loadTheme = async () => {
      setLoading(true);

      try {
        const res = await tryFetchWithFallbacks(pageUrl);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current || aborted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag points to theme base (absolute)
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        // Collect styles and inline styles
        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));

        // Load external styles first and wait for them to be appended to head
        await Promise.all(
          linkNodes.map((l) => loadStylesheet(l.getAttribute("href")))
        );

        // Inject inline <style> nodes (keep old styles until we replace content)
        styleNodes.forEach((s) => {
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        // Build a temporary container with the new body content and rewrite assets/links there
        const temp = document.createElement("div");
        temp.innerHTML = doc.body.innerHTML || "";
        rewriteInjectedAssets(temp, themeBaseUrl);
        rewriteInjectedLinks(temp);

        // Only when everything above is ready, replace the visible content.
        if (mountedRef.current && !aborted && containerRef.current) {
          // optional: preserve scroll
          const prevScroll = {
            x: containerRef.current.scrollLeft,
            y: containerRef.current.scrollTop,
          };

          // replace children safely (avoids leaving event listeners on removed nodes)
          try {
            const nodes = Array.from(temp.childNodes).map((n) =>
              n.cloneNode(true)
            );
            containerRef.current.replaceChildren(...nodes);
            // restore scroll
            containerRef.current.scrollLeft = prevScroll.x;
            containerRef.current.scrollTop = prevScroll.y;
          } catch (e) {
            // fallback
            containerRef.current.innerHTML = temp.innerHTML;
          }

          // add form submit interception
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

        // Execute scripts from fetched doc serially (this appends scripts to body)
        await executeScriptsSerial(doc);

        // small lifecycle events to mimic page load
        timeoutHandles.push(
          setTimeout(() => {
            try {
              document.dispatchEvent(
                new Event("DOMContentLoaded", { bubbles: true })
              );
              window.dispatchEvent(new Event("load", { bubbles: true }));
              window.dispatchEvent(new Event("pageshow", { bubbles: true }));
            } catch {}
          }, 200)
        );

        // remove previously injected non-styles to avoid buildup
        removePreviouslyInjected();
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
        timeoutHandles.forEach((t) => clearTimeout(t));
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
      try {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
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
