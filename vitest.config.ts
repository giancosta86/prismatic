import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    setupFiles: ["@giancosta86/rigoletto/matchers"],

    testTimeout: 30_000,
    hookTimeout: 30_000,

    watch: false,

    coverage: {
      include: ["src/**/*"],
      exclude: ["**/index.ts", "**/*.test.ts", "**/*.spec.ts"],
    },
  },
});
