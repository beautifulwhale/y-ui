import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "按钮组件，用于触发操作或事件。支持不同类型和禁用状态。",
      },
    },
  },
  argTypes: {
    children: {
      description: "按钮内容",
      control: "text",
      table: {
        type: { summary: "React.ReactNode" },
        defaultValue: { summary: "无" },
      },
    },
    onClick: {
      description: "点击按钮时的回调函数",
      action: "clicked",
      table: {
        type: { summary: "() => void" },
        defaultValue: { summary: "无" },
      },
    },
    type: {
      description: "按钮类型",
      control: "select",
      options: ["primary", "default"],
      table: {
        type: { summary: "'primary' | 'default'" },
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      description: "是否禁用按钮",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    className: {
      description: "自定义类名",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 默认按钮
export const Default: Story = {
  args: {
    children: "默认按钮",
    type: "default",
  },
};

// 主要按钮
export const Primary: Story = {
  args: {
    children: "主要按钮",
    type: "primary",
  },
};

// 禁用按钮
export const Disabled: Story = {
  args: {
    children: "禁用按钮",
    disabled: true,
  },
};

// 带点击事件的按钮
export const WithClickHandler: Story = {
  args: {
    children: "点击我",
    onClick: () => alert("按钮被点击了！"),
  },
};

// 自定义类名按钮
export const WithCustomClass: Story = {
  args: {
    children: "自定义类名按钮",
    className: "custom-button-class",
  },
};
