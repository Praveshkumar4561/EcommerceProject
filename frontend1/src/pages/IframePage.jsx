// src/pages/IframePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ThemeInjector from "../component/ThemeInjector";
import axios from "axios";

export default function IframePage({ page: propPage }) {
  const { page: paramPage } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageUrl, setPageUrl] = useState(null);
  const [themeBase, setThemeBase] = useState(null);
  const [activeTheme, setActiveTheme] = useState(null);

  const normalizeNoSlash = (s = "") =>
    s.replace(/^\/+/, "").replace(/\/+$/, "");

  const resolveThemeBaseForSpecials = (folderClean) => {
    const lc = folderClean.toLowerCase();
    if (lc.includes("roiser"))
      return `${folderClean}/roiser-html-package/roiser`;
    if (lc.includes("pesco")) {
      return "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template";
    }
    if (lc.includes("radios")) {
      return folderClean + "/radios-html-package/Radios";
    }
    return null;
  };

  useEffect(() => {
    axios
      .get("http://147.93.45.171:1600/themes/active")
      .then((res) => setActiveTheme(res.data.theme));
  }, []);

  const folderClean = normalizeNoSlash(activeTheme?.folder_name || "");
  const resolvedFolder = resolveThemeBaseForSpecials(folderClean);
  const THEME_FOLDER = resolvedFolder || folderClean;

  const normalize = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  const probeUrl = async (url, timeoutMs = 3000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      let res = await fetch(url, {
        method: "HEAD",
        cache: "no-cache",
        signal: controller.signal,
      });
      clearTimeout(id);
      if (res && res.ok) return true;
      res = await fetch(url, { method: "GET", cache: "no-cache" });
      return !!(res && res.ok);
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!activeTheme) return;

    let cancelled = false;

    const pageKeyRaw = propPage || paramPage || "";
    const pathFromLocation = (location?.pathname || "").replace(
      /^\/+|\/+$/g,
      ""
    );
    const firstSegment =
      pathFromLocation === "" ? "" : pathFromLocation.split("/")[0];
    const pageKey = normalize(pageKeyRaw || firstSegment || "index");

    const API_BASE = `http://147.93.45.171:1600/themes/static/${THEME_FOLDER}/`;
    const NONAPI_BASE = `/themes/static/${THEME_FOLDER}/`;

    const buildCandidateForKey = (key) => {
      if (key === "index" || key === "") return ["index.html"];
      const candidate = key.endsWith(".html") ? key : `${key}.html`;
      return [candidate];
    };

    const candidateFiles = buildCandidateForKey(pageKey);

    const trySetFallback = async (files) => {
      if (!files || files.length === 0) return false;
      for (const f of files) {
        const apiUrl = `${API_BASE}${f}`;
        if (await probeUrl(apiUrl)) {
          if (cancelled) return true;
          setPageUrl(apiUrl);
          setThemeBase(API_BASE);
          return true;
        }
        const nonApiUrl = `${NONAPI_BASE}${f}`;
        if (await probeUrl(nonApiUrl)) {
          if (cancelled) return true;
          setPageUrl(nonApiUrl);
          setThemeBase(NONAPI_BASE);
          return true;
        }
      }
      if (!cancelled && files[0]) {
        setPageUrl(`${API_BASE}${files[0]}`);
        setThemeBase(API_BASE);
      }
      return false;
    };

    if (candidateFiles) {
      trySetFallback(candidateFiles);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const res = await fetch("http://147.93.45.171:1600/pagesdata");
        if (!res.ok) throw new Error("Failed to fetch pages data");
        const pages = await res.json();
        if (!Array.isArray(pages)) throw new Error("Invalid pages response");

        const matched = pages.find((p) => {
          const permalink = normalize(p?.permalink || "");
          const name = normalize(p?.name || "");
          return permalink === pageKey || name === pageKey;
        });

        if (cancelled) return;

        if (matched) {
          const status = (matched?.status || "")
            .toString()
            .trim()
            .toLowerCase();
          if (status === "pending") {
            navigate("/error", { replace: true });
            return;
          }
          const allowed = new Set(["published", "draft"]);
          if (matched?.status && !allowed.has(status)) {
            navigate("/error", { replace: true });
            return;
          }

          const slug = matched.permalink || matched.name || pageKey;
          const dynApi = `${API_BASE}dynamic.html?slug=${encodeURIComponent(
            slug
          )}`;
          const dynNonApi = `${NONAPI_BASE}dynamic.html?slug=${encodeURIComponent(
            slug
          )}`;

          if (await probeUrl(dynApi)) {
            if (cancelled) return;
            setPageUrl(dynApi);
            setThemeBase(API_BASE);
            return;
          }
          if (await probeUrl(dynNonApi)) {
            if (cancelled) return;
            setPageUrl(dynNonApi);
            setThemeBase(NONAPI_BASE);
            return;
          }

          setPageUrl(dynApi);
          setThemeBase(API_BASE);
        } else {
          navigate("/error", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/error", { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propPage, paramPage, location?.pathname, navigate]);

  if (!pageUrl || !themeBase) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflowY: "hidden",
        background: "#fff",
      }}
    >
      <ThemeInjector pageUrl={pageUrl} themeBaseUrl={themeBase} />
    </div>
  );
}
