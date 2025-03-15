import { type CSSProperties, type ReactNode, useState } from "react";
import { Dayjs } from "dayjs";
import cs from "classnames";
import dayjs from "dayjs";
import { useControllableValue } from "ahooks";
import "./index.scss";
import MonthCalendar from "./MonthCalendar.tsx";
import Header from "./Header.tsx";
import { LocaleContext } from "./locale";
import type { LocaleType } from "./locale/type";

export interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  classname?: string | string[];
  style?: CSSProperties;
  dateRender?: (date: Dayjs) => ReactNode;
  dateCellRender?: (date: Dayjs) => ReactNode;
  locale?: LocaleType;
  onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {
  const { value, style, classname, locale, onChange } = props;
  const classnames = cs("calendar", classname);
  const [curDate, setCurDate] = useControllableValue<Dayjs>(value, {
    defaultValue: dayjs(new Date()),
  });
  const [curMonth, setCurMonth] = useState<Dayjs>(curDate);

  const selectChangeDay = (d: Dayjs) => {
    changeDate(d);
  };

  const monthChange = (d: Dayjs, type: string) => {
    setCurMonth(type === "prev" ? d.subtract(1, "month") : d.add(1, "month"));
  };

  const todayChange = () => {
    const date = dayjs(new Date());
    changeDate(date);
  };

  const changeDate = (date: Dayjs) => {
    setCurDate(date);
    setCurMonth(date);
    onChange?.(date);
  };
  return (
    <>
      <LocaleContext.Provider value={locale! || navigator.language}>
        <div className={classnames} style={style}>
          <Header
            curMonth={curMonth}
            monthChange={monthChange}
            todayChange={todayChange}
          />
          <MonthCalendar
            {...props}
            value={curDate}
            curMonth={curMonth}
            selectChange={selectChangeDay}
          />
        </div>
      </LocaleContext.Provider>
    </>
  );
}

export { Calendar };
