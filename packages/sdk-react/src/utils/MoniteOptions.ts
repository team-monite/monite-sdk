import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { MoniteOptions, useThemeProps } from '@mui/material';

const optionsName = 'MoniteOptions';

export function useDateFormat() {
  const { dateFormat } = useThemeProps({
    props: {} as MoniteOptions,
    name: optionsName,
  });
  return dateFormat || DateTimeFormatOptions.EightDigitDate; // Legacy default value
}
