import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import { name } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name,
      remotes: {
        MonorepoVueComponent: {
          external: "http://localhost:3001/remoteEntry.js",
          format: "var",
        },
      },
      shared: ["vue-router", "vue"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
