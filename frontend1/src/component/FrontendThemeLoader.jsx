import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeInjector from "../component/ThemeInjector";
import { ThemeIntegration } from "../backend/appearance/AdminTheme/ThemeIntegration";
const LOADING_INDICATOR_DELAY = 300;
const FADE_MS = 220;

const FrontendThemeLoader = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [pageName, setPageName] = useState("index");
  const [iframes, setIframes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [injectorPageUrl, setInjectorPageUrl] = useState(null);
  const [injectorThemeBase, setInjectorThemeBase] = useState(null);
  const loadingTimer = useRef(null);
  const mountedRef = useRef(true);
  const pollIntervalRef = useRef(null);
  const navigate = useNavigate();
  const { themePath } = useParams();
  const location = useLocation();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(loadingTimer.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const derivePageNameFromPath = (pathname, activeSlug) => {
    try {
      const clean = (pathname || "/").replace(/\/+$/, "");
      if (!clean || clean === "/") return "index";
      const parts = clean.split("/");
      const idx = activeSlug ? parts.findIndex((p) => p === activeSlug) : -1;
      const afterSlug = idx >= 0 ? parts.slice(idx + 1) : parts;
      const last = afterSlug.pop() || "index";
      return last.replace(/\.html$/i, "") || "index";
    } catch {
      return "index";
    }
  };

  useEffect(() => {
    if (!mountedRef.current) return;
    const slug = activeTheme?.folder_name
      ? activeTheme.folder_name.split("/")[0]
      : null;
    const newName = derivePageNameFromPath(location.pathname, slug);
    setPageName(newName);
  }, [location.pathname, activeTheme]);

  const normalizeNoSlash = (s = "") =>
    s.replace(/^\/+/, "").replace(/\/+$/, "");

  const computeActualThemePath = useCallback((themeData) => {
    let folderName = (themeData?.folder_name || "").trim();
    folderName = folderName.replace(/^\/+|\/+$/g, "");

    return folderName + "/";
  }, []);

  const resolveThemeBaseForSpecials = (folderClean) => {
    const lc = folderClean.toLowerCase();
    if (lc.includes("roiser"))
      return `${folderClean}/roiser-html-package/roiser`;
    if (lc.includes("pesco")) {
      return "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template";
    }
    if (lc.includes("radios")) {
      return folderClean + "/radios-html-package/Radios/";
    }
    return null;
  };

  const handleLoad = (id) => {
    if (!mountedRef.current) return;
    setIframes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, loaded: true } : f))
    );
  };

  const loadActiveTheme = useCallback(async () => {
    clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(
      () => setShowLoadingIndicator(true),
      LOADING_INDICATOR_DELAY
    );

    try {
      ThemeIntegration.clearThemeAssets();

      const { data } = await axios.get(
        "https://demo.webriefly.com/api/themes/active"
      );
      if (!data?.theme) throw new Error("No active theme configured");
      const themeData = data.theme;

      // admin preview path: don't attempt to apply assets
      if (location.pathname.includes("/admin")) {
        setActiveTheme(themeData);
        setError(null);
        return;
      }

      // compute paths
      const actualThemePath = computeActualThemePath(themeData);
      const folderClean = normalizeNoSlash(actualThemePath);

      // support special folder mapping (pesco, radios, etc.) but don't remove or alter roiser
      const resolvedFolder = resolveThemeBaseForSpecials(folderClean);
      const prefix = "https://demo.webriefly.com/api/themes/static/";
      const folderForBase = resolvedFolder ?? folderClean;
      const themeBase = `${prefix}${normalizeNoSlash(folderForBase)}/`;

      // determine page file name (try to keep compatibility with previous logic)
      const page = pageName?.endsWith(".html")
        ? pageName.replace(/^\//, "")
        : `${pageName.replace(/^\//, "").replace(/\.html$/, "")}.html`;

      const themeUrl = `${themeBase}${page.replace(/^\/+/, "")}`;

      const useInjector = /^(index(\.html)?)$/i.test(pageName || "");

      if (useInjector) {
        setInjectorPageUrl(themeUrl);
        setInjectorThemeBase(themeBase);
        setIframes([]);
        setActiveId(null);
      } else {
        const id = `theme-${Date.now()}`;
        setIframes([{ id, src: themeUrl, loaded: false }]);
        setActiveId(id);

        setInjectorPageUrl(null);
        setInjectorThemeBase(null);
      }

      // only apply theme assets client-side for non-injector previews
      if (!useInjector) {
        ThemeIntegration.applyThemeFromObject(themeData).catch((err) => {
          console.warn("ThemeIntegration.applyThemeFromObject failed:", err);
        });
      }

      setActiveTheme({
        ...themeData,
        themePath: normalizeNoSlash(resolvedFolder),
        isActive: true,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || String(err));
      toast.error("Failed to load theme.");
    } finally {
      clearTimeout(loadingTimer.current);
      setLoading(false);
      setShowLoadingIndicator(false);
    }
  }, [computeActualThemePath, pageName, location.pathname]);

  useEffect(() => {
    // initial load only (polling removed to stop automatic reloads)
    loadActiveTheme();

    // cleanup hook ensures any leftover interval is cleared defensively
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [loadActiveTheme]);

  // iframe-to-parent navigation handler
  useEffect(() => {
    const handleIframeNavigation = (event) => {
      if (event.data?.type === "navigate") {
        const path = event.data.path;
        const page = path === "/" ? "index" : path.replace(/^\//, "");
        setPageName(page);
        navigate(path, { replace: false });
      } else if (event.data?.type === "direct-navigation") {
        const page = event.data.page || "index";
        setPageName(page);
        const isIndex = /^(index(\.html)?)$/i.test(page);
        const dest = isIndex ? "/" : `/${page}`;
        navigate(themePath ? `/theme/${themePath}/${page}` : dest, {
          replace: isIndex,
        });
      }
    };
    window.addEventListener("message", handleIframeNavigation);
    return () => window.removeEventListener("message", handleIframeNavigation);
  }, [navigate, themePath]);

  // theme activation / deactivation events (from your older file)
  useEffect(() => {
    const onActivate = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      await loadActiveTheme();

      // after activation, navigate to the theme path if available
      if (!location.pathname.includes("/admin")) {
        try {
          const { data } = await axios.get(
            "https://demo.webriefly.com/api/themes/active"
          );
          if (data?.theme?.folder_name) {
            navigate(`/theme/${data.theme.folder_name}`, { replace: true });
          }
        } catch (e) {
          // swallow - we already reloaded
        }
      }

      toast.success("Theme activated successfully!");
      setLoading(false);
    };

    const onDeactivate = () => {
      ThemeIntegration.clearThemeAssets();
      setActiveTheme(null);
      navigate("/");
      toast.info("Theme has been deactivated");
    };

    window.addEventListener("themeActivated", onActivate);
    window.addEventListener("themeDeactivated", onDeactivate);
    return () => {
      window.removeEventListener("themeActivated", onActivate);
      window.removeEventListener("themeDeactivated", onDeactivate);
    };
  }, [loadActiveTheme, navigate, location.pathname]);

  // loading overlay
  if (isClient && loading && showLoadingIndicator) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.8)",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
        }}
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading theme...</span>
        </div>
      </div>
    );
  }

  if (injectorPageUrl && injectorThemeBase) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#fff",
          position: "relative",
        }}
      >
        <ThemeInjector
          pageUrl={injectorPageUrl}
          themeBaseUrl={injectorThemeBase}
          onNavigate={(p, opts) => {
            const replace = !!(opts && opts.replace);
            if (p === "/") navigate("/", { replace });
            else navigate(p, { replace });
          }}
          fullReload={false}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Theme Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!activeTheme && iframes.length === 0) return children;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#fff",
        position: "relative",
      }}
    >
      {iframes.map((f) => {
        return (
          <iframe
            key={f.id}
            src={f.src}
            title={`ThemePreview-${f.id}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            onLoad={() => handleLoad(f.id)}
            onError={() => {
              console.warn("iframe failed to load:", f.src);
              setIframes((prev) => prev.filter((p) => p.id !== f.id));
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              transition: `opacity ${FADE_MS}ms ease`,
              opacity: f.loaded ? 1 : 0,
              zIndex: f.id === activeId ? 2 : 1,
              pointerEvents: f.id === activeId ? "auto" : "none",
              background: "#fff",
            }}
          />
        );
      })}
    </div>
  );
};

export default FrontendThemeLoader;
