import type { AnalyticsInterval } from "../api/types.gen.js";

export type DatePreset = 7 | 30 | 90 | 365 | "custom";

export type AnalyticsDateRange = {
  from: string;
  to: string;
  interval: AnalyticsInterval;
};

export type AnalyticsCalendarDay = {
  date: string;
  day: number;
  outsideMonth: boolean;
  today: boolean;
};

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);

export function dateRangeForPreset(
  preset: number,
  today = new Date(),
): AnalyticsDateRange {
  const to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - (preset - 1));

  return {
    from: toDateOnly(from),
    to: toDateOnly(to),
    interval: intervalForRange(preset),
  };
}

export function intervalForRange(inclusiveDays: number): AnalyticsInterval {
  if (inclusiveDays <= 30) return "Day";
  if (inclusiveDays <= 90) return "Week";
  return "Month";
}

export function inclusiveRangeDays(range: Pick<AnalyticsDateRange, "from" | "to">): number {
  const from = Date.parse(`${range.from}T00:00:00Z`);
  const to = Date.parse(`${range.to}T00:00:00Z`);
  return Math.floor((to - from) / 86_400_000) + 1;
}

export function normalizeCustomRange(from: string, to: string): AnalyticsDateRange | undefined {
  const fromDate = new Date(`${from}T00:00:00Z`);
  const toDate = new Date(`${to}T00:00:00Z`);
  if (!from || !to || Number.isNaN(fromDate.valueOf()) || Number.isNaN(toDate.valueOf()) || fromDate > toDate) {
    return undefined;
  }

  const days = Math.floor((toDate.valueOf() - fromDate.valueOf()) / 86_400_000) + 1;
  return { from, to, interval: intervalForRange(days) };
}

export function calendarMonthDays(
  month: string,
  today = new Date(),
): AnalyticsCalendarDay[] {
  const viewDate = new Date(`${month}T00:00:00Z`);
  if (Number.isNaN(viewDate.valueOf())) return [];

  const firstOfMonth = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), 1));
  const mondayOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const firstVisibleDay = new Date(firstOfMonth);
  firstVisibleDay.setUTCDate(firstVisibleDay.getUTCDate() - mondayOffset);
  const todayValue = toDateOnly(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisibleDay);
    date.setUTCDate(firstVisibleDay.getUTCDate() + index);
    const value = toDateOnly(date);
    return {
      date: value,
      day: date.getUTCDate(),
      outsideMonth: date.getUTCMonth() !== firstOfMonth.getUTCMonth(),
      today: value === todayValue,
    };
  });
}

export function shiftCalendarMonth(month: string, offset: number): string {
  const date = new Date(`${month}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) return month;
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return toDateOnly(date);
}

export function formatAnalyticsRangeLabel(
  range: Pick<AnalyticsDateRange, "from" | "to">,
  preset: DatePreset,
  locale?: string,
): string {
  if (preset !== "custom") return `Last ${preset === 365 ? "12 months" : `${preset} days`}`;

  const from = new Date(`${range.from}T00:00:00Z`);
  const to = new Date(`${range.to}T00:00:00Z`);
  if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) return "Custom range";

  const sameYear = from.getUTCFullYear() === to.getUTCFullYear();
  const sameMonth = sameYear && from.getUTCMonth() === to.getUTCMonth();
  const monthDay = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" });
  const monthDayYear = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

  if (sameMonth) {
    const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(from);
    return `${month} ${from.getUTCDate()} – ${to.getUTCDate()}`;
  }

  if (sameYear) return `${monthDay.format(from)} – ${monthDay.format(to)}`;
  return `${monthDayYear.format(from)} – ${monthDayYear.format(to)}`;
}

export function formatAnalyticsDate(
  timestamp: string,
  interval: AnalyticsInterval,
  locale?: string,
): string {
  const date = new Date(timestamp);
  if (interval === "Month") {
    const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(date);
    return `${month} ’${String(date.getUTCFullYear()).slice(-2)}`;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatAnalyticsTooltipDate(
  timestamp: string,
  interval: AnalyticsInterval,
  locale?: string,
): string {
  const label = formatAnalyticsDate(timestamp, interval, locale);
  if (interval !== "Day") return label;

  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(timestamp));

  return `${label} · ${weekday}`;
}

export function isAnalyticsPeriodInProgress(
  timestamp: string,
  interval: AnalyticsInterval,
  now = new Date(),
): boolean {
  const start = new Date(timestamp);
  if (Number.isNaN(start.valueOf())) return false;

  const end = new Date(start);
  if (interval === "Month") {
    end.setUTCMonth(end.getUTCMonth() + 1);
  } else {
    end.setUTCDate(end.getUTCDate() + (interval === "Week" ? 7 : 1));
  }

  return start <= now && now < end;
}
