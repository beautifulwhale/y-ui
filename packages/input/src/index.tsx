import React from 'react';

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => {
  return (
    <input
      className="y-input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      data-testid="custom-input"
    />
  );
}; 