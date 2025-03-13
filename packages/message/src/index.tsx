import { forwardRef, ReactNode, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import useStore from "./useStore";
import cs from "classnames";
import "./index.scss";

export interface MessageProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string | number;
  duration?: number;
  type?: "success" | "error" | "warning" | "info";
  content: string | ReactNode;
  onClose?: () => void;
}

export interface MessageItemProps {
  item: MessageProps;
  onRemove: (id: string | number) => void; // 添加 onRemove 方法
}

export interface MessageRef {
  add: (message: MessageProps) => void;
  update: (message: MessageProps) => void;
  remove: (id: string | number) => void;
  clearAll: () => void;
}

const MessageItem = ({ item, onRemove }: MessageItemProps) => {
  const { style, className, content, id, duration } = item;
  const classNames = cs("message-item", className);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 清除现有定时器的函数
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 设置新定时器
  useEffect(() => {
    clearTimer();
    
    // 只有当持续时间不是无限的时候才设置定时器
    if (duration !== Infinity) {
      timerRef.current = setTimeout(() => {
        onRemove(id!);
      }, duration || 3000);
    }

    return clearTimer;
  }, [id, duration, content, onRemove, clearTimer]);

  return (
    <div
      style={{
        width: 100,
        lineHeight: "30px",
        border: "1px solid #000",
        margin: "20px",
        ...style,
      }}
      className={classNames}
    >
      {content}
    </div>
  );
};

const Message = forwardRef<MessageRef, object>((_, ref) => {
  const { messageList, add, remove, update, clearAll } = useStore();

  if (ref && 'current' in ref) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }

  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = "wrapper";
    document.body.appendChild(el);
    return el;
  }, []);

  const messageWrapper = (
    <div className="message-wrapper">
      {messageList.map((message) => (
        <MessageItem key={message.id} item={message} onRemove={remove} />
      ))}
    </div>
  );

  return createPortal(messageWrapper, el);
});

export default Message;

export { ConfigProvider } from './ConfigProvider';
export { useMessage } from './useMessage';
