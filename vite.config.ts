import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { vercelPreset } from "@vercel/remix/vite";

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      ssr: true,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Prevent Prisma from being treated as external
        inlineDynamicImports: false,
      },
    },
  },
  ssr: {
    noExternal: true, // Bundle everything for serverless
    external: ["fsevents"], // Only exclude platform-specific modules
  },
  /* shadcn */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
    // port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  },
  clearScreen: false,
});
