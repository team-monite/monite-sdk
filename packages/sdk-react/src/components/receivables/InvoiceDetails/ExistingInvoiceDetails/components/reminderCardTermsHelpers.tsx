import type { ReactNode } from 'react';

import { components } from '@/api';
import { I18n } from '@lingui/core';
import { plural, t } from '@lingui/macro';

type ReminderCardTerm = {
  termPeriodName: ReactNode;
  termPeriods: ReactNode[];
};

export const createOverdueReminderCardTerms = (
  i18n: I18n,
  overdueReminder: components['schemas']['OverdueReminderResponse'] | undefined
): [ReminderCardTerm] => {
  return [
    {
      termPeriodName: t(i18n)`Overdue`,
      termPeriods:
        overdueReminder?.terms?.map(({ days_after }) => {
          const day_plural = createDayPluralForm(i18n, days_after);
          return t(i18n)`${days_after} ${day_plural} overdue`;
        }) ?? [],
    },
  ];
};

export const createPaymentReminderCardTerms = (
  i18n: I18n,
  reminder: components['schemas']['PaymentReminder']
): ReminderCardTerm[] => {
  return [
    {
      reminderTerm: reminder.term_1_reminder,
      termPeriodName: t(i18n)`1st discount period`,
      isDueDate: false,
    },
    {
      reminderTerm: reminder.term_2_reminder,
      termPeriodName: t(i18n)`2nd discount period`,
      isDueDate: false,
    },
    {
      reminderTerm: reminder.term_final_reminder,
      termPeriodName: t(i18n)`Due date`,
      isDueDate: true,
    },
  ].reduce<
    {
      termPeriodName: ReactNode;
      termPeriods: ReactNode[];
    }[]
  >((acc, { reminderTerm, termPeriodName, isDueDate }) => {
    if (!reminderTerm) return acc;
    const { days_before } = reminderTerm;
    const day_plural = createDayPluralForm(i18n, days_before);

    return [
      ...acc,
      {
        termPeriodName,
        termPeriods: [
          isDueDate
            ? t(i18n)`${days_before} ${day_plural} till overdue`
            : t(i18n)`${days_before} ${day_plural} before overdue`,
        ],
      },
    ];
  }, []);
};

export const createDayPluralForm = (i18n: I18n, days: number) =>
  t(i18n)`${plural(days, {
    one: 'day',
    two: 'days',
    few: 'days',
    many: 'days',
    zero: 'days',
    other: 'days',
  })}`;
