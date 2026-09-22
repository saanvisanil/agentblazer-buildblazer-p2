import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**"],
    rules: {
      // Initial local-storage and API reads legitimately update client state.
      "react-hooks/set-state-in-effect": "off",
      // Team images are served through a secure same-origin proxy, so they
      // cannot use Next's static image optimizer.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
