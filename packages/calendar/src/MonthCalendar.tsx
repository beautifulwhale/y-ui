import { Dayjs } from "dayjs";
import { CalendarProps } from ".";
import { useContext } from "react";
import cs from "classnames";
import { LocaleContext, localeInfo } from "./locale";

const getAllDays = (date: Dayjs) => {
  const days = new Array(6 * 7).fill(null);
  const daysInMonth = date.daysInMonth();
  const startDate = date.startOf("month");
  const day = startDate.day();

  for (let i = 0; i < day; i++) {
    days[i] = {
      date: startDate.subtract(day - i, "day"),
      currentMonth: false,
    };
  }

  for (let i = day; i < days.length; i++) {
    days[i] = {
      date: startDate.add(i - day, "day"),
      currentMonth: i < daysInMonth + day,
    };
  }

  return days;
};

interface MonthCalendarProps extends CalendarProps {
  selectChange?: (date: Dayjs) => void;
  curMonth?: Dayjs;
}

function MonthCalendar(props: MonthCalendarProps) {
  const { value, dateRender, dateCellRender, selectChange, curMonth } = props;
  const weekList = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const allDays = getAllDays(curMonth!);
  const locale = useContext(LocaleContext);
  const locales = localeInfo[locale];

  function renderDay(days: Array<{ date: Dayjs; currentMonth: boolean }>) {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        const item = days[i * 7 + j];
        row[j] = (
          <div
            key={item.date.format("YYYY-MM-DD")}
            className={
              "calendar-month-body-cell " +
              (item.currentMonth ? "calendar-month-body-cell-current" : "")
            }
          >
            {dateRender ? (
              dateRender(item.date)
            ) : (
              <div
                className="calendar-month-body-cell-date"
                onClick={() => selectChange?.(item.date)}
              >
                <div
                  className={cs(
                    "calendar-month-body-cell-date-value",
                    value?.format("YYYY-MM-DD") ===
                      item.date.format("YYYY-MM-DD")
                      ? "calendar-month-body-cell-date-selected"
                      : ""
                  )}
                >
                  {item.date.date()}
                </div>
                <div className="calendar-month-cell-body-date-content">
                  {dateCellRender?.(item.date)}
                </div>
              </div>
            )}
          </div>
        );
      }
      rows.push(
        <div className="calendar-month-body-row" key={`row-${i}`}>
          {row}
        </div>
      );
    }
    return rows;
  }

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((w) => (
          <div className="calendar-month-week-list-item" key={`week-${w}`}>
            {locales.week[w] as string}
          </div>
        ))}
      </div>
      <div className="calendar-month-body">{renderDay(allDays)}</div>
    </div>
  );
}

export default MonthCalendar;
