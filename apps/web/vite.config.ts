import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
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
    plugins: [tailwindcss(), tanstackStart(), viteReact(), nitro()],
  };
});
