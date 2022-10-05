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

export function getSymbolFromCurrency(currency: CurrencyEnum): string {
  if (!CURRENCY_LIST[currency]) return currency;
  return CURRENCY_LIST[currency];
}

export function convertToMajorUnits(
  amount: number,
  currency: CurrencyEnum
): number {
  if (currency === CurrencyEnum.JPY) return amount;
  return Number((amount / 100).toFixed(2));
}

export function convertToMinorUnits(
  amount: string | number,
  currency: CurrencyEnum
): number {
  if (currency === CurrencyEnum.JPY) return Number(amount);
  return Number(amount) * 100;
}

export function getReadableAmount(
  amount: string | number,
  currency: CurrencyEnum
): string {
  return `${convertToMajorUnits(
    Number(amount),
    currency
  )} ${getSymbolFromCurrency(currency)}`;
}
