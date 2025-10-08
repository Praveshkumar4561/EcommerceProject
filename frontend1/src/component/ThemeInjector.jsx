// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

// Improved ThemeInjector
// - Double-buffered DOM swapping (keeps previous page visible until new page is ready)
// - Prefetch on hover and manual prefetch cache to make navigations near-instant
// - Loads external styles before swap; injects inline styles; executes scripts after swap
// - Robust asset/link rewriting for SPA navigation

export default function ThemeInjector({ pageUrl, themeBaseUrl, onNavigate }) {
  const curRef = useRef(null); // visible container
  const nextRef = useRef(null); // hidden container used to prepare next page
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(false);

  // small in-memory cache: url -> { html, doc, title, time }
  const cacheRef = useRef(new Map());
  const inflightRef = useRef(new Map()); // url -> AbortController

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  // helpers
  const slugify = (str = "") =>
    String(str)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");

  const themeBaseNormalized = (b = themeBaseUrl) =>
    b.endsWith("/") ? b : b + "/";

  const isAbsoluteOrProtocol = (u = "") =>
    /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);
  const isDataOrBlobOrMail = (u = "") =>
    /^(data:|blob:|mailto:|tel:|#)/.test(u);
  const isApiPath = (u = "") =>
    typeof u === "string" && u.startsWith("https://demo.webriefly.com/api/");
  const isRelativeForRewrite = (u = "") =>
    !!u && !isAbsoluteOrProtocol(u) && !isDataOrBlobOrMail(u) && !isApiPath(u);

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

  // rewriting injected links -> internal links get SPA paths
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
      const spa = normalizeSpaPath(href);
      a.setAttribute("href", spa);
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
      }
    });
  };

  // load external stylesheet and track by page id so we can remove old ones later
  const loadStylesheet = (href, pageId, timeoutMs = 7000) =>
    new Promise((resolve) => {
      try {
        // if same href already present for this pageId or globally, resolve
        if (
          document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)
        )
          return resolve();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.dataset.themeInjected = pageId;
        const done = () => resolve();
        link.onload = done;
        link.onerror = done;
        document.head.appendChild(link);
        setTimeout(done, timeoutMs);
      } catch (e) {
        resolve();
      }
    });

  const executeScriptsSerial = async (
    doc,
    pageId,
    { allowDuplicateScripts = false } = {}
  ) => {
    const scripts = Array.from(doc.querySelectorAll("script"));
    for (const s of scripts) {
      if (!mountedRef.current) break;
      const src = s.getAttribute("src");
      const type = s.getAttribute("type") || "";
      if (src) {
        const abs = makeAbsoluteUrl(src, themeBaseUrl);
        // skip duplicates unless explicitly allowed
        if (
          !allowDuplicateScripts &&
          document.body.querySelector(`script[src="${abs}"]`)
        )
          continue;
        await new Promise((resolve) => {
          const el = document.createElement("script");
          if (type) el.type = type;
          el.src = abs;
          el.async = false;
          el.dataset.themeInjected = pageId;
          el.onload = resolve;
          el.onerror = resolve;
          document.body.appendChild(el);
        });
      } else {
        const content = s.textContent || "";
        if (/document\.write/.test(content)) continue; // skip dangerous scripts
        try {
          const el = document.createElement("script");
          if (type) el.type = type;
          el.text = content;
          el.dataset.themeInjected = pageId;
          document.body.appendChild(el);
        } catch (e) {
          // swallow
        }
      }
    }
  };

  // Fetch with cache & abort support, returns parsed doc and html
  const fetchWithCache = async (url) => {
    const key = String(url);
    if (cacheRef.current.has(key)) return cacheRef.current.get(key);
    // if already inflight, return that promise
    if (inflightRef.current.has(key)) return inflightRef.current.get(key);

    const controller = new AbortController();
    const p = (async () => {
      try {
        const res = await fetch(url, {
          cache: "no-cache",
          signal: controller.signal,
        });
        if (!res || !res.ok) throw new Error("fetch failed");
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const title =
          doc.querySelector("title")?.textContent?.trim() || document.title;
        const result = { html, doc, title };
        // cache short-term
        cacheRef.current.set(key, result);
        return result;
      } finally {
        inflightRef.current.delete(key);
      }
    })();

    inflightRef.current.set(key, p);
    controller.signal.addEventListener("abort", () => {});
    inflightRef.current.set(key, p);
    // store controller so we can cancel if necessary
    inflightRef.current.set(key + "::ctrl", controller);
    return p;
  };

  // prefetch utility (used on hover / focus)
  const prefetch = (url) => {
    const abs = url; // assume url is full or relative handled by fetch; we pass pageUrl values
    // ignore if already cached or inflight
    if (cacheRef.current.has(abs) || inflightRef.current.has(abs)) return;
    fetchWithCache(abs).catch(() => {});
  };

  // core loader: prepares page in nextRef (hidden), then swaps into curRef
  const prepareAndSwap = async (targetUrl) => {
    if (!curRef.current || !nextRef.current) return;
    // keep visible content until new ready
    setLoading(true);
    const pageId = `page-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    let fetched;
    try {
      fetched = await fetchWithCache(targetUrl);
    } catch (err) {
      console.error("prefetch/fetch failed", err);
      setLoading(false);
      return;
    }

    if (!mountedRef.current) return;

    const { doc, title } = fetched;

    // load external styles referenced by the doc BEFORE swapping
    const linkNodes = Array.from(
      doc.querySelectorAll('link[rel="stylesheet"]')
    );
    const styleNodes = Array.from(doc.querySelectorAll("style"));

    await Promise.all(
      linkNodes.map((l) => {
        const rawHref = l.getAttribute("href");
        if (!rawHref) return Promise.resolve();
        return loadStylesheet(makeAbsoluteUrl(rawHref, themeBaseUrl), pageId);
      })
    );

    // inject inline styles (tag with pageId so we can remove later)
    styleNodes.forEach((s) => {
      const newStyle = document.createElement("style");
      newStyle.innerHTML = s.innerHTML || "";
      newStyle.dataset.themeInjected = pageId;
      document.head.appendChild(newStyle);
    });

    // prepare next container HTML but don't execute scripts yet
    const temp = document.createElement("div");
    temp.innerHTML = doc.body.innerHTML || "";

    rewriteInjectedAssets(temp, themeBaseUrl);
    rewriteInjectedLinks(temp);

    // set next container content (hidden beneath curRef)
    nextRef.current.innerHTML = temp.innerHTML;

    // attach form submit handler for SPA inside next container
    const submitHandler = (e) => {
      if (!nextRef.current) return;
      let node = e.target;
      while (node && node !== nextRef.current && node.tagName !== "FORM")
        node = node.parentElement;
      if (!node || node.tagName !== "FORM") return;
      const action = node.getAttribute("action") || "";
      if (action && !isAbsoluteOrProtocol(action)) {
        e.preventDefault();
        const spa = normalizeSpaPath(action);
        routeViaSPA(spa || "/");
      }
    };

    nextRef.current.addEventListener("submit", submitHandler, true);

    // Now swap: make nextRef visible and hide curRef. This ensures user sees content immediately.
    try {
      curRef.current.style.visibility = "hidden";
      nextRef.current.style.visibility = "visible";
      // swap roles: copy next HTML into curRef then clear nextRef
      curRef.current.innerHTML = nextRef.current.innerHTML;
      // cleanup nextRef
      nextRef.current.innerHTML = "";
      // update document title
      if (title) document.title = title;
      // remove previously injected resources from older pages after a delay to avoid flash
      setTimeout(() => {
        // remove old styles/scripts tagged with older pageIds except those matching current newly injected pageId
        const injected = Array.from(
          document.querySelectorAll("[data-theme-injected]")
        );
        injected.forEach((el) => {
          if (el.dataset.themeInjected && el.dataset.themeInjected !== pageId) {
            try {
              // don't remove link if href still used by other pages; simplistic removal is ok for most cases
              el.parentElement && el.parentElement.removeChild(el);
            } catch {}
          }
        });
      }, 1000);

      // execute scripts serialized (after swap) — allow duplicate scripts only if they were not loaded previously
      await executeScriptsSerial(doc, pageId, { allowDuplicateScripts: false });
    } catch (e) {
      console.error("swap failed", e);
    } finally {
      // remove submit handler attached to nextRef (already swapped)
      try {
        nextRef.current &&
          nextRef.current.removeEventListener("submit", submitHandler, true);
      } catch (e) {}
      setLoading(false);
    }
  };

  // Immediately prepare initial pageUrl into current container
  useEffect(() => {
    if (!pageUrl || !themeBaseUrl) return;
    // ensure both containers exist
    if (!curRef.current || !nextRef.current) return;
    // make nextRef invisible and curRef visible initially
    nextRef.current.style.visibility = "hidden";
    curRef.current.style.visibility = "visible";
    // Prepare and swap to pageUrl
    prepareAndSwap(pageUrl).catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageUrl, themeBaseUrl]);

  // Prefetch on hover (delegated) for internal links inside theme area
  useEffect(() => {
    const onHover = (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      if (isAbsoluteOrProtocol(href)) return; // skip external
      const spa = normalizeSpaPath(href);
      // build full fetch URL by using pageUrl base if spa seems relative to theme
      const full = spa.startsWith("/")
        ? themeBaseNormalized(themeBaseUrl).replace(/\/$/, "") + spa
        : spa;
      prefetch(full);
    };
    document.body.addEventListener("mouseover", onHover, { passive: true });
    document.body.addEventListener("focus", onHover, {
      passive: true,
      capture: true,
    });
    return () => {
      document.body.removeEventListener("mouseover", onHover);
      document.body.removeEventListener("focus", onHover, true);
    };
  }, [themeBaseUrl]);

  // Intercept clicks on links inside current container to run SPA navigation using prepareAndSwap
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      // ignore external links / anchors / mailto / tel
      if (
        isAbsoluteOrProtocol(href) ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      e.preventDefault();
      const spa = normalizeSpaPath(href);
      // compute absolute theme URL to fetch
      const full = spa.startsWith("/")
        ? themeBaseNormalized(themeBaseUrl).replace(/\/$/, "") + spa
        : spa;
      // route history and actually fetch+swap
      if (history && history.pushState) history.pushState({}, "", spa);
      prepareAndSwap(full).catch((err) => console.error(err));
    };

    const el = curRef.current;
    if (el) el.addEventListener("click", onClick);
    return () => el && el.removeEventListener("click", onClick);
  }, [themeBaseUrl]);

  // expose programmatic SPA navigation via onNavigate if provided
  useEffect(() => {
    if (!onNavigate) return;
    // override onNavigate by wrapping it — but priority will still be given to provided onNavigate
    // here we simply provide prepareAndSwap when called externally via props (already handled earlier in routeViaSPA)
  }, [onNavigate]);

  // render two stacked containers: curRef is visible, nextRef is hidden and used only for prepping
  return (
    <div
      className="theme-wrapper"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <div
        ref={nextRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "auto",
          visibility: "hidden",
          zIndex: 0,
        }}
      />

      <div
        ref={curRef}
        className="theme-container"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "auto",
          visibility: "visible",
          zIndex: 1,
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
            background: "rgba(255,255,255,0.35)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
            }}
          >
            Loading…
          </div>
        </div>
      )}
    </div>
  );
}
