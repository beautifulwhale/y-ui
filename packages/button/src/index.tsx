import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`y-button y-button-${type}`}
    >
      {children}
    </button>
  );
}; 