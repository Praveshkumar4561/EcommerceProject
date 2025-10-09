// ThemeIntegration.js
import axios from "axios";
import { toast } from "react-toastify";

const loadedAssets = {
  css: new Set(),
  js: new Set(),
};

const DEFAULT_TIMEOUT = 8000;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function fetchWithTimeout(url, opts = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const signal = controller.signal;
  const t = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...opts, signal })
    .finally(() => clearTimeout(t))
    .catch((err) => {
      // normalize fetch abort / network error to null result
      return null;
    });
}

export class ThemeIntegration {
  static clearThemeAssets() {
    if (!isBrowser()) return;
    try {
      document
        .querySelectorAll(
          'link[data-theme-asset="true"], script[data-theme-asset="true"]'
        )
        .forEach((el) => {
          try {
            el.remove();
          } catch {}
        });
    } catch (e) {
      console.warn(
        "[ThemeIntegration] clearThemeAssets failed to query/remove:",
        e
      );
    }
    loadedAssets.css.clear();
    loadedAssets.js.clear();
  }

  // Probe a URL with HEAD then GET fallback, with timeout and CORS-safe fallback
  static async probeUrl(url, timeout = 3000) {
    if (!isBrowser()) return { ok: false, status: 0 };
    try {
      // try HEAD first (fast) but many servers/CORS block HEAD; fallback to GET
      let res = null;
      try {
        res = await fetchWithTimeout(
          url,
          { method: "HEAD", cache: "no-cache" },
          timeout
        );
      } catch (e) {
        res = null;
      }
      if (!res || !res.ok) {
        try {
          res = await fetchWithTimeout(
            url,
            { method: "GET", cache: "no-cache" },
            timeout
          );
        } catch (e) {
          res = null;
        }
      }
      return { ok: !!res && res.ok, status: res ? res.status : 0 };
    } catch (err) {
      return { ok: false, status: 0 };
    }
  }

  // Make URL absolute relative to base (handles /-prefixed and relative urls)
  static makeAbsoluteUrl(url = "", base = "") {
    if (!isBrowser()) return url;
    if (!url) return url;
    try {
      // if already absolute
      const maybe = new URL(url, window.location.href);
      // if url param included a scheme (protocol) or starts with //, URL will parse origin
      if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:|^\/\//.test(url)) return maybe.href;
    } catch {}
    try {
      return new URL(url, base || window.location.origin).href;
    } catch {
      // fallback: join with base ensuring slash
      const b = (base || "").replace(/\/+$/, "") + "/";
      return b + url.replace(/^\/+/, "");
    }
  }

  // Load a single asset (css/js) with timeout, probe, uniqueness check, and resolves when loaded
  static loadAsset(
    url,
    type,
    { timeout = DEFAULT_TIMEOUT, skipProbe = false } = {}
  ) {
    return new Promise(async (resolve) => {
      if (!isBrowser()) return resolve({ ok: false, url, status: 0 });

      try {
        if (type !== "css" && type !== "js") {
          console.warn("[ThemeIntegration] Unsupported asset type:", type, url);
          return resolve({ ok: false, url, status: 0 });
        }

        // already loaded?
        if (loadedAssets[type].has(url)) {
          return resolve({ ok: true, url, status: 200 });
        }

        // Probe availability (optional)
        let probe = { ok: true, status: 200 };
        if (!skipProbe) {
          try {
            probe = await this.probeUrl(url, Math.min(timeout, 3000));
          } catch {
            probe = { ok: false, status: 0 };
          }
          // if probe fails, still attempt to load (some servers/CORS block HEAD)
        }

        const absUrl = this.makeAbsoluteUrl(url, window.location.origin);

        // prevent duplicate elements appended
        if (
          (type === "css" &&
            document.head.querySelector(`link[href="${absUrl}"]`)) ||
          (type === "js" &&
            document.body.querySelector(`script[src="${absUrl}"]`))
        ) {
          loadedAssets[type].add(url);
          return resolve({ ok: true, url: absUrl, status: 200 });
        }

        if (type === "css") {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = absUrl;
          link.setAttribute("data-theme-asset", "true");

          let settled = false;
          const done = (ok = true, status = probe.status || 200) => {
            if (settled) return;
            settled = true;
            loadedAssets.css.add(url);
            link.removeEventListener("load", onLoad);
            link.removeEventListener("error", onError);
            clearTimeout(timer);
            resolve({ ok, url: absUrl, status });
          };

          const onLoad = () => done(true, 200);
          const onError = (ev) => {
            console.error(`[ThemeIntegration] css load error ${absUrl}`, ev);
            done(false, probe.status || 0);
            try {
              toast.error?.(`Failed to load CSS: ${absUrl}`);
            } catch {}
          };

          link.addEventListener("load", onLoad);
          link.addEventListener("error", onError);

          // safety timeout
          const timer = setTimeout(() => {
            // treat as success if probe said OK (to be forgiving) else fail
            if (probe.ok) done(true, probe.status || 200);
            else done(false, probe.status || 0);
          }, timeout);

          try {
            document.head.appendChild(link);
          } catch (e) {
            clearTimeout(timer);
            resolve({ ok: false, url: absUrl, status: 0 });
          }
        } else if (type === "js") {
          const script = document.createElement("script");
          script.src = absUrl;
          // run scripts in order by default: set async false and await loaded promise
          script.async = false;
          script.setAttribute("data-theme-asset", "true");

          let settled = false;
          const done = (ok = true, status = probe.status || 200) => {
            if (settled) return;
            settled = true;
            loadedAssets.js.add(url);
            script.removeEventListener("load", onLoad);
            script.removeEventListener("error", onError);
            clearTimeout(timer);
            resolve({ ok, url: absUrl, status });
          };

          const onLoad = () => done(true, 200);
          const onError = (ev) => {
            console.error(`[ThemeIntegration] js load error ${absUrl}`, ev);
            done(false, probe.status || 0);
            try {
              toast.error?.(`Failed to load JS: ${absUrl}`);
            } catch {}
          };

          script.addEventListener("load", onLoad);
          script.addEventListener("error", onError);

          const timer = setTimeout(() => {
            if (probe.ok) done(true, probe.status || 200);
            else done(false, probe.status || 0);
          }, timeout);

          try {
            document.body.appendChild(script);
          } catch (e) {
            clearTimeout(timer);
            resolve({ ok: false, url: absUrl, status: 0 });
          }
        }
      } catch (err) {
        console.error("[ThemeIntegration] loadAsset error:", err);
        resolve({ ok: false, url, status: 0 });
      }
    });
  }

  // Temporarily override location methods to intercept same-origin navigations and use history + popstate
  static overrideLocationMethodsTemporary() {
    if (!isBrowser()) return () => {};
    if (window.__themePatchedTemp) return () => {};

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
      if (navGuard.last === u && now - navGuard.time < 800) return false;
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
        if (orig.hrefDesc) {
          Object.defineProperty(Location.prototype, "href", orig.hrefDesc);
        }
      } catch (e) {}
      window.__themePatchedTemp = false;
    };

    return restore;
  }

  // Attempt to detect theme base by probing likely paths
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
        const maybe = base.replace(/\/+$/, "") + "/index.html";
        const pBase = await this.probeUrl(base);
        if (pBase.ok) return base.replace(/\/$/, "") + "/";
        const pIdx = await this.probeUrl(maybe);
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

  // Apply theme by loading css/js lists, sequentially for predictable ordering
  static async applyThemeFromObject(themeData) {
    if (!themeData?.folder_name) return false;
    if (!isBrowser()) return false;

    try {
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

      // roiser / pesco / radios handling (unchanged but ensure trailing slashes)
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
        const pescoBase = `${pescoThemePath}/Main_File/Template/`;
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
        const radiosBase = `${folderName}/radios-html-package/Radios/`;
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

      // override location methods while loading theme to avoid full navigations
      let restoreLocation = () => {};
      try {
        restoreLocation = this.overrideLocationMethodsTemporary();
      } catch (e) {
        console.warn(
          "[ThemeIntegration] overrideLocationMethodsTemporary failed:",
          e
        );
      }

      // load CSS first (sequentially) to avoid flashes / layout jank
      for (const css of cssFiles) {
        try {
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
        } catch (e) {
          console.warn("[ThemeIntegration] css load threw:", css, e);
        }
      }

      // load JS sequentially (preserves dependencies like jQuery first)
      for (const js of jsFiles) {
        try {
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
        } catch (e) {
          console.warn("[ThemeIntegration] js load threw:", js, e);
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

  // Apply theme via backend-provided assets (css/js arrays), used by frontend UI
  static async applyThemeToFrontend(themeId) {
    if (!isBrowser()) return { success: false };
    try {
      this.clearThemeAssets();

      const response = await axios.get(
        `https://demo.webriefly.com/api/themes/${themeId}/assets`
      );
      const { css = [], js = [], html = null } = response.data || {};

      // load them sequentially to preserve ordering
      for (const url of Array.isArray(css) ? css : []) {
        await this.loadAsset(url, "css").catch((err) => {
          console.warn("Failed to load CSS asset:", url, err);
        });
      }

      for (const url of Array.isArray(js) ? js : []) {
        await this.loadAsset(url, "js").catch((err) => {
          console.warn("Failed to load JS asset:", url, err);
        });
      }

      return { success: true, html };
    } catch (error) {
      console.error("Error applying theme:", error);
      try {
        toast.error("Failed to apply theme. Please try again.");
      } catch {}
      throw error;
    }
  }

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
      } catch {}
      throw error;
    }
  }

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
      } catch {}
      throw new Error(errorMessage);
    }
  }
}
