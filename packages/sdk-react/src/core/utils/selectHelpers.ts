import { components } from '@/api';

import type { CurrenciesType } from './currencies';

export const currenciesToStringArray = (
  currencies: CurrenciesType
): Array<CurrencyEnum> =>
  Object.keys(currencies).map((currency) => currency as CurrencyEnum);

type CurrencyEnum = components['schemas']['CurrencyEnum'];
