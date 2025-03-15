## README.md - `@rainliu/y-ui` 🚀✨

# @rainliu/y-ui

> 一款基于 React 的现代化 UI 组件库，提供优雅、简洁且易于使用的组件，助力快速开发高质量的 Web 应用。

![npm](https://img.shields.io/npm/v/@rainliu/y-ui) ![npm](https://img.shields.io/npm/dm/@rainliu/y-ui) ![license](https://img.shields.io/npm/l/@rainliu/y-ui)

---

## 📦 安装

使用 `pnpm` / `npm` / `yarn` 进行安装：

```sh
pnpm add @rainliu/y-ui
# 或者
npm install @rainliu/y-ui
# 或者
yarn add @rainliu/y-ui
```

---

## 🚀 快速上手

在你的 React 项目中导入组件并使用：

```tsx
import React from "react";
import { Button } from "@rainliu/y-ui";

const App = () => {
  return <Button onClick={() => alert("Hello RainLiu!")}>点击我</Button>;
};

export default App;
```

---

## 🎨 组件列表

| 组件              | 说明           | 示例                                 |
| ----------------- | -------------- | ------------------------------------ |
| `Button`          | 按钮组件       | `<Button>Click me</Button>`          |
| `Input`           | 输入框组件     | `<Input placeholder="请输入内容" />` |
| `Calendar`        | 日历组件       | `<Calendar />`                       |
| `Message`         | 消息提示       | `Message.success("操作成功!")`       |
| `InputWithButton` | 带按钮的输入框 | `<InputWithButton />`                |

> **更多组件开发中...** 🚧 欢迎提供建议和贡献！ 🎉

---

## 📄 API 文档

### Button 按钮

| 属性       | 类型                          | 默认值    | 说明      |
| ---------- | ----------------------------- | --------- | --------- | ----------- | -------- |
| `type`     | `"primary"                    | "default" | "danger"` | `"default"` | 按钮类型 |
| `disabled` | `boolean`                     | `false`   | 是否禁用  |
| `onClick`  | `(event: MouseEvent) => void` | `-`       | 点击事件  |

使用示例：

```tsx
<Button type="primary" onClick={() => console.log("按钮点击")}>
  主要按钮
</Button>
```

---

## 🎯 特性

✅ **基于 React** —— 采用 TypeScript 编写，提升开发体验  
✅ **轻量高效** —— 仅包含必要的功能，减少不必要的依赖  
✅ **组件化设计** —— 易扩展，方便定制  
✅ **支持 Tree-Shaking** —— 仅加载所需组件，优化性能

---

## 🛠️ 本地开发

如果你想修改或贡献代码，可以克隆仓库并安装依赖：

```sh
git clone https://github.com/你的GitHub账号/rainliu-y-ui.git
cd rainliu-y-ui
pnpm install
pnpm dev  # 运行本地开发环境
```

---

## 📌 贡献指南

欢迎贡献代码！你可以通过以下方式参与：

1. **提交 Issue**：如果你发现 Bug 或者有新功能建议，可以在 [GitHub Issues](https://github.com/你的GitHub账号/rainliu-y-ui/issues) 提交问题。
2. **提交 PR**：Fork 本仓库，修改代码后提交 Pull Request。
3. **优化文档**：如果你发现文档有误，可以直接修改 `README.md` 提交更新。

---

## 📄 License

`@rainliu/y-ui` 基于 **MIT 许可证** 开源，欢迎自由使用！🎉

---

🚀 **让我们一起构建更好用的 React UI 组件库！** 💡

## 组件文档

我们使用 Storybook 为组件库提供了详细的文档和示例。你可以通过以下命令启动 Storybook：

```bash
# 启动Storybook开发服务器
pnpm run storybook

# 构建静态Storybook文档
pnpm run build-storybook
```

Storybook 提供了以下功能：

- 组件 API 文档：详细说明每个组件的属性、事件和用法
- 交互式示例：可以实时调整组件属性，查看效果
- 使用指南：包含每个组件的详细使用说明和最佳实践
- 代码示例：提供可复制的代码片段

访问 http://localhost:6006 查看组件文档。
