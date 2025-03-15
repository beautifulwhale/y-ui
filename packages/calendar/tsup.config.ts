import { sassPlugin } from "esbuild-sass-plugin";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import postcss from "postcss";
import { defineConfig } from "tsup";

// 创建通用的tsup配置函数
export function createTsupConfig(options = {}) {
  return defineConfig({
    entry: ["src/index.tsx"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    // 根据格式区分文件扩展名
    outExtension: ({ format }) => ({
      js: format === "esm" ? ".mjs" : ".js",
    }),
    // 配置esbuild以处理sass/scss文件
    esbuildPlugins: [
      sassPlugin({
        async transform(source) {
          const { css } = await postcss([
            autoprefixer,
            postcssPresetEnv({ stage: 0 }),
          ]).process(source);
          return css;
        },
      }),
    ],
    // 允许外部模块
    external: ["react", "react-dom"],
    // 合并自定义选项
    ...options,
  });
}

// 导出默认配置
export default createTsupConfig();
