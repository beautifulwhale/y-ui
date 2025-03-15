import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Message, { MessageRef, ConfigProvider, useMessage } from "../index";

// 模拟 setTimeout 和 clearTimeout
vi.useFakeTimers();

describe("Message 组件", () => {
  beforeEach(() => {
    // 清理 DOM 中可能存在的 portal 元素
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("基础渲染测试", () => {
    const { container } = render(<Message />);
    expect(container.querySelector(".message-wrapper")).toBeDefined();
  });

  it("通过 ref 添加消息", () => {
    const messageRef = { current: null as unknown as MessageRef };

    render(<Message ref={messageRef} />);

    act(() => {
      messageRef.current.add({
        content: "测试消息",
        duration: 3000,
      });
    });

    expect(document.body.textContent).toContain("测试消息");
  });

  it("消息在指定时间后自动移除", () => {
    const messageRef = { current: null as unknown as MessageRef };

    render(<Message ref={messageRef} />);

    act(() => {
      messageRef.current.add({
        content: "自动移除测试",
        duration: 1000,
      });
    });

    expect(document.body.textContent).toContain("自动移除测试");

    // 前进 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(document.body.textContent).not.toContain("自动移除测试");
  });

  it("手动移除消息", () => {
    const messageRef = { current: null as unknown as MessageRef };

    render(<Message ref={messageRef} />);

    act(() => {
      messageRef.current.add({
        id: "test-id",
        content: "手动移除测试",
        duration: 3000,
      });
    });

    expect(document.body.textContent).toContain("手动移除测试");

    // 使用 act 包裹状态更新，并确保 React 完成渲染
    act(() => {
      messageRef.current.remove("test-id");
      // 强制完成所有待处理的更新
      vi.runAllTimers();
    });

    // 添加一个小延迟以确保 DOM 已更新
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(document.body.textContent).not.toContain("手动移除测试");
  });

  it("清除所有消息", () => {
    const messageRef = { current: null as unknown as MessageRef };

    render(<Message ref={messageRef} />);

    act(() => {
      messageRef.current.add({ content: "消息1" });
      messageRef.current.add({ content: "消息2" });
      messageRef.current.add({ content: "消息3" });
    });

    expect(document.body.textContent).toContain("消息1");
    expect(document.body.textContent).toContain("消息2");
    expect(document.body.textContent).toContain("消息3");

    act(() => {
      messageRef.current.clearAll();
    });

    expect(document.body.textContent).not.toContain("消息1");
    expect(document.body.textContent).not.toContain("消息2");
    expect(document.body.textContent).not.toContain("消息3");
  });

  it("测试 ConfigProvider 和 useMessage", () => {
    // 创建一个测试组件使用 useMessage
    const TestComponent = () => {
      const message = useMessage();

      return (
        <button
          onClick={() => message.add({ content: "Hook 消息测试" })}
          data-testid="add-button"
        >
          添加消息
        </button>
      );
    };

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    act(() => {
      screen.getByTestId("add-button").click();
    });

    expect(document.body.textContent).toContain("Hook 消息测试");
  });

  it("测试不同类型的消息", () => {
    const messageRef = { current: null as unknown as MessageRef };

    render(<Message ref={messageRef} />);

    act(() => {
      messageRef.current.add({
        content: "成功消息",
        type: "success",
      });

      messageRef.current.add({
        content: "错误消息",
        type: "error",
      });

      messageRef.current.add({
        content: "警告消息",
        type: "warning",
      });

      messageRef.current.add({
        content: "信息消息",
        type: "info",
      });
    });

    expect(document.body.textContent).toContain("成功消息");
    expect(document.body.textContent).toContain("错误消息");
    expect(document.body.textContent).toContain("警告消息");
    expect(document.body.textContent).toContain("信息消息");
  });
});
