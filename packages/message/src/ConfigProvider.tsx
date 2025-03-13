import { PropsWithChildren, RefObject, createContext, useRef } from "react";
import Message, { MessageRef } from ".";

interface ConfigProviderProps {
  messageRef: RefObject<MessageRef>;
}

export const ConfigContext = createContext<ConfigProviderProps>({ messageRef: { current: {} as MessageRef } });

export function ConfigProvider(props: PropsWithChildren) {
  const { children } = props;
  
  const messageRef = useRef<MessageRef>(null!);

  return (
    <ConfigContext.Provider value={{ messageRef }}>
      <Message ref={messageRef} />
      {children}
    </ConfigContext.Provider>
  );
}
