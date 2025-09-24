const purgecss = require("@fullhuman/postcss-purgecss").default;
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    autoprefixer,
    ...(process.env.NODE_ENV === "production"
      ? [
          purgecss({
            content: ["./index.html", "./src/**/*.jsx", "./src/**/*.js"],
            safelist: [/^btn-/, "active"],
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          }),
        ]
      : []),
  ],
};
