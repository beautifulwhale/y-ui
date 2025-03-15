import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs, { Dayjs } from 'dayjs';
import Calendar from '../index';

describe('Calendar', () => {
  // 在每个测试前设置模拟时间
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-05-15'));
  });

  // 在每个测试后恢复真实时间
  afterEach(() => {
    vi.useRealTimers();
  });

  it('渲染正确', () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('.calendar')).toBeDefined();
  });

  it('显示当前月份和年份', () => {
    render(<Calendar defaultValue={dayjs('2023-05-15')} />);
    expect(screen.getByText('May 2023')).toBeDefined();
  });

  it('点击今天按钮应该切换到当天', () => {
    const onChange = vi.fn();
    render(<Calendar defaultValue={dayjs('2022-01-01')} onChange={onChange} />);
    
    fireEvent.click(screen.getByText('Today'));
    
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
    const calledWithDate = onChange.mock.calls[0][0];
    expect(calledWithDate.format('YYYY-MM-DD')).toBe('2023-05-15');
  });

  it('点击上个月按钮应该切换到上个月', () => {
    render(<Calendar defaultValue={dayjs('2023-05-15')} />);
    
    fireEvent.click(screen.getByText('<'));
    
    expect(screen.getByText('Apr 2023')).toBeDefined();
  });

  it('点击下个月按钮应该切换到下个月', () => {
    render(<Calendar defaultValue={dayjs('2023-05-15')} />);
    
    fireEvent.click(screen.getByText('>'));
    
    expect(screen.getByText('Jun 2023')).toBeDefined();
  });

  it('点击日期应该触发onChange回调', () => {
    const onChange = vi.fn();
    render(<Calendar defaultValue={dayjs('2023-05-15')} onChange={onChange} />);
    
    // 找到并点击日期15
    const dateElements = screen.getAllByText('15');
    const currentMonthDate = dateElements.find(el => 
      el.closest('.calendar-month-body-cell-current')
    );
    if (currentMonthDate) {
      fireEvent.click(currentMonthDate);
    }
    
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
    expect(onChange.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2023-05-15');
  });

  it('支持中文本地化', () => {
    render(<Calendar defaultValue={dayjs('2023-05-15')} locale="zh-CN" />);
    
    expect(screen.getByText('2023 年 05 月')).toBeDefined();
    expect(screen.getByText('今天')).toBeDefined();
    expect(screen.getByText('周一')).toBeDefined();
  });

  it('支持自定义日期渲染', () => {
    const dateRender = (date: Dayjs) => (
      <div data-testid="custom-date">{date.format('DD/MM')}</div>
    );
    
    render(<Calendar defaultValue={dayjs('2023-05-15')} dateRender={dateRender} />);
    
    expect(screen.getAllByTestId('custom-date')).toHaveLength(42); // 6行7列
    // 使用 getAllByText 并找到特定的元素，因为可能有多个日期单元格
    const dateElements = screen.getAllByText('15/05');
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('支持自定义日期单元格内容渲染', () => {
    const dateCellRender = (date: Dayjs) => {
      if (date.format('YYYY-MM-DD') === '2023-05-15') {
        return <div data-testid="custom-cell-content">会议</div>;
      }
      return null;
    };
    
    render(<Calendar defaultValue={dayjs('2023-05-15')} dateCellRender={dateCellRender} />);
    
    expect(screen.getByTestId('custom-cell-content')).toBeDefined();
    expect(screen.getByText('会议')).toBeDefined();
  });
});
