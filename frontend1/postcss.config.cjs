const postcssImport = require("postcss-import");
const purgecss = require("@fullhuman/postcss-purgecss").default;
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const enablePurge =
  process.env.PURGE === "true" || process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    postcssImport(),
    autoprefixer(),
    ...(enablePurge
      ? [
          purgecss({
            content: [
              "./index.html",
              "./src/**/*.{js,jsx,ts,tsx}",
              "../backend/themes/static/roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser/**/*.html",
            ],
            safelist: [
              /^btn-/,
              /^modal-/,
              /^carousel-/,
              /^owl-/,
              "active",
              "open",
              "show",
              "collapsed",
            ],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          }),
          cssnano({ preset: "default" }),
        ]
      : []),
  ],
};
