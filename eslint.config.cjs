/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  ...nextCoreWebVitals,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": "warn",
      "import/no-unresolved": "off",
      "import/no-relative-parent-imports": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-sync-scripts": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js"],
        },
      },
    },
  },
];
