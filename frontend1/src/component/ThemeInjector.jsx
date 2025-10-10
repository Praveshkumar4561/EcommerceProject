// src/components/ThemeInjector.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ThemeInjector({
  pageUrl,
  themeBaseUrl,
  onNavigate,
  debug = false,
}) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const fetchControllerRef = useRef(null);
  const fetchIdRef = useRef(0);
  const handlersRef = useRef({ submitHandler: null, clickHandler: null });
  const [loading, setLoading] = useState(false);

  const MAX_RETRIES = 2;
  const RETRY_MS = 300;

  const slugify = (s = "") =>
    String(s)
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

    const isAbsolute = (u = "") =>
      /^(?:[a-zA-Z][a-zA-Z0-9+\-.]*:|\/\/)/.test(u);
    const themeBaseNormalized = (b = themeBaseUrl) =>
      b.endsWith("/") ? b : b + "/";
    const makeAbsolute = (url = "", base = themeBaseUrl) => {
      if (!url) return url;
      if (isAbsolute(url)) return url;
      try {
        if (url.startsWith("/"))
          return themeBaseNormalized(base).replace(/\/+$/g, "") + url;
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
          console.warn(e);
        }
      }
      if (opts.replace) history.replaceState({}, "", spa);
      else history.pushState({}, "", spa);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const rewriteAssets = (container, base) => {
      if (!container) return;
      container
        .querySelectorAll("img, source, [data-src], [data-srcset], [srcset]")
        .forEach((el) => {
          if (el.getAttribute("src")) {
            const v = el.getAttribute("src");
            if (v && !isAbsolute(v))
              el.setAttribute("src", makeAbsolute(v, base));
          }
          if (el.getAttribute("data-src")) {
            const v = el.getAttribute("data-src");
            if (v && !isAbsolute(v))
              el.setAttribute("data-src", makeAbsolute(v, base));
          }
          if (el.getAttribute("srcset")) {
            const s = el.getAttribute("srcset");
            if (s) {
              const parts = s
                .split(",")
                .map((p) => p.trim())
                .map((p) => {
                  const [u, d] = p.split(/\s+/);
                  return !isAbsolute(u)
                    ? `${makeAbsolute(u, base)}${d ? ` ${d}` : ""}`
                    : p;
                });
              el.setAttribute("srcset", parts.join(", "));
            }
          }
        });
    };

    const loadStyles = async (doc) => {
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      await Promise.all(
        links.map((l) => {
          const href = l.getAttribute("href");
          if (!href) return Promise.resolve();
          const abs = makeAbsolute(href, themeBaseUrl);
          return new Promise((r) => {
            try {
              const found = Array.from(
                document.head.querySelectorAll('link[rel="stylesheet"]')
              ).find(
                (x) =>
                  x.href === abs || x.getAttribute("data-original-href") === abs
              );
              if (found) return r();
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = abs;
              link.setAttribute("data-original-href", abs);
              link.onload = r;
              link.onerror = r;
              document.head.appendChild(link);
              setTimeout(r, 7000);
            } catch {
              r();
            }
          });
        })
      );
      Array.from(doc.querySelectorAll("style")).forEach((s) => {
        const st = document.createElement("style");
        st.innerHTML = s.innerHTML || "";
        st.dataset.themeInjected = "true";
        document.head.appendChild(st);
      });
    };

    const executeScripts = async (scriptNodes, baseForResolve) => {
      for (const s of Array.from(scriptNodes || [])) {
        if (aborted || !mountedRef.current) break;
        const src = s.getAttribute("src"),
          type = s.getAttribute("type") || "";
        if (src) {
          const abs = makeAbsolute(src, baseForResolve);
          if (
            document.body.querySelector(`script[src="${abs}"]`) ||
            document.body.querySelector(
              `script[data-theme-injected][src="${abs}"]`
            )
          )
            continue;
          await new Promise((r) => {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.src = abs;
            el.async = false;
            el.dataset.themeInjected = "true";
            el.onload = r;
            el.onerror = r;
            document.body.appendChild(el);
          });
        } else {
          const txt = s.textContent || "";
          if (/document\.write/.test(txt)) continue;
          try {
            const el = document.createElement("script");
            if (type) el.type = type;
            el.text = txt;
            el.dataset.themeInjected = "true";
            document.body.appendChild(el);
          } catch (e) {
            console.warn(e);
          }
        }
      }
    };

    const tryFetch = async (url, signal) => {
      try {
        const r = await fetch(url, { cache: "no-cache", signal }).catch(
          () => null
        );
        if (r && r.ok) return r;
      } catch (e) {
        if (e.name === "AbortError") return null;
      }
      try {
        if (!url.match(/\.html$/i)) {
          const alt = url.replace(/\/+$/, "") + ".html";
          const r2 = await fetch(alt, { cache: "no-cache", signal }).catch(
            () => null
          );
          if (r2 && r2.ok) return r2;
        }
      } catch (e) {
        if (e.name === "AbortError") return null;
      }
      try {
        const dyn = themeBaseNormalized(themeBaseUrl) + "dynamic.html";
        const r3 = await fetch(dyn, { cache: "no-cache", signal }).catch(
          () => null
        );
        if (r3 && r3.ok) return r3;
      } catch (e) {
        if (e.name === "AbortError") return null;
      }
      return null;
    };

    const isHeaderOnly = (html) => {
      try {
        const t = document.createElement("div");
        t.innerHTML = html || "";
        // if only one child and it's header — header-only
        if (
          t.children.length === 1 &&
          t.querySelector("header") &&
          t.children[0].tagName.toLowerCase() === "header"
        )
          return true;
        // also if no meaningful <main> / #content present and small nodeCount
        if (
          !t.querySelector("main") &&
          !t.querySelector("#content") &&
          t.children.length < 3
        )
          return true;
      } catch {}
      return false;
    };

    const pickMainFragment = (doc) => {
      const selectors = [
        "main",
        "#content",
        ".site-content",
        "#primary",
        ".content",
        "[role='main']",
      ];
      for (const s of selectors) {
        const el = doc.querySelector(s);
        if (el && el.innerHTML && el.innerHTML.trim() !== "")
          return el.innerHTML;
      }
      // fallback to body
      return doc.body && doc.body.innerHTML ? doc.body.innerHTML : "";
    };

    const loadTheme = async (targetUrl, attempt = 0) => {
      setLoading(true);
      if (debug)
        console.log("[TI] loadTheme start:", targetUrl, "attempt", attempt);

      try {
        if (fetchControllerRef.current) {
          try {
            fetchControllerRef.current.abort();
          } catch {}
        }
        const controller = new AbortController();
        fetchControllerRef.current = controller;
        const res = await tryFetch(targetUrl, controller.signal);
        if (thisFetchId !== fetchIdRef.current) return; // stale
        if (!res || !res.ok) throw new Error("fetch failed: " + targetUrl);
        const text = await res.text();
        if (debug) console.log("[TI] fetched len:", (text || "").length);

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // load styles first
        await loadStyles(doc);

        // choose fragment smartly
        let fragmentHtml = pickMainFragment(doc);
        // if fragment seems header-only, fallback to body
        if (isHeaderOnly(fragmentHtml)) {
          if (debug)
            console.log(
              "[TI] fragment looks header-only — using body fallback"
            );
          fragmentHtml = doc.body ? doc.body.innerHTML : fragmentHtml;
        }

        // rewrite assets
        const temp = document.createElement("div");
        temp.innerHTML = fragmentHtml || "";
        rewriteAssets(temp, themeBaseUrl);

        // inject only after temp ready (keeps previous visible until new ready)
        if (mountedRef.current && containerRef.current && !aborted) {
          // remove old listeners
          try {
            if (handlersRef.current.submitHandler)
              containerRef.current.removeEventListener(
                "submit",
                handlersRef.current.submitHandler,
                true
              );
          } catch {}
          try {
            if (handlersRef.current.clickHandler)
              containerRef.current.removeEventListener(
                "click",
                handlersRef.current.clickHandler,
                true
              );
          } catch {}

          containerRef.current.innerHTML = temp.innerHTML;

          // collect scripts in injected
          const scripts = Array.from(
            containerRef.current.querySelectorAll("script")
          );
          scripts.forEach(
            (s) => s.parentElement && s.parentElement.removeChild(s)
          );

          // attach handlers
          handlersRef.current.submitHandler = (e) => {
            if (!containerRef.current) return;
            let n = e.target;
            while (n && n !== containerRef.current && n.tagName !== "FORM")
              n = n.parentElement;
            if (!n || n.tagName !== "FORM") return;
            const act = n.getAttribute("action") || "";
            if (act && !isAbsolute(act)) {
              e.preventDefault();
              const spa = normalizeSpaPath(act);
              routeViaSPA(spa);
              const t = makeAbsolute(spa.replace(/^\//, ""), themeBaseUrl);
              loadTheme(t, 0, true);
            }
          };
          containerRef.current.addEventListener(
            "submit",
            handlersRef.current.submitHandler,
            true
          );

          handlersRef.current.clickHandler = (e) => {
            if (!containerRef.current) return;
            let el = e.target;
            while (el && el !== containerRef.current && el.tagName !== "A")
              el = el.parentElement;
            if (!el || el.tagName !== "A") return;
            const href = el.getAttribute("href");
            if (!href) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (el.target && el.target.toLowerCase() === "_blank") return;
            if (
              href.startsWith("#") ||
              isAbsolute(href) ||
              href.startsWith("mailto:") ||
              href.startsWith("tel:")
            )
              return;
            e.preventDefault();
            const spa = normalizeSpaPath(href);
            routeViaSPA(spa);
            const t = makeAbsolute(spa.replace(/^\//, ""), themeBaseUrl);
            loadTheme(t, 0, true);
          };
          containerRef.current.addEventListener(
            "click",
            handlersRef.current.clickHandler,
            true
          );

          // execute scripts serially (prefer scripts grabbed from doc if none in injected)
          const scriptsToRun = scripts.length
            ? scripts
            : Array.from(doc.querySelectorAll("script"));
          await executeScripts(scriptsToRun, themeBaseUrl);
        }

        // small sanity: if container empty, retry once
        if (
          containerRef.current &&
          containerRef.current.innerHTML.trim() === "" &&
          attempt < MAX_RETRIES
        ) {
          if (debug)
            console.warn(
              "[TI] container empty after inject, retrying",
              attempt + 1
            );
          await new Promise((r) => setTimeout(r, RETRY_MS * (attempt + 1)));
          if (!aborted && mountedRef.current)
            await loadTheme(targetUrl, attempt + 1);
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          if (debug) console.log("[TI] fetch aborted");
        } else {
          console.error("[ThemeInjector] error:", err);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div style="padding:20px;font-family:Arial;color:#222"><strong>Sorry — content cannot be loaded.</strong><div style="margin-top:8px">Check console/network for details.</div></div>`;
          }
        }
      } finally {
        if (!aborted && mountedRef.current) setLoading(false);
      }
    };

    // popstate handler (keeps SPA back/forward working)
    const onPop = () => {
      const cur = window.location.pathname + window.location.search;
      const target = makeAbsolute(cur.replace(/^\//, ""), themeBaseUrl);
      fetchIdRef.current++;
      loadTheme(target, 0);
    };
    window.addEventListener("popstate", onPop);

    // initial load (resolve pageUrl to absolute if needed)
    const initial = isAbsolute(pageUrl)
      ? pageUrl
      : makeAbsolute(pageUrl.replace(/^\//, ""), themeBaseUrl);
    loadTheme(initial);

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
        window.removeEventListener("popstate", onPop);
      } catch {}
    };
  }, [pageUrl, themeBaseUrl, onNavigate, debug]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={containerRef}
        className="theme-container"
        style={{ width: "100%", height: "100%", overflow: "auto" }}
      />
      <style>{`@keyframes ti-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
