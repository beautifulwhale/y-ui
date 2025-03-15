import React, { useState } from "react";
import { Input } from "@y-ui/input";
import { Button } from "@y-ui/button";

export interface InputWithButtonProps {
  onSubmit: (value: string) => void;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onSubmit(value);
    setValue("");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Input value={value} onChange={setValue} placeholder="输入内容" />
      <Button onClick={handleClick} type="primary">
        提交
      </Button>
    </div>
  );
};

export default InputWithButton;
