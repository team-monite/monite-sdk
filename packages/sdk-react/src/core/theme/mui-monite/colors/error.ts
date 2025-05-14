import { getSeverityColors } from './severity';

export const getErrorColors = (mainColor: string) => ({
  ...getSeverityColors(mainColor),
  '10': '#992a37',
  '30': '#cc384a',
  '40': '#cc394b',
  '50': '#ff4793',
  '60': '#ff7a8a',
  '80': '#ffc4ca',
  '90': '#ffe0e3',
  '95': '#fff8f9',
});
