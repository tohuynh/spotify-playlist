//https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1195411734
const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");
const pluginTailwindcss = require("prettier-plugin-tailwindcss");
const pluginPrisma = require("prettier-plugin-prisma");

/** @type {import("prettier").Parser}  */
const myParser = {
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
};

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    typescript: myParser,
  },
};

module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: [myPlugin, pluginPrisma],
  importOrder: ["^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
