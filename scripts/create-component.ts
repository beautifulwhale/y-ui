#!/usr/bin/env node

// @ts-nocheck
const fs = require("fs");
const path = require("path");

// 获取组件名称
let componentName = process.argv[2];

// 检查是否是 "--" 参数（pnpm 传递的分隔符）
if (componentName === "--" && process.argv.length > 3) {
  // 使用下一个参数作为组件名称
  componentName = process.argv[3];
}

if (!componentName || componentName === "--") {
  console.error("请提供组件名称，例如: npm run create:component -- message");
  process.exit(1);
}

// 将首字母大写
const componentNameCapitalized =
  componentName.charAt(0).toUpperCase() + componentName.slice(1);

// 组件目录路径
const componentDir = path.join(__dirname, "..", "packages", componentName);

// 检查组件是否已存在
if (fs.existsSync(componentDir)) {
  console.error(`组件 ${componentName} 已存在`);
  process.exit(1);
}

// 创建目录结构
fs.mkdirSync(componentDir);
fs.mkdirSync(path.join(componentDir, "src"));
fs.mkdirSync(path.join(componentDir, "src", "__tests__"));

// 询问是否需要添加额外依赖
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("是否需要添加额外依赖？(y/n) ", (answer: string) => {
  let dependencies: Record<string, string> = {};
  let devDependencies: Record<string, string> = {
    vitest: "^1.0.0",
    jsdom: "^26.0.0",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  };

  if (answer.toLowerCase() === "y") {
    rl.question(
      "请输入依赖项，用逗号分隔（例如：classnames,dayjs）: ",
      (deps: string) => {
        if (deps) {
          const depsArray = deps.split(",").map((dep: string) => dep.trim());

          depsArray.forEach((dep: string) => {
            dependencies[dep] = "^1.0.0"; // 默认版本

            // 为特定依赖添加类型定义
            if (dep === "classnames") {
              devDependencies["@types/classnames"] = "^2.3.1";
            }
          });
        }

        createPackageJson(dependencies, devDependencies);
        createFiles();
        rl.close();
      }
    );
  } else {
    createPackageJson(dependencies, devDependencies);
    createFiles();
    rl.close();
  }
});

interface PackageJson {
  name: string;
  version: string;
  main: string;
  module: string;
  types: string;
  scripts: Record<string, string>;
  peerDependencies: Record<string, string>;
  publishConfig: {
    access: string;
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function createPackageJson(
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
) {
  // 创建 package.json
  const packageJson: PackageJson = {
    name: `@y-ui/${componentName}`,
    version: "1.0.0",
    main: "dist/index.js",
    module: "dist/index.mjs",
    types: "dist/index.d.ts",
    scripts: {
      build: "tsup src/index.tsx --format cjs,esm --dts",
      test: "vitest",
    },
    peerDependencies: {
      react: "^18.0.0",
    },
    publishConfig: {
      access: "public",
    },
  };

  // 添加依赖项
  if (Object.keys(dependencies).length > 0) {
    packageJson.dependencies = dependencies;
  }

  if (Object.keys(devDependencies).length > 0) {
    packageJson.devDependencies = devDependencies;
  }

  fs.writeFileSync(
    path.join(componentDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

function createFiles() {
  // 创建 index.tsx
  const indexContent = `import React from 'react';

export interface ${componentNameCapitalized}Props {
  children: React.ReactNode;
  className?: string;
}

export const ${componentNameCapitalized}: React.FC<${componentNameCapitalized}Props> = ({ 
  children, 
  className = ''
}) => {
  const baseClass = 'y-${componentName}';
  const combinedClassName = className ? \`\${baseClass} \${className}\` : baseClass;

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};
`;

  fs.writeFileSync(path.join(componentDir, "src", "index.tsx"), indexContent);

  // 创建 SCSS 文件
  fs.writeFileSync(
    path.join(componentDir, "src", "index.scss"),
    `.y-${componentName} {
  // 在这里添加样式
}
`
  );

  // 创建测试文件
  const testContent = `import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ${componentNameCapitalized} } from '../index';

describe('${componentNameCapitalized}', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<${componentNameCapitalized}>测试内容</${componentNameCapitalized}>);
    expect(getByText('测试内容')).toBeDefined();
  });
});
`;

  fs.writeFileSync(
    path.join(
      componentDir,
      "src",
      "__tests__",
      `${componentNameCapitalized}.test.tsx`
    ),
    testContent
  );

  // 创建 README.md
  const readmeContent = `# ${componentNameCapitalized}

${componentNameCapitalized} 组件

## 安装

\`\`\`bash
pnpm add @y-ui/${componentName}
\`\`\`

## 使用

\`\`\`jsx
import { ${componentNameCapitalized} } from '@y-ui/${componentName}';

function App() {
  return (
    <${componentNameCapitalized}>
      内容
    </${componentNameCapitalized}>
  );
}
\`\`\`

## API

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 子元素 | ReactNode | - |
| className | 自定义类名 | string | - |
`;

  fs.writeFileSync(path.join(componentDir, "README.md"), readmeContent);

  console.log(`✅ 组件 ${componentNameCapitalized} 创建成功！`);
  console.log(`📁 路径: ${componentDir}`);
}
