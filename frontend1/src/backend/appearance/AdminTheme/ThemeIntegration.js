import axios from "axios";
import { toast } from "react-toastify";

const loadedAssets = {
  css: new Set(),
  js: new Set(),
};

export class ThemeIntegration {
  static clearThemeAssets() {
    document
      .querySelectorAll('link[data-theme-asset="true"]')
      .forEach((link) => {
        document.head.removeChild(link);
      });

    loadedAssets.css.clear();
    loadedAssets.js.clear();
  }

  static loadAsset(url, type) {
    return new Promise((resolve, reject) => {
      if (loadedAssets[type].has(url)) {
        return resolve();
      }

      let element;

      if (type === "css") {
        element = document.createElement("link");
        element.rel = "stylesheet";
        element.href = url;
        element.dataset.themeAsset = "true";
      } else if (type === "js") {
        element = document.createElement("script");
        element.src = url;
        element.async = true;
        element.dataset.themeAsset = "true";
      } else {
        return reject(new Error(`Unsupported asset type: ${type}`));
      }

      element.onload = () => {
        loadedAssets[type].add(url);
        resolve();
      };

      element.onerror = () => {
        console.error(`Failed to load ${type} asset:`, url);
        reject(new Error(`Failed to load ${type} asset: ${url}`));
      };

      if (type === "css") {
        document.head.appendChild(element);
      } else {
        document.body.appendChild(element);
      }
    });
  }

  static async applyThemeToFrontend(themeId) {
    try {
      this.clearThemeAssets();

      const response = await axios.get(
        `http://147.93.45.171:1600/themes/${themeId}/assets`
      );
      const { css = [], js = [], html = null } = response.data;

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

  static async applyThemeFromObject(themeData) {
    if (!themeData || !themeData.folder_name) {
      console.error("Invalid theme data", themeData);
      return false;
    }

    try {
      this.clearThemeAssets();

      const folderName = themeData.folder_name;

      let actualThemePath = folderName;
      if (
        folderName.toLowerCase().includes("roiser") &&
        !folderName.includes("2025-06-12")
      ) {
        actualThemePath = `${folderName}-2025-06-12-15-16-08-utc`;
      }

      // console.log("Using theme path in ThemeIntegration:", actualThemePath);

      const backendUrl = "http://147.93.45.171:1600";

      let themeBasePath = "";
      let cssFiles = [];
      let jsFiles = [];

      // console.log("Theme path in ThemeIntegration:", actualThemePath);

      if (actualThemePath.toLowerCase().includes("roiser")) {
        themeBasePath = `${backendUrl}/themes/static/${actualThemePath}/roiser-html-package/roiser`;

        cssFiles = [
          `${themeBasePath}/assets/css/bootstrap.min.css`,
          `${themeBasePath}/assets/css/fontawesome.min.css`,
          `${themeBasePath}/assets/css/main.css`,
          `${themeBasePath}/assets/css/nice-select.css`,
          `${themeBasePath}/assets/css/odometer.min.css`,
          `${themeBasePath}/assets/css/swiper.min.css`,
          `${themeBasePath}/assets/css/venobox.min.css`,
        ];

        jsFiles = [
          `${themeBasePath}/assets/js/vendor/bootstrap-bundle.js`,
          `${themeBasePath}/assets/js/vendor/countdown.js`,
          `${themeBasePath}/assets/js/vendor/gsap.min.js`,
          `${themeBasePath}/assets/js/vendor/imagesloaded-pkgd.js`,
          `${themeBasePath}/assets/js/vendor/jquary-3.6.0.min.js`,
          `${themeBasePath}/assets/js/vendor/jquery.isotope.js`,
          `${themeBasePath}/assets/js/vendor/meanmenu.js`,
          `${themeBasePath}/assets/js/vendor/swiper.min.js`,
          `${themeBasePath}/assets/js/vendor/nice-select.js`,
          `${themeBasePath}/assets/js/vendor/waypoints.min.js`,
          `${themeBasePath}/assets/js/vendor/odometer.min.js`,
          `${themeBasePath}/assets/js/vendor/venobox.min.js`,
          `${themeBasePath}/assets/js/vendor/wow.min.js`,
          `${themeBasePath}/assets/js/vendor/split-type.min.js`,
          `${themeBasePath}/assets/js/vendor/scroll-trigger.min.js`,
          `${themeBasePath}/assets/js/vendor/smooth-scroll.js`,
          `${themeBasePath}/assets/js/ajax-form.js`,
          `${themeBasePath}/assets/js/contact.js`,
          `${themeBasePath}/assets/js/main.js`,
        ];
      } else if (actualThemePath.toLowerCase().includes("pesco")) {
        const pescoThemePath =
          "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc";
        themeBasePath = `${backendUrl}/themes/static/${pescoThemePath}/Main_File/Template`;

        cssFiles = [
          `${themeBasePath}/assets/vendor/bootstrap/css/bootstrap.min.css`,
          `${themeBasePath}/assets/vendor/nice-select/css/nice-select.css`,
          `${themeBasePath}/assets/vendor/magnific-popup/dist/magnific-popup.css`,
          `${themeBasePath}/assets/css/style.css`,
          `${themeBasePath}/assets/vendor/slick/slick.css`,
          `${themeBasePath}/assets/vendor/aos/aos.css`,
        ];

        jsFiles = [
          `${themeBasePath}/assets/vendor/jquery-3.7.1.min.js`,
          `${themeBasePath}/assets/vendor/slick/slick.min.js`,
          `${themeBasePath}/assets/vendor/nice-select/js/jquery.nice-select.min.js`,
          `${themeBasePath}/assets/vendor/isotope.min.js`,
          `${themeBasePath}/assets/vendor/imagesloaded.min.js`,
          `${themeBasePath}/assets/vendor/magnific-popup/dist/jquery.magnific-popup.min.js`,
          `${themeBasePath}/assets/vendor/aos/aos.js`,
          `${themeBasePath}/assets/vendor/simplyCountdown.min.js`,
          `${themeBasePath}/assets/js/theme.js`,
        ];
      } else if (actualThemePath.toLowerCase().includes("radios")) {
        themeBasePath = `${backendUrl}/themes/static/${actualThemePath}/radios-html-package/Radios`;

        cssFiles = [
          `${themeBasePath}/assets/css/bootstrap.min.css`,
          `${themeBasePath}/assets/css/animate.css`,
          `${themeBasePath}/assets/css/fontawesome.css`,
          `${themeBasePath}/assets/css/swiper.min.css`,
          `${themeBasePath}/assets/css/slick.css`,
        ];

        jsFiles = [
          `${themeBasePath}/assets/js/jquery-3.5.1.min.js`,
          `${themeBasePath}/assets/js/bootstrap.bundle.min.js`,
          `${themeBasePath}/assets/js/swiper.min.js`,
          `${themeBasePath}/assets/js/main.js`,
        ];
      } else {
        console.warn("Unknown theme structure, using fallback paths");
        themeBasePath = `${backendUrl}/themes/static/${actualThemePath}`;

        cssFiles = [
          `${themeBasePath}/assets/css/style.css`,
          `${themeBasePath}/css/style.css`,
          `${themeBasePath}/style.css`,
        ];

        jsFiles = [
          `${themeBasePath}/assets/js/main.js`,
          `${themeBasePath}/js/main.js`,
          `${themeBasePath}/main.js`,
        ];
      }

      for (const cssFile of cssFiles) {
        await this.loadAsset(cssFile, "css").catch((err) => {
          console.error("Failed to load CSS:", cssFile, err);
        });
      }

      for (const jsFile of jsFiles) {
        await this.loadAsset(jsFile, "js").catch((err) => {
          console.error("Failed to load JS:", jsFile, err);
        });
      }

      return true;
    } catch (error) {
      console.error("Error applying theme from object:", error);
      throw error;
    }
  }
}
