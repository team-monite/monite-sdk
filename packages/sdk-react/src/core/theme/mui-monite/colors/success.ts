import { getSeverityColors } from '@/core/theme/mui-monite/colors/severity';

export const getSuccessColors = (mainColor: string) => ({
  ...getSeverityColors(mainColor),
  10: '#12705f',
  30: '#0dac8e',
  50: '#1fbca0',
  60: '#4dd6bd',
  80: '#ace5da',
  90: '#ccf0e9',
  95: '#eefbf9',
});
