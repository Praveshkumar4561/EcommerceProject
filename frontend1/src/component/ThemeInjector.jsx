// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);
  const lastGoodHtmlRef = useRef(""); // store last working HTML to restore on error
  const loadCounterRef = useRef(0); // for ignoring stale loads

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

  const isAbsoluteOrProtocol = (u = "") =>
    /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);

  const isDataOrBlobOrMail = (u = "") =>
    /^(data:|blob:|mailto:|tel:|#)/.test(u);

  const isApiPath = (u = "") =>
    typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");

  const isRelativeForRewrite = (u = "") =>
    !!u && !isAbsoluteOrProtocol(u) && !isDataOrBlobOrMail(u) && !isApiPath(u);

  const themeBaseNormalized = (b = themeBaseUrl) =>
    b ? (b.endsWith("/") ? b : b + "/") : "";

  const makeAbsoluteUrl = (url = "", base = themeBaseUrl) => {
    if (!url) return url;
    if (isApiPath(url) || isAbsoluteOrProtocol(url)) return url;
    if (!base) return url;
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
    // handle img, source, audio/video src, srcset, and data-src
    const els = container.querySelectorAll(
      "img, source, [data-src], [data-srcset], video, audio"
    );
    els.forEach((el) => {
      // src
      if (el.getAttribute && el.getAttribute("src")) {
        const val = el.getAttribute("src");
        if (val && (isRelativeForRewrite(val) || val.startsWith("/"))) {
          el.setAttribute("src", makeAbsoluteUrl(val, base));
        }
      }
      // srcset
      if (el.getAttribute && el.getAttribute("srcset")) {
        const srcset = el.getAttribute("srcset");
        if (srcset) {
          const parts = srcset.split(",").map((part) => {
            const [url, size] = part.trim().split(/\s+/);
            const newUrl =
              isRelativeForRewrite(url) || url.startsWith("/")
                ? makeAbsoluteUrl(url, base)
                : url;
            return size ? `${newUrl} ${size}` : newUrl;
          });
          el.setAttribute("srcset", parts.join(", "));
        }
      }
      // data-src / data-srcset
      if (el.getAttribute && el.getAttribute("data-src")) {
        const v = el.getAttribute("data-src");
        if (v && (isRelativeForRewrite(v) || v.startsWith("/"))) {
          el.setAttribute("data-src", makeAbsoluteUrl(v, base));
        }
      }
      if (el.getAttribute && el.getAttribute("data-srcset")) {
        const v = el.getAttribute("data-srcset");
        if (v) {
          const parts = v.split(",").map((part) => {
            const [url, size] = part.trim().split(/\s+/);
            const newUrl =
              isRelativeForRewrite(url) || url.startsWith("/")
                ? makeAbsoluteUrl(url, base)
                : url;
            return size ? `${newUrl} ${size}` : newUrl;
          });
          el.setAttribute("data-srcset", parts.join(", "));
        }
      }
    });
  };

  const loadStylesheet = (href, timeoutMs = 10000) =>
    new Promise((resolve) => {
      try {
        if (!href) return resolve();
        // avoid duplicates
        if (
          document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)
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

  // remove previously injected scripts/styles (clean up)
  const cleanupInjected = () => {
    try {
      const injectedLinks = Array.from(
        document.head.querySelectorAll(
          'link[data-theme-injected="true"], style[data-theme-injected="true"]'
        )
      );
      injectedLinks.forEach(
        (n) => n.parentElement && n.parentElement.removeChild(n)
      );
      const injectedScripts = Array.from(
        document.body.querySelectorAll('script[data-theme-injected="true"]')
      );
      injectedScripts.forEach(
        (n) => n.parentElement && n.parentElement.removeChild(n)
      );
    } catch (e) {
      // ignore
    }
  };

  const executeScriptsSerialInto = async (doc, container) => {
    const scripts = Array.from(doc.querySelectorAll("script"));
    for (const s of scripts) {
      if (!mountedRef.current) break;
      const src = s.getAttribute("src");
      const type = s.getAttribute("type") || "";
      if (src) {
        const abs = makeAbsoluteUrl(src, themeBaseUrl);
        // avoid duplicate script tags already injected into container
        if (
          container.querySelector(`script[src="${abs}"]`) ||
          document.body.querySelector(`script[src="${abs}"]`)
        )
          continue;
        await new Promise((resolve) => {
          const el = document.createElement("script");
          if (type) el.type = type;
          el.src = abs;
          el.async = false;
          el.dataset.themeInjected = "true";
          // inject into container so script context acts on container DOM
          container.appendChild(el);
          el.onload = resolve;
          el.onerror = resolve;
        });
      } else {
        const content = s.textContent || "";
        if (/document\.write/.test(content)) continue;
        try {
          const el = document.createElement("script");
          if (type) el.type = type;
          el.text = content;
          el.dataset.themeInjected = "true";
          container.appendChild(el);
        } catch {}
      }
    }
  };

  const tryFetchWithFallbacks = async (origUrl) => {
    // normalize to absolute if possible
    const candidateUrls = [];
    if (isAbsoluteOrProtocol(origUrl)) candidateUrls.push(origUrl);
    else {
      // try makeAbsoluteUrl, then raw orig, then with .html, then dynamic
      candidateUrls.push(makeAbsoluteUrl(origUrl, themeBaseUrl));
      candidateUrls.push(origUrl);
    }

    // if last candidate doesn't end with .html try adding .html
    const tried = new Set();
    for (let u of candidateUrls) {
      if (!u || tried.has(u)) continue;
      tried.add(u);
      try {
        const res = await fetch(u, { cache: "no-cache" }).catch(() => null);
        if (res && res.ok) return res;
      } catch {}
      // try alt .html
      if (u && !/\.html$/i.test(u)) {
        const alt = u.replace(/\/+$/, "") + ".html";
        if (!tried.has(alt)) {
          tried.add(alt);
          try {
            const r2 = await fetch(alt, { cache: "no-cache" }).catch(
              () => null
            );
            if (r2 && r2.ok) return r2;
          } catch {}
        }
      }
    }

    // final dynamic.html fallback in theme base
    try {
      const dynamicUrl = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
      const r3 = await fetch(dynamicUrl, { cache: "no-cache" }).catch(
        () => null
      );
      if (r3 && r3.ok) return r3;
    } catch {}

    return null;
  };

  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;
    let aborted = false;
    const myLoadId = ++loadCounterRef.current;

    const loadTheme = async () => {
      setLoading(true);

      // keep previous HTML visible until new load is ready
      const previousHtml = containerRef.current
        ? containerRef.current.innerHTML
        : "";
      // cleanup old injected assets so duplicates don't accumulate
      cleanupInjected();

      try {
        const res = await tryFetchWithFallbacks(pageUrl);
        if (
          aborted ||
          myLoadId !== loadCounterRef.current ||
          !mountedRef.current
        ) {
          setLoading(false);
          return;
        }
        if (!res) throw new Error("fetch failed (all fallbacks)");
        const html = await res.text();

        if (
          aborted ||
          myLoadId !== loadCounterRef.current ||
          !mountedRef.current
        ) {
          setLoading(false);
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // update title if provided
        const newTitle = doc.querySelector("title")?.textContent?.trim();
        if (newTitle) document.title = newTitle;

        // set base tag properly - keep protocol and host intact
        let base = document.head.querySelector('base[data-theme-base="true"]');
        if (!base) {
          base = document.createElement("base");
          base.setAttribute("data-theme-base", "true");
          document.head.appendChild(base);
        }
        base.href = themeBaseNormalized(themeBaseUrl);

        // load link stylesheets (await)
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

        // inject inline styles
        styleNodes.forEach((s) => {
          const newStyle = document.createElement("style");
          newStyle.innerHTML = s.innerHTML || "";
          newStyle.dataset.themeInjected = "true";
          document.head.appendChild(newStyle);
        });

        // build a temp container and rewrite assets/links
        const temp = document.createElement("div");
        temp.innerHTML = doc.body.innerHTML || "";
        rewriteInjectedAssets(temp, themeBaseUrl);
        rewriteInjectedLinks(temp);

        // create a container fragment to insert to DOM atomically
        const fragment = document.createElement("div");
        fragment.innerHTML = temp.innerHTML;

        // execute scripts into fragment (so they operate on fragment nodes)
        // but because scripts must be in DOM to run, append fragment to a hidden wrapper first
        const hiddenWrapper = document.createElement("div");
        hiddenWrapper.style.cssText =
          "position: absolute; left: -9999px; top: -9999px; width:1px; height:1px; overflow:hidden;";
        hiddenWrapper.dataset.themeInjected = "true";
        hiddenWrapper.appendChild(fragment);
        document.body.appendChild(hiddenWrapper);

        await executeScriptsSerialInto(doc, hiddenWrapper);

        // if still current load
        if (
          myLoadId !== loadCounterRef.current ||
          aborted ||
          !mountedRef.current
        ) {
          // remove hidden wrapper if stale
          try {
            hiddenWrapper.parentNode &&
              hiddenWrapper.parentNode.removeChild(hiddenWrapper);
          } catch {}
          setLoading(false);
          return;
        }

        // swap in the prepared content (atomic swap)
        if (containerRef.current) {
          containerRef.current.innerHTML = hiddenWrapper.innerHTML;
          // restore scroll to top (optional)
          containerRef.current.scrollTop = 0;
        }

        // save last good html
        lastGoodHtmlRef.current = containerRef.current
          ? containerRef.current.innerHTML
          : previousHtml;

        // clean the hidden wrapper
        try {
          hiddenWrapper.parentNode &&
            hiddenWrapper.parentNode.removeChild(hiddenWrapper);
        } catch {}

        // re-attach a submit listener on container (forms -> SPA)
        const submitHandler = (e) => {
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

        // ensure duplicate listener not added
        try {
          containerRef.current.removeEventListener(
            "submit",
            submitHandler,
            true
          );
        } catch {}
        containerRef.current.addEventListener("submit", submitHandler, true);

        // fire DOM events (allow theme scripts to run on real DOM)
        setTimeout(() => {
          try {
            document.dispatchEvent(
              new Event("DOMContentLoaded", { bubbles: true })
            );
            window.dispatchEvent(new Event("load", { bubbles: true }));
            window.dispatchEvent(new Event("pageshow", { bubbles: true }));
          } catch {}
        }, 50);
      } catch (err) {
        console.error("[ThemeInjector] loadTheme failed:", err);
        // restore previous good HTML if available
        if (containerRef.current && lastGoodHtmlRef.current) {
          containerRef.current.innerHTML = lastGoodHtmlRef.current;
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    loadTheme();

    return () => {
      aborted = true;
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
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              pointerEvents: "auto",
              background: "rgba(255,255,255,0.9)",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
