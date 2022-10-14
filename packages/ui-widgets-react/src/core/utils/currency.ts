import { CurrencyEnum } from '@team-monite/sdk-api';

const CURRENCY_LIST: Readonly<Record<CurrencyEnum, string>> = {
  AUD: '$',
  BRL: 'R$',
  CAD: '$',
  CHF: 'CHF',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  HKD: '$',
  INR: '₹',
  JPY: '¥',
  KRW: '₩',
  MXN: '$',
  NOK: 'kr',
  NZD: '$',
  RUB: '₽',
  SEK: 'kr',
  SGD: 'S$',
  TRY: '₺',
  USD: '$',
  ZAR: 'R',
};

function isSpecificCurrency(currency: CurrencyEnum): boolean {
  return currency === CurrencyEnum.JPY || currency === CurrencyEnum.SEK;
}

export function getSymbolFromCurrency(currency: CurrencyEnum): string {
  if (!CURRENCY_LIST[currency]) return currency;
  return CURRENCY_LIST[currency];
}

export function formatFromMinorUnits(
  amount: number,
  currency: CurrencyEnum
): number {
  if (isSpecificCurrency(currency)) return amount;
  return Number((amount / 100).toFixed(2));
}

export function formatToMinorUnits(
  amount: string | number,
  currency: CurrencyEnum
): number {
  if (isSpecificCurrency(currency)) return Number(amount);
  return Number(amount) * 100;
}

export function getReadableAmount(
  amount: string | number,
  currency: string
): string {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  });

  return formatter.format(
    formatFromMinorUnits(Number(amount), `${currency}` as CurrencyEnum)
  );
}
