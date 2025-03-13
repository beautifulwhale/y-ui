// @ts-nocheck
const fs = require("fs");
const path = require("path");

// 目标目录
const distDir: string = path.resolve(__dirname, "../dist");
const esDir: string = path.resolve(distDir, "es");
const libDir: string = path.resolve(distDir, "lib");

// 确保目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
} else {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir);
}

fs.mkdirSync(esDir);
fs.mkdirSync(libDir);

// 查找所有组件目录
const packagesDir: string = path.resolve(__dirname, "../packages");
const components: string[] = fs
  .readdirSync(packagesDir)
  .filter((dir: string) => {
    const stats = fs.statSync(path.join(packagesDir, dir));
    return stats.isDirectory() && dir !== "node_modules";
  });

// 处理组件
components.forEach((component: string) => {
  const componentDistDir: string = path.join(packagesDir, component, "dist");

  if (!fs.existsSync(componentDistDir)) {
    console.log(`🚫 组件 ${component} 没有 dist 目录，跳过`);
    return;
  }

  console.log(`🎯 处理组件: ${component}`);
  processComponentFiles(componentDistDir, component);
});

// 创建 index 入口文件
createIndexFiles();

// 更新 package.json
updatePackageJson();

console.log("🎉 处理完成！");

/**
 * 处理组件文件，按 ESM / CJS 分类
 */
function processComponentFiles(
  componentDistDir: string,
  component: string
): void {
  const files: string[] = getAllFiles(componentDistDir);

  files.forEach((file: string) => {
    const relativePath: string = path.relative(componentDistDir, file);
    const filename: string = path.basename(file);
    const extension: string = path.extname(file).toLowerCase();

    if (extension === ".js") {
      const content: string = fs.readFileSync(file, "utf8");
      const isESM: boolean = isESModule(content, filename);

      const targetDir = isESM ? esDir : libDir;
      copyToDir(file, targetDir, component, relativePath);
    } else if (filename.endsWith(".mjs")) {
      copyToDir(file, esDir, component, relativePath);
    } else if (filename.endsWith(".cjs")) {
      copyToDir(file, libDir, component, relativePath);
    } else if (extension === ".ts" && filename.endsWith(".d.ts")) {
      copyToDir(file, esDir, component, relativePath);
      copyToDir(file, libDir, component, relativePath);
    } else if (extension === ".css" || filename.endsWith(".css.map")) {
      copyToDir(file, esDir, component, relativePath);
      copyToDir(file, libDir, component, relativePath);
    }
  });
}

/**
 * 判断 JS 文件是否为 ESM 格式
 */
function isESModule(content: string, filename: string): boolean {
  const hasImportExport = /\b(import|export)\b/.test(content);
  const hasRequire = /\brequire\s*\(/.test(content);
  const hasModuleExports = /\bmodule\.exports\b/.test(content);

  if (filename.includes(".esm.") || filename.includes(".mjs")) return true;
  if (filename.includes(".cjs.")) return false;

  return hasImportExport && !hasRequire && !hasModuleExports;
}

/**
 * 复制文件到目标目录
 */
function copyToDir(
  file: string,
  targetBaseDir: string,
  component: string,
  relativePath: string
): void {
  const targetDir = path.join(
    targetBaseDir,
    component,
    path.dirname(relativePath)
  );

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.copyFileSync(file, path.join(targetDir, path.basename(relativePath)));
}

/**
 * 递归获取所有文件
 */
function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  const list: string[] = fs.readdirSync(dir);

  list.forEach((file: string) => {
    const fullPath: string = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });

  return results;
}

/**
 * 创建 index 入口文件
 */
function createIndexFiles(): void {
  const esIndexContent: string = components
    .map((component) => `export * from './${component}/index.js';`)
    .join("\n");

  const cjsIndexContent: string = components
    .map(
      (component) => `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var _${component} = require("./${component}/index.js");
Object.keys(_${component}).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _${component}[key];
    }
  });
});`
    )
    .join("\n\n");

  const dtsIndexContent: string = components
    .map((component) => `export * from './${component}/index';`)
    .join("\n");

  fs.writeFileSync(path.join(esDir, "index.js"), esIndexContent);
  fs.writeFileSync(path.join(libDir, "index.js"), cjsIndexContent);
  fs.writeFileSync(path.join(esDir, "index.d.ts"), dtsIndexContent);
  fs.writeFileSync(path.join(libDir, "index.d.ts"), dtsIndexContent);
}

/**
 * 更新 package.json
 */
function updatePackageJson(): void {
  const packageJsonPath: string = path.resolve(__dirname, "../package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.exports = {
    ".": {
      import: "./dist/es/index.js",
      require: "./dist/lib/index.js",
      types: "./dist/es/index.d.ts",
    },
  };

  components.forEach((component) => {
    packageJson.exports[`./${component}`] = {
      import: `./dist/es/${component}/index.js`,
      require: `./dist/lib/${component}/index.js`,
      types: `./dist/es/${component}/index.d.ts`,
    };
  });

  packageJson.sideEffects = false;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("🚀 已更新 package.json 的导出配置");
}
