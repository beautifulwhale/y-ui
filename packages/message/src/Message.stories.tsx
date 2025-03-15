import type { Meta } from "@storybook/react";
import Message from "./index";
import { useMessage } from "./useMessage";
import { Button } from "../../button/src";

const meta: Meta<typeof Message> = {
  title: "Components/Message",
  component: Message,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "全局消息提示组件，用于操作反馈、提示信息等场景。",
      },
    },
  },
};

export default meta;

// 由于Message是一个全局组件，我们需要使用useMessage钩子来展示它
export const MessageDemo = () => {
  const message = useMessage();

  const showSuccessMessage = () => {
    message.add({
      type: "success",
      content: "操作成功！",
    });
  };

  const showErrorMessage = () => {
    message.add({
      type: "error",
      content: "操作失败！",
    });
  };

  const showWarningMessage = () => {
    message.add({
      type: "warning",
      content: "警告信息！",
    });
  };

  const showInfoMessage = () => {
    message.add({
      type: "info",
      content: "提示信息！",
    });
  };

  const showCustomDurationMessage = () => {
    message.add({
      type: "info",
      content: "这条消息将显示5秒钟",
      duration: 5000,
    });
  };

  const showPersistentMessage = () => {
    const id = Date.now();
    message.add({
      id,
      type: "info",
      content: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>这条消息不会自动关闭</span>
          <Button
            type="primary"
            onClick={() => message.remove(id)}
            className="message-close-btn"
          >
            关闭
          </Button>
        </div>
      ),
      duration: Infinity,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button onClick={showSuccessMessage}>显示成功消息</Button>
      <Button onClick={showErrorMessage}>显示错误消息</Button>
      <Button onClick={showWarningMessage}>显示警告消息</Button>
      <Button onClick={showInfoMessage}>显示信息消息</Button>
      <Button onClick={showCustomDurationMessage}>
        显示自定义持续时间消息
      </Button>
      <Button onClick={showPersistentMessage}>显示不会自动关闭的消息</Button>
      <style>
        {`
          .message-close-btn {
            margin-left: 10px;
          }
        `}
      </style>
    </div>
  );
};

MessageDemo.storyName = "消息提示示例";
MessageDemo.parameters = {
  docs: {
    description: {
      story: `
## 使用方法

Message组件提供了以下几种使用方式：

### 1. 基础用法

\`\`\`jsx
import { useMessage } from '@y-ui/message';

const Demo = () => {
  const message = useMessage();
  
  const showMessage = () => {
    message.add({
      type: "info",
      content: "这是一条提示信息"
    });
  };
  
  return <button onClick={showMessage}>显示消息</button>;
};
\`\`\`

### 2. 不同类型的消息

\`\`\`jsx
// 成功提示
message.add({
  type: "success",
  content: "操作成功！"
});

// 错误提示
message.add({
  type: "error",
  content: "操作失败！"
});

// 警告提示
message.add({
  type: "warning",
  content: "警告信息！"
});

// 普通信息
message.add({
  type: "info",
  content: "提示信息！"
});
\`\`\`

### 3. 自定义配置

\`\`\`jsx
message.add({
  type: "info",
  content: "自定义消息内容",
  duration: 5000, // 持续时间，单位毫秒
  onClose: () => console.log("消息已关闭")
});
\`\`\`

### 4. 手动关闭消息

\`\`\`jsx
const id = Date.now();
message.add({
  id,
  type: "info",
  content: "点击按钮关闭此消息",
  duration: Infinity // 设置为Infinity则不会自动关闭
});

// 在需要的时候手动关闭
message.remove(id);
\`\`\`
      `,
    },
  },
};
