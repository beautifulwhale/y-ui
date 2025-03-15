import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

// 读取 packages 目录下所有的组件
const packagesDir = path.resolve(__dirname, "packages");
const entries = fs.readdirSync(packagesDir).reduce((acc, dir) => {
  const entryPath = path.join(packagesDir, dir, "src/index.ts");
  if (fs.existsSync(entryPath)) {
    acc[dir] = entryPath;
  }
  return acc;
}, {} as Record<string, string>);

export default defineConfig({
  entry: entries,
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  minify: true,
  target: "esnext",
  splitting: false,
  clean: true,
});
