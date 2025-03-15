import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default',
  disabled = false,
  className = ''
}) => {
  const baseClass = `y-button-${type}`;
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}; 