import axios from "axios";
import { toast } from "react-toastify";

const loadedAssets = {
  css: new Set(),
  js: new Set(),
};

export class ThemeIntegration {
  static clearThemeAssets() {
    try {
      document
        .querySelectorAll(
          'link[data-theme-asset="true"], script[data-theme-asset="true"]'
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
  }

  static async probeUrl(url) {
    try {
      let res;
      try {
        res = await fetch(url, { method: "HEAD", cache: "no-cache" });
        if (!res || !res.ok) {
          res = await fetch(url, { method: "GET", cache: "no-cache" });
        }
      } catch (e) {
        res = await fetch(url, { method: "GET", cache: "no-cache" });
      }
      return { ok: !!res && res.ok, status: res ? res.status : 0 };
    } catch (err) {
      return { ok: false, status: 0 };
    }
  }

  static loadAsset(url, type) {
    return new Promise(async (resolve) => {
      if (loadedAssets[type].has(url))
        return resolve({ ok: true, url, status: 200 });

      const probe = await this.probeUrl(url);

      let el;
      if (type === "css") {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = url;
      } else if (type === "js") {
        el = document.createElement("script");
        el.src = url;
        el.async = false;
      } else {
        console.warn("[ThemeIntegration] Unsupported asset type:", type, url);
        return resolve({ ok: false, url, status: 0 });
      }

      el.dataset.themeAsset = "true";

      const onLoaded = () => {
        loadedAssets[type].add(url);
        el.removeEventListener("load", onLoaded);
        el.removeEventListener("error", onError);
        resolve({ ok: true, url, status: 200 });
      };
      const onError = (ev) => {
        const msg = `Failed to load ${type}: ${url} (probe status: ${
          probe.status || "unknown"
        })`;
        console.error(msg, ev);
        try {
          toast.error?.(msg);
        } catch (e) {}
        el.removeEventListener("load", onLoaded);
        el.removeEventListener("error", onError);
        resolve({ ok: false, url, status: probe.status || 0 });
      };

      el.addEventListener("load", onLoaded);
      el.addEventListener("error", onError);

      if (type === "css") document.head.appendChild(el);
      else document.body.appendChild(el);
    });
  }

  static overrideLocationMethodsTemporary() {
    if (typeof window === "undefined") return () => {};
    const orig = {
      assign: window.location.assign?.bind(window.location),
      replace: window.location.replace?.bind(window.location),
      reload: window.location.reload?.bind(window.location),
      hrefDesc: null,
      patched: !!window.__themePatchedTemp,
    };
    try {
      orig.hrefDesc = Object.getOwnPropertyDescriptor(
        Location.prototype,
        "href"
      );
    } catch (e) {
      orig.hrefDesc = null;
    }

    if (orig.patched) {
      return () => {};
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
        if (orig.hrefDesc) {
          Object.defineProperty(Location.prototype, "href", orig.hrefDesc);
        }
      } catch (e) {}
      window.__themePatchedTemp = false;
    };

    return restore;
  }

  static async detectThemeBase(folderName) {
    if (!folderName) return null;
    const backendHostDirect = "http://147.93.45.171:1600";

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
          `http://srv689968.hstgr.cloud/themes/static/${fn}/roiser-html-package/roiser`
        );
        allCandidates.push(`/themes/static/${fn}/roiser-html-package/roiser`);
        allCandidates.push(
          `${backendHostDirect}/themes/static/${fn}/roiser-html-package/roiser/`
        );
      }
      allCandidates.push(`http://srv689968.hstgr.cloud/themes/static/${fn}`);
      allCandidates.push(`/themes/static/${fn}`);
      allCandidates.push(`${backendHostDirect}/themes/static/${fn}`);
    }

    for (const base of allCandidates) {
      try {
        const idx = `${base.replace(/\/$/, "")}/index.html`;
        const pBase = await this.probeUrl(base);
        if (pBase.ok) return base.replace(/\/$/, "") + "/";
        const pIdx = await this.probeUrl(idx);
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

  static async applyThemeFromObject(themeData) {
    if (!themeData?.folder_name) return false;

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

      let restoreLocation = () => {};
      try {
        restoreLocation = this.overrideLocationMethodsTemporary();
      } catch (e) {
        console.warn(
          "[ThemeIntegration] overrideLocationMethodsTemporary failed:",
          e
        );
      }

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

  static async applyThemeToFrontend(themeId) {
    try {
      this.clearThemeAssets();

      const response = await axios.get(
        `http://147.93.45.171:1600/themes/${themeId}/assets`
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

      const jsPromises = Array.isArray(js)
        ? js.map((url) =>
            this.loadAsset(url, "js").catch((err) => {
              console.warn("Failed to load JS asset:", url, err);
              return null;
            })
          )
        : [];

      await Promise.all([...cssPromises, ...jsPromises]);

      return { success: true, html };
    } catch (error) {
      console.error("Error applying theme:", error);
      toast.error("Failed to apply theme. Please try again.");
      throw error;
    }
  }

  static async getThemeAssets(themeId) {
    try {
      const response = await axios.get(
        `http://147.93.45.171:1600/themes/${themeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting theme assets:", error);
      toast.error("Failed to load theme assets");
      throw error;
    }
  }

  static async validateTheme(themeZip) {
    try {
      const formData = new FormData();
      formData.append("theme", themeZip);

      const response = await axios.post(
        "http://147.93.45.171:1600/themes/validate",
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
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
