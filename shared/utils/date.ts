import dayjs from "dayjs";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const PHNOM_PENH_TZ = "Asia/Phnom_Penh";

dayjs.tz.setDefault(PHNOM_PENH_TZ);

/**
 * Format a date for display.
 *
 * @param value - ISO string, Date, or dayjs-parseable input. Falsy values return `""`.
 * @param format - dayjs token format; defaults to `"MMM D, YYYY"` (e.g. "Aug 1, 2026").
 * @returns The formatted string, or `""` when `value` is falsy.
 */
export function formatDate(
  value: string | Date | null | undefined,
  format = "MMM D, YYYY",
): string {
  if (!value) return "";
  return dayjs(value).tz(PHNOM_PENH_TZ).format(format);
}

/**
 * Format a date with a long month name, e.g. "August 1, 2026".
 *
 * @param value - ISO string, Date, or dayjs-parseable input. Falsy values return `""`.
 * @returns The formatted string, or `""` when `value` is falsy.
 */
export function formatDateLong(value: string | Date | null | undefined): string {
  return formatDate(value, "MMMM D, YYYY");
}

/**
 * Format a date as month + day only, e.g. "Aug 1". Used for chart axis labels.
 *
 * @param value - ISO string, Date, or dayjs-parseable input. Falsy values return `""`.
 * @returns The formatted string, or `""` when `value` is falsy.
 */
export function formatMonthDay(value: string | Date | null | undefined): string {
  return formatDate(value, "MMM D");
}

/**
 * Format a date as a `YYYY-MM-DD` value for `<input type="date">` controls.
 *
 * @param value - ISO string, Date, or dayjs-parseable input. Falsy values return `""`.
 * @returns The date-input string, or `""` when `value` is falsy.
 */
export function toDateInput(value: string | Date | null | undefined): string {
  return formatDate(value, "YYYY-MM-DD");
}
