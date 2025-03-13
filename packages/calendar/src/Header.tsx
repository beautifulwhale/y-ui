import { useContext } from "react";
import { Dayjs } from "dayjs";
import { LocaleContext, localeInfo } from "./locale";

interface HeaderProps {
  curMonth?: Dayjs;
  monthChange?: (date: Dayjs, type: string) => void;
  todayChange?: () => void;
}

function Header(props: HeaderProps) {
  const { curMonth, monthChange, todayChange } = props;
  const locale = useContext(LocaleContext);
  const locales = localeInfo[locale];

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div
          className="calendar-header-icon"
          onClick={() => monthChange?.(curMonth!, "prev")}
        >
          &lt;
        </div>
        <div className="calendar-header-value">
          {curMonth?.format(locales.formatMonth)}
        </div>
        <div
          className="calendar-header-icon"
          onClick={() => monthChange?.(curMonth!, "next")}
        >
          &gt;
        </div>
        <button className="calendar-header-btn" onClick={() => todayChange?.()}>{locales.today}</button>
      </div>
    </div>
  );
}

export default Header;
