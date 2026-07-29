import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const contentSecurityPolicy = [
    "default-src 'self'",
    // TanStack Start hydration currently emits inline scripts. Keep this
    // explicit until nonce support is wired through the SSR renderer.
    `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isProduction ? "" : " ws: wss:"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const securityHeaders: Record<string, string> = {
    "Content-Security-Policy": contentSecurityPolicy,
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };

  if (isProduction) {
    securityHeaders["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: [
        {
          find: /^tslib$/,
          // Nitro v3 beta currently bundles tslib's CommonJS entry with
          // browser-mode interop, which leaves its synthetic default undefined.
          replacement: fileURLToPath(
            new URL("./node_modules/tslib/tslib.es6.mjs", import.meta.url),
          ),
        },
        {
          find: /^use-sync-external-store\/shim\/with-selector$/,
          // Nitro's standalone SSR bundle otherwise leaves this CommonJS
          // package requiring a second React instance.
          replacement: fileURLToPath(
            new URL("./src/lib/use-sync-external-store-with-selector.ts", import.meta.url),
          ),
        },
      ],
      tsconfigPaths: true,
    },
    optimizeDeps: {
      include: ["@tanstack/react-form-start"],
    },
    plugins: [
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      nitro({
        routeRules: {
          "/**": {
            headers: securityHeaders,
          },
        },
      }),
    ],
  };
});
