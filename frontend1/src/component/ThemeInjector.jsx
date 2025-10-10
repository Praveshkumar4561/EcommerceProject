// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const fetchControllerRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // abort any outstanding fetch on unmount
      try {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;

    let aborted = false;
    let submitHandler = null;
    let clickHandler = null;

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
      // if absolute root path, attach to theme base (keeps leading slash semantics)
      if (url.startsWith("/"))
        return themeBaseNormalized(base).replace(/\/+$/g, "") + url;
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
        // skip absolute, anchors, mailto, tel
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
      // handle img, source, picture, and elements with data-src / srcset
      container
        .querySelectorAll("img, source, [data-src], [data-srcset]")
        .forEach((el) => {
          const tag = el.tagName.toLowerCase();
          // src or data-src
          if (el.getAttribute("src")) {
            const val = el.getAttribute("src");
            if (!val) return;
            if (isRelativeForRewrite(val) || val.startsWith("/"))
              el.setAttribute("src", makeAbsoluteUrl(val, base));
          }
          if (el.getAttribute("data-src")) {
            const val = el.getAttribute("data-src");
            if (!val) return;
            if (isRelativeForRewrite(val) || val.startsWith("/"))
              el.setAttribute("data-src", makeAbsoluteUrl(val, base));
          }
          if (el.getAttribute("srcset")) {
            const srcset = el.getAttribute("srcset");
            if (srcset) {
              const parts = srcset.split(",").map((p) => p.trim());
              const fixed = parts
                .map((p) => {
                  const [u, descriptor] = p.split(/\s+/);
                  if (!u) return p;
                  if (isRelativeForRewrite(u) || u.startsWith("/"))
                    return `${makeAbsoluteUrl(u, base)}${
                      descriptor ? ` ${descriptor}` : ""
                    }`;
                  return p;
                })
                .join(", ");
              el.setAttribute("srcset", fixed);
            }
          }
          if (el.getAttribute("data-srcset")) {
            const srcset = el.getAttribute("data-srcset");
            if (srcset) {
              const parts = srcset.split(",").map((p) => p.trim());
              const fixed = parts
                .map((p) => {
                  const [u, descriptor] = p.split(/\s+/);
                  if (!u) return p;
                  if (isRelativeForRewrite(u) || u.startsWith("/"))
                    return `${makeAbsoluteUrl(u, base)}${
                      descriptor ? ` ${descriptor}` : ""
                    }`;
                  return p;
                })
                .join(", ");
              el.setAttribute("data-srcset", fixed);
            }
          }
        });
    };

    const loadStylesheet = (href, timeoutMs = 7000) =>
      new Promise((resolve) => {
        try {
          // avoid injecting same stylesheet multiple times (compare by href)
          const existing = Array.from(
            document.head.querySelectorAll('link[rel="stylesheet"]')
          ).find(
            (l) =>
              l.href === href || l.getAttribute("data-original-href") === href
          );
          if (existing) return resolve();

          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.dataset.themeInjected = "true";
          link.setAttribute("data-original-href", href);
          const done = () => resolve();
          link.onload = done;
          link.onerror = done;
          document.head.appendChild(link);
          setTimeout(done, timeoutMs);
        } catch {
          resolve();
        }
      });

    const executeScriptsSerial = async (containerEl) => {
      // find scripts inside the parsed container and execute them serially
      const scripts = Array.from(containerEl.querySelectorAll("script"));
      for (const s of scripts) {
        if (aborted || !mountedRef.current) break;
        const src = s.getAttribute("src");
        const type = s.getAttribute("type") || "";

        if (src) {
          const abs = makeAbsoluteUrl(src, themeBaseUrl);
          // avoid duplicate by checking by data-theme-injected or exact src
          if (
            document.body.querySelector(
              `script[data-theme-injected][src="${abs}"]`
            ) ||
            document.body.querySelector(`script[src="${abs}"]`)
          )
            continue;
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
            // inline scripts: append to body so they execute in top-level context
            const el = document.createElement("script");
            if (type) el.type = type;
            el.text = content;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          } catch (e) {
            console.warn("[ThemeInjector] inline script failed:", e);
          }
        }
      }
    };

    const tryFetchWithFallbacks = async (origUrl, signal) => {
      // try original, original + .html, dynamic.html fallback
      let res = null;
      try {
        res = await fetch(origUrl, { cache: "no-cache", signal }).catch(
          () => null
        );
        if (res && res.ok) return res;
      } catch (e) {
        if (e.name === "AbortError") return null;
      }

      try {
        if (!origUrl.match(/\.html$/i)) {
          const alt = origUrl.replace(/\/+$/, "") + ".html";
          res = await fetch(alt, { cache: "no-cache", signal }).catch(
            () => null
          );
          if (res && res.ok) return res;
        }
      } catch (e) {
        if (e.name === "AbortError") return null;
      }

      try {
        const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        res = await fetch(dynamicUrl, { cache: "no-cache", signal }).catch(
          () => null
        );
        if (res && res.ok) return res;
      } catch (e) {
        if (e.name === "AbortError") return null;
      }

      return res;
    };

    const loadTheme = async (attempt = 0) => {
      setLoading(true);

      // abort previous fetch if any
      try {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
      } catch (e) {}
      const controller = new AbortController();
      fetchControllerRef.current = controller;

      try {
        const res = await tryFetchWithFallbacks(pageUrl, controller.signal);
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // ensure base tag (absolute URLs used by the theme)
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
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        const temp = document.createElement("div");
        temp.innerHTML = doc.body.innerHTML || "";
        rewriteInjectedAssets(temp, themeBaseUrl);
        rewriteInjectedLinks(temp);

        if (mountedRef.current && !aborted && containerRef.current) {
          // remove any previous event listeners we added to the container
          try {
            if (submitHandler && containerRef.current)
              containerRef.current.removeEventListener(
                "submit",
                submitHandler,
                true
              );
          } catch (e) {}

          // set new content
          containerRef.current.innerHTML = temp.innerHTML;

          // intercept form submits inside the injected container and route via SPA
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

          // global click handler on container to intercept internal links so SPA navigation works reliably
          clickHandler = (e) => {
            if (!containerRef.current) return;
            let el = e.target;
            while (el && el !== containerRef.current && el.tagName !== "A")
              el = el.parentElement;
            if (!el || el.tagName !== "A") return;
            const href = el.getAttribute("href");
            if (!href) return;
            // ignore anchors and external
            if (
              href.startsWith("#") ||
              isAbsoluteOrProtocol(href) ||
              href.startsWith("mailto:") ||
              href.startsWith("tel:")
            )
              return;
            e.preventDefault();
            routeViaSPA(href);
          };

          containerRef.current.addEventListener("click", clickHandler, true);
        }

        // execute scripts from the parsed fragment serially
        await executeScriptsSerial(doc);

        // dispatch a few useful events so scripts relying on them run
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 200);

        // if the injected container is unexpectedly empty, attempt a single automatic retry
        if (
          containerRef.current &&
          containerRef.current.innerHTML.trim() === "" &&
          attempt < 1
        ) {
          console.warn(
            "[ThemeInjector] injected container empty — retrying once..."
          );
          // small delay to give browser a breath
          setTimeout(() => {
            if (mountedRef.current && !aborted) loadTheme(attempt + 1);
          }, 250);
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          // fetch aborted — ignore
        } else {
          console.error("[ThemeInjector] loadTheme failed:", err);
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    // react to browser history changes (back/forward and also programmatic popstate)
    const onPopState = () => {
      // when popstate occurs, parent might not update pageUrl prop — attempt to re-load matching page
      // compute a candidate page path from location
      const currentPath = window.location.pathname + window.location.search;
      // if parent's pageUrl is already equal-ish, skip; otherwise trigger loadTheme
      if (!pageUrl || !currentPath) return;
      // If pageUrl already endsWith currentPath, skip
      try {
        const u = new URL(pageUrl, window.location.origin);
        const pagePath = u.pathname + u.search;
        if (pagePath !== currentPath) {
          // attempt to load using the absolute path (resolving it against themeBaseUrl)
          // prefer to call loadTheme which uses pageUrl; we temporarily set pageUrl-like fetch target
          // but since pageUrl is a prop we don't mutate it — instead call loadTheme with currentPath resolved
          // build absolute target
          const target = makeAbsoluteUrl(
            currentPath.replace(/^\//, ""),
            themeBaseUrl
          );
          // directly fetch that target in a one-off call by calling loadTheme indirectly via setting a short-lived page fetch
          (async () => {
            try {
              fetchControllerRef.current = new AbortController();
              const res = await tryFetchWithFallbacks(
                target,
                fetchControllerRef.current.signal
              );
              if (res && res.ok) {
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const temp = document.createElement("div");
                temp.innerHTML = doc.body.innerHTML || "";
                rewriteInjectedAssets(temp, themeBaseUrl);
                rewriteInjectedLinks(temp);
                if (mountedRef.current && containerRef.current)
                  containerRef.current.innerHTML = temp.innerHTML;
                await executeScriptsSerial(doc);
              }
            } catch (e) {}
          })();
        }
      } catch (e) {}
    };

    window.addEventListener("popstate", onPopState);

    // initial load
    loadTheme();

    // cleanup
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
        if (containerRef.current && clickHandler)
          containerRef.current.removeEventListener("click", clickHandler, true);
      } catch {}
      try {
        window.removeEventListener("popstate", onPopState);
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
