const postcssImport = require("postcss-import");
const purgecss = require("@fullhuman/postcss-purgecss").default;
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const path = require("path");

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
              "../backend/themes/**/*.html", // all backend theme files
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
              /^dropdown-/,
              /^fade/,
              /^collapse/,
              /^tooltip-/,
              /^popover-/,
            ],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          }),
          cssnano({
            preset: "default",
          }),
        ]
      : []),
  ],
};
