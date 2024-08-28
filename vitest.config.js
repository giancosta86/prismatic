"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        testTimeout: 30000,
        hookTimeout: 30000,
        watch: false,
        coverage: {
            include: ["src/**/*"],
            exclude: ["**/index.ts", "**/*.test.ts", "**/*.spec.ts"]
        }
    }
});
