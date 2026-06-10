import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { execSync } from "node:child_process";

const commitHash = execSync("git rev-parse HEAD").toString().trim();
const repoUrl = execSync("git remote get-url origin").toString().trim();

export default defineConfig({
    plugins: [sveltekit()],
    preview: {
        allowedHosts: ["dev.unii.dev", "chat.unii.dev", "localhost"],
    },
    define: {
        __COMMIT_HASH: JSON.stringify(commitHash),
        __BUILD_DATE: JSON.stringify(new Date().toISOString()),
        __REPO_URL: JSON.stringify(repoUrl),
    },
});
