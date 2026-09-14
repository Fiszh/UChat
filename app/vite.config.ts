import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { execSync } from "node:child_process";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import pkg from "./package.json" with { type: "json" };

const commitHash = execSync("git rev-parse HEAD").toString().trim();
const repoUrl = execSync("git remote get-url origin")
    .toString()
    .trim()
    .replace(/\.git$/, "");

const isDebug = process.argv.includes("--debug");

const isProdBuild = process.env.SENTRY_UPLOAD == "1";

console.log(
    isProdBuild
        ? "Sending source map to BetterStack!"
        : "Not sending source map to BetterStack...",
    isProdBuild,
);

export default defineConfig({
    envDir: ".",
    envPrefix: "PUBLIC_",
    build: { sourcemap: true },
    plugins: [
        sveltekit(),
        ...(isProdBuild
            ? [
                  sentryVitePlugin({
                      org: process.env.SENTRY_ORG,
                      project: process.env.SENTRY_PROJECT,
                      url: process.env.SENTRY_URL,
                      authToken: process.env.BETTER_STACK_API_TOKEN,
                      telemetry: false,
                  }),
              ]
            : []),
    ],
    preview: {
        allowedHosts: [".unii.dev", "unii.dev", "localhost"],
    },
    server: {
        allowedHosts: [".unii.dev", "unii.dev"],
    },
    define: {
        __COMMIT_HASH: JSON.stringify(commitHash),
        __BUILD_DATE: JSON.stringify(new Date().toISOString()),
        __REPO_URL: JSON.stringify(repoUrl),
        __APP_VERSION: JSON.stringify(pkg.version),
        __DEBUG__: JSON.stringify(isDebug),
        "import.meta.env.API_URL": JSON.stringify(
            process.env.API_URL ?? "https://api.unii.dev",
        ),
        "import.meta.env.WS_URL": JSON.stringify(
            process.env.WS_URL ?? "wss://api.unii.dev",
        ),
    },
});
