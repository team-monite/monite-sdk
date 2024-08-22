/**
 * A class providing pre-defined date and time format options for use with Intl.DateTimeFormat.
 */
export class DateTimeFormatOptions {
  /**
   * Format options for an eight-digit date (e.g., "10/25/2023").
   * @example
   * ```
   * const date = new Date();
   * const formattedDate = i18n.date(date, DateTimeFormatOptions.EightDigitDate);
   * console.log(formattedDate); // Output: "10/25/2023"
   * ```
   */
  static EightDigitDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  /**
   * Format options for an eight-digit date with time (e.g., "10/25/2023, 12:30 PM").
   * @example
   * ```
   * const date = new Date();
   * const formattedDate = i18n.date(date, DateTimeFormatOptions.EightDigitDateWithTime);
   * console.log(formattedDate); // Output: "10/25/2023, 12:30"
   * ```
   */
  static EightDigitDateWithTime: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
}
