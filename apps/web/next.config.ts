import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";

// The application runs from apps/web, while deployment secrets and local .env
// live at the monorepo root. Only NEXT_PUBLIC_* values are exposed to clients.
const workspaceRoot = process.env.INIT_CWD || (process.cwd().endsWith(path.join("apps", "web")) ? path.resolve(process.cwd(), "../..") : process.cwd());
loadEnvConfig(workspaceRoot, process.env.NODE_ENV !== "production", undefined, true);

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const config: NextConfig = {
  basePath,
  transpilePackages: ["@ragavazhi/domain"],
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
      ]
    }];
  }
};
export default config;
