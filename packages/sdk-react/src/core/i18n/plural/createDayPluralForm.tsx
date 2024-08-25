import { I18n } from '@lingui/core';
import { plural, t } from '@lingui/macro';

export const createDayPluralForm = (i18n: I18n, days: number) =>
  t(i18n)`${plural(days, {
    one: 'day',
    two: 'days',
    few: 'days',
    many: 'days',
    zero: 'days',
    other: 'days',
  })}`;
