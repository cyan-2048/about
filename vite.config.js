import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";

let APP_VERSION = null;

try {
  const file = "./.git/ORIG_HEAD";
  if (fs.existsSync(file)) {
    APP_VERSION = JSON.stringify(fs.readFileSync(file, "utf8").slice(0, -1));
  } else throw "ORIG_HEAD File missing";
} catch (e) {
  console.error("getting git sha failed!", e);
} finally {
  if (!APP_VERSION)
    APP_VERSION = JSON.stringify((btoa(Math.random()) + btoa(Math.random())).replaceAll("=", "").slice(0, 40));
}

console.log(APP_VERSION);

// https://vitejs.dev/config/
export default defineConfig({
  define: { APP_VERSION },
  plugins: [svelte()],
  build: {
    outDir: "./docs",
    assetsDir: "./",
  },
  base: "./",
});
