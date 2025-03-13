import { useState } from "react";
import { MessageProps } from ".";

const initMessageList = [] as MessageProps[];

let currentId = 0;

const useStore = () => {
  const [messageList, setMessageList] = useState(initMessageList);

  const add = (message: Omit<MessageProps, 'id'>) => {
    const id = ++currentId;
    const newMessage = { ...message, id };

    setMessageList((prev) => {
      return [...prev, newMessage];
    });
  };

  const update = (message: MessageProps) => {
    setMessageList((prev) => {
      const index = prev.findIndex((item) => item.id === message.id);
      if (index === -1) return prev;
      const next = [...prev];
      next[index] = message;
      return next;
    });
  };

  const remove = (id: string | number) => {
    setMessageList((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const clearAll = () => {
    setMessageList(initMessageList);
  }

  return {
    messageList,
    add,
    update,
    remove,
    clearAll,
  }
};

export default useStore;
