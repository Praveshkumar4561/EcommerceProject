// ThemeIntegration.js
import axios from "axios";
import { toast } from "react-toastify";

/**
 * ThemeIntegration
 * - safer asset loading (probe + timeouts)
 * - dedupe loaded assets
 * - clearThemeAssets now removes preload links too
 * - optional preload helper for LCP images
 * - small robustness improvements to overrideLocationMethodsTemporary
 */

const loadedAssets = {
  css: new Set(),
  js: new Set(),
  preload: new Set(),
};

const DEFAULT_PROBE_TIMEOUT = 3000; // ms for HEAD/GET probe
const DEFAULT_ASSET_TIMEOUT = 8000; // ms for asset load

export class ThemeIntegration {
  // remove previously injected assets (styles, scripts, preload links)
  static clearThemeAssets() {
    try {
      document
        .querySelectorAll(
          'link[data-theme-asset="true"], link[data-theme-preload="true"], script[data-theme-asset="true"]'
        )
        .forEach((el) => el.remove());
    } catch (e) {
      console.warn(
        "[ThemeIntegration] clearThemeAssets failed to query/remove:",
        e
      );
    }
    loadedAssets.css.clear();
    loadedAssets.js.clear();
    loadedAssets.preload.clear();
  }

  // probe a URL quickly (HEAD preferred, fallback to GET). Uses AbortController if available.
  static async probeUrl(url, timeoutMs = DEFAULT_PROBE_TIMEOUT) {
    if (!url) return { ok: false, status: 0 };
    // fallback if AbortController not available
    const makeFetch = async (method, controller) => {
      try {
        const init = { method, cache: "no-cache" };
        if (controller) init.signal = controller.signal;
        const res = await fetch(url, init).catch(() => null);
        return res;
      } catch {
        return null;
      }
    };

    let controller;
    try {
      controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      if (controller) setTimeout(() => controller.abort(), timeoutMs);
      let res = await makeFetch("HEAD", controller);
      if (!res || !res.ok) {
        // some servers block HEAD -> try GET
        if (controller) {
          try {
            controller.abort();
          } catch {}
          controller =
            typeof AbortController !== "undefined"
              ? new AbortController()
              : null;
          if (controller) setTimeout(() => controller.abort(), timeoutMs);
        }
        res = await makeFetch("GET", controller);
      }
      return { ok: !!res && res.ok, status: res ? res.status : 0 };
    } catch (err) {
      return { ok: false, status: 0 };
    } finally {
      try {
        if (controller && controller.abort) controller.abort();
      } catch {}
    }
  }

  // add a preload for a resource (useful for LCP). deduped.
  static addPreload(href, as = "image", crossorigin = false) {
    if (!href) return false;
    try {
      if (loadedAssets.preload.has(href)) return true;
      if (document.head.querySelector(`link[rel="preload"][href="${href}"]`)) {
        loadedAssets.preload.add(href);
        return true;
      }
      const l = document.createElement("link");
      l.rel = "preload";
      l.as = as;
      l.href = href;
      if (crossorigin) l.crossOrigin = "anonymous";
      l.dataset.themePreload = "true";
      l.dataset.themeAsset = "true";
      document.head.appendChild(l);
      loadedAssets.preload.add(href);
      return true;
    } catch (e) {
      console.warn("[ThemeIntegration] addPreload failed:", e);
      return false;
    }
  }

  // load an individual CSS/JS asset with dedupe, probe and load timeout
  static loadAsset(url, type, options = {}) {
    const timeoutMs = options.timeout || DEFAULT_ASSET_TIMEOUT;
    const crossorigin = !!options.crossorigin;
    return new Promise(async (resolve) => {
      if (!url)
        return resolve({ ok: false, url, status: 0, reason: "missing-url" });

      // return early if already loaded
      if (loadedAssets[type] && loadedAssets[type].has(url))
        return resolve({ ok: true, url, status: 200, deduped: true });

      // probe quickly (not strict blocker, just for diagnostics)
      const probe = await this.probeUrl(url, Math.min(2000, timeoutMs)).catch(
        () => ({ ok: false, status: 0 })
      );

      let el;
      if (type === "css") {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = url;
        if (crossorigin) el.crossOrigin = "anonymous";
      } else if (type === "js") {
        el = document.createElement("script");
        el.src = url;
        // keep execution order expected by many themes
        el.async = false;
        if (crossorigin) el.crossOrigin = "anonymous";
      } else {
        console.warn("[ThemeIntegration] Unsupported asset type:", type, url);
        return resolve({
          ok: false,
          url,
          status: 0,
          reason: "unsupported-type",
        });
      }

      el.dataset.themeAsset = "true";

      let finished = false;
      const finish = (result) => {
        if (finished) return;
        finished = true;
        try {
          el.removeEventListener("load", onLoad);
          el.removeEventListener("error", onError);
        } catch {}
        resolve(result);
      };

      const onLoad = () => {
        loadedAssets[type].add(url);
        finish({ ok: true, url, status: 200 });
      };

      const onError = (ev) => {
        const msg = `Failed to load ${type}: ${url} (probe status: ${
          probe?.status || "unknown"
        })`;
        console.error("[ThemeIntegration] " + msg, ev);
        try {
          toast.error?.(msg);
        } catch (e) {}
        finish({ ok: false, url, status: probe?.status || 0 });
      };

      el.addEventListener("load", onLoad);
      el.addEventListener("error", onError);

      // Append to DOM
      try {
        if (type === "css") document.head.appendChild(el);
        else document.body.appendChild(el);
      } catch (e) {
        onError(e);
        return;
      }

      // Timeout guard
      setTimeout(() => {
        if (finished) return;
        const msg = `Asset load timeout (${timeoutMs}ms): ${url}`;
        console.warn("[ThemeIntegration] " + msg);
        try {
          toast.error?.(msg);
        } catch (e) {}
        finish({ ok: false, url, status: 0, reason: "timeout" });
      }, timeoutMs);
    });
  }

  // convenience to load array of assets; for js keep caller to control order if needed
  static async loadAssetsBatch(list = [], type = "css", opts = {}) {
    const results = [];
    if (!Array.isArray(list)) return results;
    for (const u of list) {
      try {
        const r = await this.loadAsset(u, type, opts);
        results.push(r);
      } catch (e) {
        results.push({ ok: false, url: u, status: 0 });
      }
    }
    return results;
  }

  // override location methods temporarily to prevent theme scripts from navigating away
  static overrideLocationMethodsTemporary() {
    if (typeof window === "undefined") return () => {};
    const already = !!window.__themePatchedTemp;
    if (already) return () => {};

    const orig = {
      assign: window.location.assign?.bind(window.location),
      replace: window.location.replace?.bind(window.location),
      reload: window.location.reload?.bind(window.location),
      hrefDesc: null,
    };
    try {
      orig.hrefDesc = Object.getOwnPropertyDescriptor(
        Location.prototype,
        "href"
      );
    } catch (e) {
      orig.hrefDesc = null;
    }

    window.__themePatchedTemp = true;

    const navGuard = { last: null, time: 0 };
    const guard = (u) => {
      const now = Date.now();
      if (navGuard.last === u && now - navGuard.time < 1000) return false;
      navGuard.last = u;
      navGuard.time = now;
      return true;
    };

    try {
      Object.defineProperty(window.location, "reload", {
        configurable: true,
        value: function () {
          try {
            const path = window.location.pathname + window.location.search;
            if (guard(path)) {
              window.history.replaceState({}, "", path);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }
          } catch (e) {
            if (orig.reload) return orig.reload();
          }
        },
      });
    } catch (e) {}

    try {
      Object.defineProperty(window.location, "assign", {
        configurable: true,
        value: function (url) {
          try {
            const u = new URL(url, window.location.origin);
            if (
              u.origin === window.location.origin &&
              guard(u.pathname + (u.search || ""))
            ) {
              window.history.pushState({}, "", u.pathname + (u.search || ""));
              window.dispatchEvent(new PopStateEvent("popstate"));
              return;
            }
          } catch (e) {}
          if (orig.assign) return orig.assign(url);
          window.open(url, "_self");
        },
      });
    } catch (e) {}

    try {
      Object.defineProperty(window.location, "replace", {
        configurable: true,
        value: function (url) {
          try {
            const u = new URL(url, window.location.origin);
            if (
              u.origin === window.location.origin &&
              guard(u.pathname + (u.search || ""))
            ) {
              window.history.replaceState(
                {},
                "",
                u.pathname + (u.search || "")
              );
              window.dispatchEvent(new PopStateEvent("popstate"));
              return;
            }
          } catch (e) {}
          if (orig.replace) return orig.replace(url);
          window.open(url, "_self");
        },
      });
    } catch (e) {}

    try {
      Object.defineProperty(Location.prototype, "href", {
        configurable: true,
        enumerable: true,
        get() {
          return orig.hrefDesc?.get
            ? orig.hrefDesc.get.call(window.location)
            : window.location.toString();
        },
        set(val) {
          try {
            if (typeof val === "string") {
              const u = new URL(val, window.location.origin);
              if (
                u.origin === window.location.origin &&
                guard(u.pathname + (u.search || ""))
              ) {
                window.history.pushState({}, "", u.pathname + (u.search || ""));
                window.dispatchEvent(new PopStateEvent("popstate"));
                return;
              }
            }
          } catch (e) {}
          if (orig.hrefDesc?.set)
            return orig.hrefDesc.set.call(window.location, val);
          if (orig.assign) return orig.assign(val);
          window.open(val, "_self");
        },
      });
    } catch (e) {}

    const restore = () => {
      try {
        if (orig.assign) window.location.assign = orig.assign;
      } catch (e) {}
      try {
        if (orig.replace) window.location.replace = orig.replace;
      } catch (e) {}
      try {
        if (orig.reload) window.location.reload = orig.reload;
      } catch (e) {}
      try {
        if (orig.hrefDesc)
          Object.defineProperty(Location.prototype, "href", orig.hrefDesc);
      } catch (e) {}
      window.__themePatchedTemp = false;
    };

    return restore;
  }

  // try to detect base folder for a theme (kept logic with probes)
  static async detectThemeBase(folderName) {
    if (!folderName) return null;
    const backendHostDirect = "https://demo.webriefly.com/api";

    const nameVariants = [
      folderName,
      folderName.replace(/\s+/g, "-"),
      folderName.replace(/\s+/g, "_"),
      folderName.replace(/\s+/g, "").toLowerCase(),
      folderName.toLowerCase(),
    ].filter(Boolean);

    const allCandidates = [];
    for (const fn of nameVariants) {
      if (fn.toLowerCase().includes("roiser")) {
        allCandidates.push(
          `https://demo.webriefly.com/api/themes/static/${fn}/roiser-html-package/roiser`
        );
        allCandidates.push(`/themes/static/${fn}/roiser-html-package/roiser`);
        allCandidates.push(
          `${backendHostDirect}/themes/static/${fn}/roiser-html-package/roiser/`
        );
      }
      allCandidates.push(`https://demo.webriefly.com/api/themes/static/${fn}`);
      allCandidates.push(`/themes/static/${fn}`);
      allCandidates.push(`${backendHostDirect}/themes/static/${fn}`);
    }

    for (const base of allCandidates) {
      try {
        const idx = `${base.replace(/\/$/, "")}/index.html`;
        const pBase = await this.probeUrl(base, 2000);
        if (pBase.ok) return base.replace(/\/$/, "") + "/";
        const pIdx = await this.probeUrl(idx, 2000);
        if (pIdx.ok) return base.replace(/\/$/, "") + "/";
      } catch (e) {
        console.warn(
          "[ThemeIntegration] detectThemeBase probe error for",
          base,
          e
        );
      }
    }
    return null;
  }

  // apply a theme object (loads CSS then JS in order; returns status)
  static async applyThemeFromObject(themeData) {
    if (!themeData?.folder_name) return false;

    try {
      // clear old assets
      this.clearThemeAssets();
      const folderName = themeData.folder_name;

      const detectedBase = await this.detectThemeBase(folderName);
      const themeBasePath =
        detectedBase ||
        (folderName && folderName.toLowerCase().includes("roiser")
          ? `/themes/static/${folderName}/roiser-html-package/roiser/assets/`
          : `/themes/static/${folderName}/`);

      console.debug("[ThemeIntegration] themeBasePath =", themeBasePath);

      let cssFiles = [`${themeBasePath}assets/css/main.css`];
      let jsFiles = [`${themeBasePath}assets/js/main.js`];

      if (folderName.toLowerCase().includes("roiser")) {
        cssFiles = [
          `${themeBasePath}assets/css/bootstrap.min.css`,
          `${themeBasePath}assets/css/fontawesome.min.css`,
          `${themeBasePath}assets/css/main.css`,
          `${themeBasePath}assets/css/nice-select.css`,
          `${themeBasePath}assets/css/odometer.min.css`,
          `${themeBasePath}assets/css/swiper.min.css`,
          `${themeBasePath}assets/css/venobox.min.css`,
        ];
        jsFiles = [
          `${themeBasePath}assets/js/vendor/bootstrap-bundle.js`,
          `${themeBasePath}assets/js/vendor/countdown.js`,
          `${themeBasePath}assets/js/vendor/gsap.min.js`,
          `${themeBasePath}assets/js/vendor/imagesloaded-pkgd.js`,
          `${themeBasePath}assets/js/vendor/jquary-3.6.0.min.js`,
          `${themeBasePath}assets/js/vendor/jquery.isotope.js`,
          `${themeBasePath}assets/js/vendor/meanmenu.js`,
          `${themeBasePath}assets/js/vendor/swiper.min.js`,
          `${themeBasePath}assets/js/vendor/nice-select.js`,
          `${themeBasePath}assets/js/vendor/waypoints.min.js`,
          `${themeBasePath}assets/js/vendor/odometer.min.js`,
          `${themeBasePath}assets/js/vendor/venobox.min.js`,
          `${themeBasePath}assets/js/vendor/wow.min.js`,
          `${themeBasePath}assets/js/vendor/split-type.min.js`,
          `${themeBasePath}assets/js/vendor/scroll-trigger.min.js`,
          `${themeBasePath}assets/js/vendor/smooth-scroll.js`,
          `${themeBasePath}assets/js/ajax-form.js`,
          `${themeBasePath}assets/js/contact.js`,
          `${themeBasePath}assets/js/main.js`,
        ];
      }

      if (folderName.toLowerCase().includes("pesco")) {
        const pescoThemePath =
          "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc";
        const pescoBase = `${pescoThemePath}/Main_File/Template`;
        cssFiles = [
          `${pescoBase}assets/vendor/bootstrap/css/bootstrap.min.css`,
          `${pescoBase}assets/vendor/nice-select/css/nice-select.css`,
          `${pescoBase}assets/vendor/magnific-popup/dist/magnific-popup.css`,
          `${pescoBase}assets/css/style.css`,
          `${pescoBase}assets/vendor/slick/slick.css`,
          `${pescoBase}assets/vendor/aos/aos.css`,
        ];
        jsFiles = [
          `${pescoBase}assets/vendor/jquery-3.7.1.min.js`,
          `${pescoBase}assets/vendor/slick/slick.min.js`,
          `${pescoBase}assets/vendor/nice-select/js/jquery.nice-select.min.js`,
          `${pescoBase}assets/vendor/isotope.min.js`,
          `${pescoBase}assets/vendor/imagesloaded.min.js`,
          `${pescoBase}assets/vendor/magnific-popup/dist/jquery.magnific-popup.min.js`,
          `${pescoBase}assets/vendor/aos/aos.js`,
          `${pescoBase}assets/vendor/simplyCountdown.min.js`,
          `${pescoBase}assets/vendor/theme.js`,
        ];
      } else if (folderName.toLowerCase().includes("radios")) {
        const radiosBase = `${folderName}/radios-html-package/Radios`;
        cssFiles = [
          `${radiosBase}assets/css/bootstrap.min.css`,
          `${radiosBase}assets/css/animate.css`,
          `${radiosBase}assets/css/flaticon.css`,
          `${radiosBase}assets/css/fontawesome.css`,
          `${radiosBase}assets/css/magnific-popup.css`,
          `${radiosBase}assets/css/main.css`,
          `${radiosBase}assets/css/metisMenu.css`,
          `${radiosBase}assets/css/slick.css`,
          `${radiosBase}assets/css/uikit.min.css`,
          `${radiosBase}assets/css/jquery-ui.css`,
          `${radiosBase}assets/css/swiper.min.css`,
        ];
        jsFiles = [
          `${radiosBase}assets/js/jquery-3.5.1.min.js`,
          `${radiosBase}assets/js/bootstrap.bundle.min.js`,
          `${radiosBase}assets/js/swiper.min.js`,
          `${radiosBase}assets/js/main.js`,
        ];
      }

      // temporarily override window.location methods to prevent theme scripts from navigating away
      let restoreLocation = () => {};
      try {
        restoreLocation = this.overrideLocationMethodsTemporary();
      } catch (e) {
        console.warn(
          "[ThemeIntegration] overrideLocationMethodsTemporary failed:",
          e
        );
      }

      // load CSS files (in sequence or parallel as you prefer; here sequential to avoid flash-of-unstyled for some cases)
      for (const css of cssFiles) {
        const res = await this.loadAsset(css, "css");
        if (!res.ok) {
          console.warn(
            "[ThemeIntegration] css failed:",
            res.url,
            "status:",
            res.status
          );
        } else {
          console.debug("[ThemeIntegration] css loaded:", res.url);
        }
      }

      // load JS files serially to preserve expected order
      for (const js of jsFiles) {
        const res = await this.loadAsset(js, "js");
        if (!res.ok) {
          console.warn(
            "[ThemeIntegration] js failed:",
            res.url,
            "status:",
            res.status
          );
        } else {
          console.debug("[ThemeIntegration] js loaded:", res.url);
        }
      }

      try {
        restoreLocation();
      } catch (e) {
        console.warn("[ThemeIntegration] restoreLocation failed:", e);
      }

      return true;
    } catch (error) {
      console.error("[ThemeIntegration] Error applying theme:", error);
      throw error;
    }
  }

  // apply theme via API that returns lists of css/js/html
  static async applyThemeToFrontend(themeId) {
    try {
      this.clearThemeAssets();

      const response = await axios.get(
        `https://demo.webriefly.com/api/themes/${themeId}/assets`
      );
      const { css = [], js = [], html = null } = response.data || {};

      const cssPromises = Array.isArray(css)
        ? css.map((url) =>
            this.loadAsset(url, "css").catch((err) => {
              console.warn("Failed to load CSS asset:", url, err);
              return null;
            })
          )
        : [];

      // load JS serially to preserve order
      const jsResults = [];
      if (Array.isArray(js)) {
        for (const url of js) {
          try {
            const r = await this.loadAsset(url, "js");
            jsResults.push(r);
          } catch (e) {
            console.warn("Failed to load JS asset:", url, e);
            jsResults.push({ ok: false, url });
          }
        }
      }

      // await CSS parallel loads
      await Promise.all(cssPromises);

      return { success: true, html };
    } catch (error) {
      console.error("Error applying theme:", error);
      try {
        toast.error("Failed to apply theme. Please try again.");
      } catch (e) {}
      throw error;
    }
  }

  // fetch theme metadata
  static async getThemeAssets(themeId) {
    try {
      const response = await axios.get(
        `https://demo.webriefly.com/api/themes/${themeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting theme assets:", error);
      try {
        toast.error("Failed to load theme assets");
      } catch (e) {}
      throw error;
    }
  }

  // validate theme zip via API
  static async validateTheme(themeZip) {
    try {
      const formData = new FormData();
      formData.append("theme", themeZip);

      const response = await axios.post(
        "https://demo.webriefly.com/api/themes/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.valid) {
        throw new Error(response.data.error || "Invalid theme package");
      }

      return response.data;
    } catch (error) {
      console.error("Error validating theme:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to validate theme";
      try {
        toast.error(errorMessage);
      } catch (e) {}
      throw new Error(errorMessage);
    }
  }
}
