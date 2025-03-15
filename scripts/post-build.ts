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

  // 首先检查是否有 .mjs 文件，如果没有，则需要将 .js 文件复制到 ES 目录
  const hasMjsFiles = files.some((file) => {
    const extension: string = path.extname(file).toLowerCase();
    const filename: string = path.basename(file);
    return extension === ".mjs" || filename.endsWith(".mjs.map");
  });

  files.forEach((file: string) => {
    const relativePath: string = path.relative(componentDistDir, file);
    const filename: string = path.basename(file);
    const extension: string = path.extname(file).toLowerCase();

    // 处理 .mjs 文件（ESM 格式）
    if (extension === ".mjs" || filename.endsWith(".mjs.map")) {
      const targetPath = path.join(
        esDir,
        component,
        path.dirname(relativePath),
        filename.replace(".mjs", ".js").replace(".mjs.map", ".js.map")
      );

      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(file, targetPath);
      return;
    }

    if (extension === ".js") {
      // 如果没有 .mjs 文件，并且文件名是 index.js，则将其视为 ESM 格式
      if (!hasMjsFiles && filename === "index.js") {
        copyToDir(file, esDir, component, relativePath);
        copyToDir(file, libDir, component, relativePath);
        return;
      }

      // 根据文件路径判断是 ESM 还是 CJS
      const isESM =
        file.includes(".esm.") ||
        file.includes("/esm/") ||
        file.includes("/es/");
      const isCJS =
        file.includes(".cjs.") ||
        file.includes("/cjs/") ||
        file.includes("/lib/");

      // 如果路径无法判断，则检查文件内容
      if (!isESM && !isCJS) {
        const content: string = fs.readFileSync(file, "utf8");
        if (isESModuleByContent(content)) {
          copyToDir(file, esDir, component, relativePath);
        } else {
          copyToDir(file, libDir, component, relativePath);
        }
      } else {
        // 根据路径判断复制到对应目录
        if (isESM) {
          copyToDir(file, esDir, component, relativePath);
        } else {
          copyToDir(file, libDir, component, relativePath);
        }
      }
    } else if (extension === ".ts" && filename.endsWith(".d.ts")) {
      copyToDir(file, esDir, component, relativePath);
      copyToDir(file, libDir, component, relativePath);
    } else if (extension === ".css" || filename.endsWith(".css.map")) {
      copyToDir(file, esDir, component, relativePath);
      copyToDir(file, libDir, component, relativePath);
    } else if (extension === ".map" && filename.endsWith(".js.map")) {
      // 对应的 JS 文件路径
      const jsFile = file.replace(".map", "");
      if (fs.existsSync(jsFile)) {
        // 如果没有 .mjs 文件，并且文件名是 index.js.map，则将其视为 ESM 格式
        if (!hasMjsFiles && path.basename(jsFile) === "index.js") {
          copyToDir(file, esDir, component, relativePath);
          copyToDir(file, libDir, component, relativePath);
          return;
        }

        // 根据 JS 文件判断是 ESM 还是 CJS
        const isESM =
          jsFile.includes(".esm.") ||
          jsFile.includes("/esm/") ||
          jsFile.includes("/es/");
        const isCJS =
          jsFile.includes(".cjs.") ||
          jsFile.includes("/cjs/") ||
          jsFile.includes("/lib/");

        if (isESM) {
          copyToDir(file, esDir, component, relativePath);
        } else if (isCJS) {
          copyToDir(file, libDir, component, relativePath);
        } else {
          // 如果路径无法判断，则检查 JS 文件内容
          const content: string = fs.readFileSync(jsFile, "utf8");
          if (isESModuleByContent(content)) {
            copyToDir(file, esDir, component, relativePath);
          } else {
            copyToDir(file, libDir, component, relativePath);
          }
        }
      }
    }
  });
}

/**
 * 通过文件内容判断 JS 文件是否为 ESM 格式（备用方法）
 */
function isESModuleByContent(content: string): boolean {
  // 检查是否有 ESM 特有的语法
  const hasExportDefault = /\bexport\s+default\b/.test(content);
  const hasNamedExport =
    /\bexport\s+(?:const|let|var|function|class|interface|type|enum)\b/.test(
      content
    );
  const hasImportFrom = /\bimport\s+.*\s+from\s+/.test(content);

  // 检查是否有 CJS 特有的语法
  const hasModuleExports = /\bmodule\.exports\s*=/.test(content);
  const hasExportsAssignment = /\bexports\.\w+\s*=/.test(content);

  // 如果同时有 ESM 和 CJS 的特征，优先判断为 CJS
  if (hasModuleExports || hasExportsAssignment) {
    return false;
  }

  return hasExportDefault || hasNamedExport || hasImportFrom;
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
    .map((component) => {
      // 处理带有连字符的组件名，将其转换为有效的变量名
      const varName = component.replace(/-/g, "_");

      return `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var _${varName} = require("./${component}/index.js");
Object.keys(_${varName}).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _${varName}[key];
    }
  });
});`;
    })
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
