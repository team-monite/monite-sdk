import { getSeverityColors } from './severity';

export const getErrorColors = (mainColor: string) => ({
  ...getSeverityColors(mainColor),
  '10': '#D42623',
  '25': '#DF5C5A',
  '50': '#EA9391',
  '75': '#F4C9C8',
  '100': '#FCF1F1',
});
