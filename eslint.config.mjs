import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      // Handoff source-of-truth files are not project source
      "brand/**",
      "design/**",
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
