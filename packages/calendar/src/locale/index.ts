import { createContext } from "react";
import zhCN from "./zh-CN";
import enUs from "./en-US";
import { CalendarType } from "./type";

export const localeInfo: Record<string, CalendarType> = {
  "zh-CN": zhCN,
  "en-US": enUs,
};

export const LocaleContext = createContext('zh-CN');
