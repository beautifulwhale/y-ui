import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

// 读取 packages 目录下所有的组件
const packagesDir = path.resolve(__dirname, "packages");
const entries = fs.readdirSync(packagesDir).reduce((acc, dir) => {
  // 检查 index.ts 或 index.tsx 文件
  const entryPathTs = path.join(packagesDir, dir, "src/index.ts");
  const entryPathTsx = path.join(packagesDir, dir, "src/index.tsx");

  if (fs.existsSync(entryPathTs)) {
    acc[dir] = entryPathTs;
  } else if (fs.existsSync(entryPathTsx)) {
    acc[dir] = entryPathTsx;
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
  // 确保生成的文件都是正确的后缀
  outExtension: ({ format }) => ({
    js: format === "esm" ? ".mjs" : ".js",
  }),
  // 允许外部模块
  external: ["react", "react-dom"],
});
