import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // Base JavaScript rules
  js.configs.recommended,

  // Add browser globals
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // React rules
  {
    files: ["**/*.{jsx,js}"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
  },

  // Jest test files configuration
  {
    files: ["**/*.test.{js,mjs,cjs,jsx}", "**/__tests__/**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest globals
        ...globals.node, // Add Node globals (for 'process')
      },
    },
  },
];
