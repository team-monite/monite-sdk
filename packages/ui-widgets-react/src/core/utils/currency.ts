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

//https://stripe.com/docs/currencies?presentment-currency=EE#zero-decimal
const zeroDecimalCurrencyList = [
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
];

//https://stripe.com/docs/currencies?presentment-currency=EE#three-decimal
const threeDecimalCurrencyList = ['BHD', 'JOD', 'KWD', 'OMR', 'TND'];

function isZeroDecimalCurrency(currency: CurrencyEnum): boolean {
  return zeroDecimalCurrencyList.includes(currency);
}

function isThreeDecimalCurrency(currency: CurrencyEnum): boolean {
  return threeDecimalCurrencyList.includes(currency);
}

export function getSymbolFromCurrency(currency: CurrencyEnum): string {
  if (!CURRENCY_LIST[currency]) return currency;
  return CURRENCY_LIST[currency];
}

export function formatFromMinorUnits(
  amount: number,
  currency: CurrencyEnum
): number {
  if (isZeroDecimalCurrency(currency)) {
    return amount;
  }
  if (isThreeDecimalCurrency(currency)) {
    return Number((amount / 1000).toFixed(3));
  }
  return Number((amount / 100).toFixed(2));
}

export function formatToMinorUnits(
  amount: string | number,
  currency: CurrencyEnum
): number {
  if (isZeroDecimalCurrency(currency)) {
    return Number(amount);
  }
  if (isThreeDecimalCurrency(currency)) {
    return Number(amount) * 1000;
  }
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
