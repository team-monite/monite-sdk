import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const COLORS = [
  '#9999FF',
  '#E3135C',
  '#900838',
  '#FFBB28',
  '#FF8042',
  '#165c03',
  '#153765',
  '#3f027e',
  '#6ddfce',
  '#aa3264',
];
export const DATE_FORMATS = [
  'yyyy-MM-dd',
  'yy-MM-dd',
  'dd-MM-yyyy',
  'dd-MM-yy',
  'dd.MM.yyyy',
  'dd.MM.yy',
  'yyyy/MM/dd',
  'yy/MM/dd',
  'dd/MM/yyyy',
  'dd/MM/yy', // eslint-disable-next-line lingui/no-unlocalized-strings
  'MM/dd/yyyy', // eslint-disable-next-line lingui/no-unlocalized-strings
  'MM/dd/yy',
];
export const TIME_FORMATS = [
  '', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' HH:mm', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' HH:mm', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' HH:mm:ss', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' HH:mm:ss', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' hh:mm:ss aa', // eslint-disable-next-line lingui/no-unlocalized-strings
  ' hh:mm aa',
];

export const getDefaultPrompts = (i18n: I18n) => [
  {
    id: '1',
    content: t(i18n)`Give me all invoices I still have unpaid`,
    created_at: '2025-03-10T09:33:53.715Z',
  },
  {
    id: '2',
    content: t(
      i18n
    )`List all customers who have overdue payments for more than 60 days`,
    created_at: '2025-03-10T09:33:53.715Z',
  },
  {
    id: '3',
    content: t(
      i18n
    )`Give me the total amount of receivables overdue by more than 30 days`,
    created_at: '2025-03-10T09:33:53.715Z',
  },
  {
    id: '4',
    content: t(i18n)`Who are my customers?`,
    created_at: '2025-03-10T09:33:53.715Z',
  },
];

export const getFeedbackOptions = (i18n: I18n) => [
  { feedback: t(i18n)`This information is not correct` },
  { feedback: t(i18n)`Didn’t follow prompt input` },
];
