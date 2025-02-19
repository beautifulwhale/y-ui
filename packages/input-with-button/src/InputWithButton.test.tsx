import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputWithButton from './index';

describe('InputWithButton', () => {
  it('renders correctly and submits value', () => {
    const handleSubmit = vi.fn();
    const { getByPlaceholderText, getByText } = render(<InputWithButton onSubmit={handleSubmit} />);

    const input = getByPlaceholderText('输入内容');
    fireEvent.change(input, { target: { value: '测试' } });
    fireEvent.click(getByText('提交'));

    expect(handleSubmit).toHaveBeenCalledWith('测试');
  });
}); 