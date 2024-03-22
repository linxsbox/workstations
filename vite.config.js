import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "types/auto-imports.d.ts",
    }),
    copy({
      verbose: true,
      hook: "closeBundle",
      targets: [
        {
          src: "src/background/service-worker.js",
          dest: "dist/background",
        },
        { src: "src/content/handler.js", dest: "dist/content" },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: { sourcemap: true },
});
