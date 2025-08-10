// vite.config.ts
import motionCanvas from "@motion-canvas/vite-plugin";
import { defineConfig } from "vite";
import fg from "fast-glob";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import ffmpeg from "@motion-canvas/ffmpeg";

const root = dirname(fileURLToPath(import.meta.url));
const projects = fg
  .sync(["./src/projects/**/*.{ts,tsx}"], {
    cwd: root,
    absolute: false,
  })
  // optionnel : ne garder que les fichiers se terminant par .project.ts(x)
  .filter((p) => /\.project\.tsx?$/.test(p))
  // normaliser pour Windows
  .map((p) => `./${p.replace(/\\/g, "/")}`);

export default defineConfig({
  plugins: [
    motionCanvas({
      project: projects,
    }),
    ffmpeg(),
  ],
});
