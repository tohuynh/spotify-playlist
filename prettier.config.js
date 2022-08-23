module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("@trivago/prettier-plugin-sort-imports"),
  ],
  importOrder: ["^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
