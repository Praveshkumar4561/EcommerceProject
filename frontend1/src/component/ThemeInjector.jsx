// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const fetchControllerRef = useRef(null);
  const fetchIdRef = useRef(0);
  const handlersRef = useRef({ submitHandler: null, clickHandler: null });
  const lastLoadedUrlRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const MAX_RETRIES = 2;
  const RETRY_BASE_MS = 250;

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
      try {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;

    let aborted = false;
    const thisFetchId = ++fetchIdRef.current;

    const isAbsoluteOrProtocol = (u = "") =>
      /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);

    const isDataOrBlobOrMail = (u = "") =>
      /^(data:|blob:|mailto:|tel:|#)/.test(u);

    const themeBaseNormalized = (b = themeBaseUrl) =>
      b.endsWith("/") ? b : b + "/";

    const isApiPath = (u = "") =>
      typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");

    const isRelativeForRewrite = (u = "") =>
      !!u &&
      !isAbsoluteOrProtocol(u) &&
      !isDataOrBlobOrMail(u) &&
      !isApiPath(u);

    const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
      if (!url) return url;
      // If already absolute or protocol-relative, return as-is
      if (isApiPath(url) || isAbsoluteOrProtocol(url)) return url;
      // Use URL constructor to resolve both root-relative and relative paths
      try {
        const baseUrl = themeBaseNormalized(base);
        return new URL(url, baseUrl).href;
      } catch {
        // fallback: naive concatenation
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
      container
        .querySelectorAll("img, source, [data-src], [data-srcset]")
        .forEach((el) => {
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
          // dedupe by absolute href (compare link.href and data-original-href)
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

    const executeScriptsSerial = async (scriptNodes, baseForResolve) => {
      // scriptNodes is a NodeList or array of <script> elements (from parsed doc or temp)
      for (const s of Array.from(scriptNodes || [])) {
        if (aborted || !mountedRef.current) break;

        const src = s.getAttribute("src");
        const type = s.getAttribute("type") || "";

        if (src) {
          const abs = makeAbsoluteUrl(src, baseForResolve);
          // dedupe by checking if that src already exists in body
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
          // inline script: execute by appending to body (safer global context)
          const content = s.textContent || "";
          if (/document\.write/.test(content)) continue;
          try {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.text = content;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          } catch (e) {
            // swallow inline script errors to avoid breaking overall flow
            console.warn("[ThemeInjector] inline script failed:", e);
          }
        }
      }
    };

    const tryFetchWithFallbacks = async (origUrl, signal) => {
      // Try orig -> orig + .html -> dynamic.html (under themeBase)
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
      // stop if identical to last loaded URL and container has content
      if (
        lastLoadedUrlRef.current === pageUrl &&
        containerRef.current &&
        containerRef.current.innerHTML.trim() !== ""
      ) {
        setLoading(false);
        return;
      }

      try {
        if (fetchControllerRef.current) {
          try {
            fetchControllerRef.current.abort();
          } catch {}
        }
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        const res = await tryFetchWithFallbacks(pageUrl, controller.signal);
        // stale-check: ensure this response corresponds to the most recent fetch call
        if (thisFetchId !== fetchIdRef.current) return;
        if (!res || !res.ok) throw new Error(`Failed to fetch ${pageUrl}`);
        const html = await res.text();
        if (!mountedRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // title
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // base tag (ensure absolute resolving of theme assets). Use exact themeBaseNormalized.
        let baseTag = document.head.querySelector(
          'base[data-theme-base="true"]'
        );
        const canonicalBase = themeBaseNormalized(themeBaseUrl);
        if (!baseTag) {
          baseTag = document.createElement("base");
          baseTag.setAttribute("data-theme-base", "true");
          document.head.appendChild(baseTag);
        }
        try {
          baseTag.href = canonicalBase;
        } catch {
          baseTag.setAttribute("href", canonicalBase);
        }

        // styles: link rel=stylesheet
        const linkNodes = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        const styleNodes = Array.from(doc.querySelectorAll("style"));

        await Promise.all(
          linkNodes.map((l) => {
            const rawHref = l.getAttribute("href");
            if (!rawHref) return Promise.resolve();
            const abs = makeAbsoluteUrl(rawHref, themeBaseUrl);
            return loadStylesheet(abs);
          })
        );

        // inject inline styles
        styleNodes.forEach((s) => {
          // dedupe inline styles by hashing content? Keep simple: mark as injected
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        // prepare content to inject
        const temp = document.createElement("div");
        temp.innerHTML = doc.body.innerHTML || "";

        // rewrite assets and links in the temp fragment
        rewriteInjectedAssets(temp, themeBaseUrl);
        rewriteInjectedLinks(temp);

        // set container content
        if (mountedRef.current && !aborted && containerRef.current) {
          // remove old handlers (safe noop if null)
          try {
            if (handlersRef.current.submitHandler && containerRef.current)
              containerRef.current.removeEventListener(
                "submit",
                handlersRef.current.submitHandler,
                true
              );
          } catch {}
          try {
            if (handlersRef.current.clickHandler && containerRef.current)
              containerRef.current.removeEventListener(
                "click",
                handlersRef.current.clickHandler,
                true
              );
          } catch {}

          // Insert the HTML
          containerRef.current.innerHTML = temp.innerHTML;

          // Move scripts out of the container into an array to execute them serially
          const scriptsInInjected = Array.from(
            containerRef.current.querySelectorAll("script")
          );
          // Remove script tags from injected HTML to avoid double-execution or re-parsing
          scriptsInInjected.forEach(
            (s) => s.parentElement && s.parentElement.removeChild(s)
          );

          // intercept forms in injected container
          handlersRef.current.submitHandler = (e) => {
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
          containerRef.current.addEventListener(
            "submit",
            handlersRef.current.submitHandler,
            true
          );

          // intercept internal link clicks
          handlersRef.current.clickHandler = (e) => {
            if (!containerRef.current) return;
            let el = e.target;
            while (el && el !== containerRef.current && el.tagName !== "A")
              el = el.parentElement;
            if (!el || el.tagName !== "A") return;
            const href = el.getAttribute("href");
            if (!href) return;
            if (
              href.startsWith("#") ||
              isAbsoluteOrProtocol(href) ||
              href.startsWith("mailto:") ||
              href.startsWith("tel:")
            )
              return;
            // prevent default full navigation — route via SPA
            e.preventDefault();
            routeViaSPA(href);
          };
          containerRef.current.addEventListener(
            "click",
            handlersRef.current.clickHandler,
            true
          );

          // remember last loaded URL
          lastLoadedUrlRef.current = pageUrl;

          // execute scripts serially (prefer scripts from the parsed doc if none found in container)
          const scriptsToRun = scriptsInInjected.length
            ? scriptsInInjected
            : Array.from(doc.querySelectorAll("script"));
          // execute scripts from parsed doc / injected fragment, resolving relative src via themeBaseUrl
          await executeScriptsSerial(scriptsToRun, themeBaseUrl);
        }

        // dispatch safe events for theme scripts that rely on them
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 200);

        // If after injection the container is empty, retry once or up to MAX_RETRIES with delay.
        if (
          containerRef.current &&
          containerRef.current.innerHTML.trim() === "" &&
          attempt < MAX_RETRIES
        ) {
          console.warn(
            `[ThemeInjector] injected container empty — retrying attempt ${
              attempt + 1
            }...`
          );
          await new Promise((res) =>
            setTimeout(res, RETRY_BASE_MS * Math.pow(2, attempt))
          );
          if (!aborted && mountedRef.current) {
            await loadTheme(attempt + 1);
          }
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          // aborted intentionally — ignore
        } else {
          console.error("[ThemeInjector] loadTheme failed:", err);
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    // on popstate: attempt to load the current location if it differs from pageUrl
    const onPopState = () => {
      const currentPath = window.location.pathname + window.location.search;
      try {
        const u = new URL(pageUrl, window.location.origin);
        const pagePath = u.pathname + u.search;
        if (pagePath !== currentPath) {
          // build absolute target resolved against themeBaseUrl
          const target = makeAbsoluteUrl(
            currentPath.replace(/^\//, ""),
            themeBaseUrl
          );
          // increment fetch id for this direct attempt
          fetchIdRef.current++;
          fetchControllerRef.current = new AbortController();
          (async () => {
            try {
              const res = await tryFetchWithFallbacks(
                target,
                fetchControllerRef.current.signal
              );
              if (res && res.ok) {
                const html = await res.text();
                if (!mountedRef.current) return;
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const temp = document.createElement("div");
                temp.innerHTML = doc.body.innerHTML || "";
                rewriteInjectedAssets(temp, themeBaseUrl);
                rewriteInjectedLinks(temp);
                if (mountedRef.current && containerRef.current) {
                  // replace content and execute scripts
                  containerRef.current.innerHTML = temp.innerHTML;
                  const scripts = Array.from(doc.querySelectorAll("script"));
                  // remove scripts from container (they won't execute by themselves)
                  const inContainerScripts = Array.from(
                    containerRef.current.querySelectorAll("script")
                  );
                  inContainerScripts.forEach(
                    (s) => s.parentElement && s.parentElement.removeChild(s)
                  );
                  await executeScriptsSerial(scripts, themeBaseUrl);
                }
              }
            } catch (e) {
              /* swallow */
            }
          })();
        }
      } catch (e) {}
    };

    window.addEventListener("popstate", onPopState);

    // initial load
    loadTheme();

    return () => {
      aborted = true;
      try {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
      } catch {}
      try {
        if (containerRef.current && handlersRef.current.submitHandler)
          containerRef.current.removeEventListener(
            "submit",
            handlersRef.current.submitHandler,
            true
          );
      } catch {}
      try {
        if (containerRef.current && handlersRef.current.clickHandler)
          containerRef.current.removeEventListener(
            "click",
            handlersRef.current.clickHandler,
            true
          );
      } catch {}
      try {
        window.removeEventListener("popstate", onPopState);
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
