import type { Meta, StoryObj } from "@storybook/react";
import InputWithButton from "./index";
import { useState } from "react";

const meta: Meta<typeof InputWithButton> = {
  title: "Components/InputWithButton",
  component: InputWithButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "输入框与按钮组合组件，常用于搜索、提交表单等场景。",
      },
    },
  },
  argTypes: {
    onSubmit: {
      description: "点击按钮或按下回车键时的回调函数",
      action: "submitted",
      table: {
        type: { summary: "(value: string) => void" },
        defaultValue: { summary: "无" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputWithButton>;

// 基础用法
export const Default: Story = {
  args: {
    onSubmit: (value) => console.log("提交的值:", value),
  },
};

// 实际使用示例
export const Example = () => {
  const [submittedValues, setSubmittedValues] = useState<string[]>([]);

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      setSubmittedValues((prev) => [...prev, value]);
    }
  };

  return (
    <div>
      <h3>提交表单示例</h3>
      <InputWithButton onSubmit={handleSubmit} />

      {submittedValues.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>已提交的值:</h4>
          <ul>
            {submittedValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Example.storyName = "实际使用示例";
Example.parameters = {
  docs: {
    description: {
      story:
        "这个示例展示了如何在实际应用中使用InputWithButton组件，并记录提交的值。",
    },
  },
};
