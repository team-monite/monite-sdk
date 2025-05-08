import { getSeverityColors } from './severity';

export const getWarningColors = (mainColor: string) => ({
  ...getSeverityColors(mainColor),
  '10': '#996600',
  '30': '#cc8000',
  '50': '#ff9900',
  '60': '#ffb333',
  '80': '#ffd999',
  '90': '#ffe6cc',
  '95': '#fff3ee',
});
