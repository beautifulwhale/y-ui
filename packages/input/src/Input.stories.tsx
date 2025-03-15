import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./index";
import { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "输入框组件，用于接收用户输入的文本内容。",
      },
    },
  },
  argTypes: {
    value: {
      description: "输入框的值",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "无" },
      },
    },
    onChange: {
      description: "输入框值变化时的回调函数",
      action: "changed",
      table: {
        type: { summary: "(value: string) => void" },
        defaultValue: { summary: "无" },
      },
    },
    placeholder: {
      description: "输入框占位文本",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "无" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// 基础输入框
export const Default: Story = {
  args: {
    placeholder: "请输入内容",
  },
};

// 带默认值的输入框
export const WithDefaultValue: Story = {
  args: {
    value: "默认值",
    placeholder: "请输入内容",
  },
};

// 受控输入框示例
export const Controlled = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <Input value={value} onChange={setValue} placeholder="请输入内容" />
      <p>当前输入值: {value}</p>
    </div>
  );
};

Controlled.storyName = "受控输入框";
Controlled.parameters = {
  docs: {
    description: {
      story:
        "这是一个受控组件的示例，展示了如何使用React的state来控制输入框的值。",
    },
  },
};
