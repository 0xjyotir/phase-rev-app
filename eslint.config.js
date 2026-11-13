// ESLint flat config — Expo's recommended rules + a few house rules.
// Run with: npm run lint
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    // Jest globals (describe / it / expect) in *.test.js files
    files: ["**/*.test.js"],
    languageOptions: { globals: { ...require("globals").jest } },
  },
  {
    // Teach eslint-plugin-import about the "@/…" and "@assets/…" aliases in jsconfig.json
    settings: {
      "import/resolver": {
        typescript: { project: "./jsconfig.json" },
        node: true,
      },
    },
    rules: {
      // Keep imports clean: unused variables are almost always a leftover.
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Prefer the app's own logger-free code; console is fine for dev warnings only.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
