import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeIntegration } from "../backend/appearance/AdminTheme/ThemeIntegration";

const LOADING_INDICATOR_DELAY = 300;

const FrontendThemeLoader = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [pageName, setPageName] = useState("index");
  const loadingTimer = useRef(null);
  const navigate = useNavigate();
  const { themePath } = useParams();
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const applyTheme = useCallback(async (themeData) => {
    const folderName = themeData.folder_name || themeData.themePath;
    if (!folderName) throw new Error("Theme folder name not found");

    let actualThemePath = folderName;
    if (
      folderName.toLowerCase().includes("roiser") &&
      !folderName.includes("2025-06-12")
    ) {
      actualThemePath = `${folderName}-2025-06-12-15-16-08-utc`;
    }

    await ThemeIntegration.applyThemeFromObject(themeData);
    setActiveTheme({
      ...themeData,
      themePath: actualThemePath,
      isActive: true,
    });
    setError(null);
  }, []);

  const loadActiveTheme = useCallback(async () => {
    loadingTimer.current = setTimeout(() => {
      setShowLoadingIndicator(true);
    }, LOADING_INDICATOR_DELAY);

    try {
      const { data } = await axios.get(
        "http://147.93.45.171:1600/themes/active"
      );
      if (!data?.theme) throw new Error("No active theme configured");

      if (location.pathname.includes("/admin")) {
        setActiveTheme(data.theme);
      } else {
        await applyTheme(data.theme);
      }
    } catch (err) {
      setError(err.message);
      if (themePath) {
        setTimeout(() => navigate("/"), 3000);
      }
    } finally {
      clearTimeout(loadingTimer.current);
      setLoading(false);
      setShowLoadingIndicator(false);
    }
  }, [applyTheme, navigate, themePath, location.pathname]);

  useEffect(() => {
    loadActiveTheme();
    const interval = setInterval(loadActiveTheme, 10000);

    const handleIframeNavigation = (event) => {
      if (event.data?.type === "direct-navigation") {
        const page = event.data.page || "index";
        setPageName(page);
        navigate(themePath ? `/theme/${themePath}/${page}` : `/${page}`);
      }
    };

    window.addEventListener("message", handleIframeNavigation);
    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimer.current);
      window.removeEventListener("message", handleIframeNavigation);
    };
  }, [loadActiveTheme, navigate, themePath]);

  useEffect(() => {
    const onActivate = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      await loadActiveTheme();
      if (!location.pathname.includes("/admin")) {
        const { data } = await axios.get(
          "http://147.93.45.171:1600/themes/active"
        );
        navigate(`/theme/${data.theme.folder_name}`, { replace: true });
      }
      toast.success("Theme activated successfully!");
      setLoading(false);
    };
    const onDeactivate = () => {
      ThemeIntegration.clearAssets();
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

  if (error) {
    return (
      <div className="container mt-5">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2" />
          <div>
            <h4 className="alert-heading">Theme Error</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">Please contact support if this persists.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeTheme) return children;

  const usesEjs = activeTheme.themePath.toLowerCase().includes("roiser");
  const ext = usesEjs ? ".ejs" : ".html";
  let page = pageName?.endsWith(ext)
    ? pageName
    : `${pageName.replace(/\.(html|ejs)$/, "")}${ext}`;

  if (!page.endsWith(ext)) page = `${page.replace(/\.(html|ejs)$/, "")}${ext}`;

  let themeFolder = activeTheme.themePath;
  if (themeFolder.toLowerCase().includes("roiser")) {
    themeFolder += "/roiser-html-package/roiser";
  } else if (themeFolder.toLowerCase().includes("pesco")) {
    themeFolder = `pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template`;
  } else if (themeFolder.toLowerCase().includes("radios")) {
    themeFolder += "/radios-html-package/Radios";
  }

  const themeUrl = `http://147.93.45.171:1600/themes/static/${themeFolder}/${page}`;

  return (
    <div
      className="theme-container"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        overflow: "hidden",
      }}
    >
      <iframe
        key={themeUrl}
        src={themeUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Theme Preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        onLoad={(e) => {
          setLoading(false);
        }}
        onError={() => setError("Failed to load theme content.")}
      />
    </div>
  );
};

export default FrontendThemeLoader;
