import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./index";
import dayjs from "dayjs";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "日历组件，用于日期展示、选择等场景。",
      },
    },
  },
  argTypes: {
    value: {
      description: "当前选中的日期",
      control: "date",
      table: {
        type: { summary: "Dayjs" },
        defaultValue: { summary: "无" },
      },
    },
    defaultValue: {
      description: "默认选中的日期",
      control: "date",
      table: {
        type: { summary: "Dayjs" },
        defaultValue: { summary: "当前日期" },
      },
    },
    classname: {
      description: "自定义类名",
      control: "text",
      table: {
        type: { summary: "string | string[]" },
        defaultValue: { summary: "无" },
      },
    },
    style: {
      description: "自定义样式",
      table: {
        type: { summary: "CSSProperties" },
        defaultValue: { summary: "无" },
      },
    },
    dateRender: {
      description: "自定义日期单元格的内容",
      table: {
        type: { summary: "(date: Dayjs) => ReactNode" },
        defaultValue: { summary: "无" },
      },
    },
    dateCellRender: {
      description: "自定义日期单元格的内容",
      table: {
        type: { summary: "(date: Dayjs) => ReactNode" },
        defaultValue: { summary: "无" },
      },
    },
    locale: {
      description: "国际化配置",
      table: {
        type: { summary: "LocaleType" },
        defaultValue: { summary: "navigator.language" },
      },
    },
    onChange: {
      description: "日期变化时的回调函数",
      action: "changed",
      table: {
        type: { summary: "(date: Dayjs) => void" },
        defaultValue: { summary: "无" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// 基础日历
export const Default: Story = {
  args: {
    defaultValue: dayjs(),
  },
};

// 自定义样式
export const CustomStyle: Story = {
  args: {
    defaultValue: dayjs(),
    style: {
      width: "400px",
      border: "1px solid #f0f0f0",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
  },
};

// 自定义日期单元格
export const CustomDateCell = () => {
  // 模拟一些事件数据
  const events = {
    [dayjs().format("YYYY-MM-DD")]: ["今天"],
    [dayjs().add(1, "day").format("YYYY-MM-DD")]: [
      "明天的事件1",
      "明天的事件2",
    ],
    [dayjs().add(3, "day").format("YYYY-MM-DD")]: ["重要会议"],
    [dayjs().add(7, "day").format("YYYY-MM-DD")]: ["周年纪念日"],
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const dayEvents = events[dateStr];

    return dayEvents ? (
      <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "12px" }}>
        {dayEvents.map((event, index) => (
          <li key={index} style={{ color: "#1890ff" }}>
            {event}
          </li>
        ))}
      </ul>
    ) : null;
  };

  return <Calendar dateCellRender={dateCellRender} />;
};

CustomDateCell.storyName = "自定义日期单元格";
CustomDateCell.parameters = {
  docs: {
    description: {
      story:
        "通过dateCellRender属性可以自定义日期单元格的内容，例如添加事件标记等。",
    },
  },
};

// 受控组件示例
export const ControlledCalendar = () => {
  const [date, setDate] = useState(dayjs());

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        当前选中日期: {date.format("YYYY-MM-DD")}
      </div>
      <Calendar value={date} onChange={(newDate) => setDate(newDate)} />
    </div>
  );
};

ControlledCalendar.storyName = "受控日历";
ControlledCalendar.parameters = {
  docs: {
    description: {
      story:
        "这个示例展示了如何将Calendar作为受控组件使用，通过value和onChange属性控制日历的选中日期。",
    },
  },
};
