import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { MoniteOptions, useThemeProps } from '@mui/material';

const optionsName = 'MoniteOptions';

export function useDateTimeFormat() {
  const { dateTimeFormat } = useThemeProps({
    props: {} as MoniteOptions,
    name: optionsName,
  });
  return dateTimeFormat || DateTimeFormatOptions.EightDigitDateWithTime; // Legacy default value
}
