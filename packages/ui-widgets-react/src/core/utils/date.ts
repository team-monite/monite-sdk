import { format } from 'date-fns';

export const formatDate = (
  date: string | undefined,
  formatStr: string | undefined = 'dd.MM.yyyy'
): string => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};
