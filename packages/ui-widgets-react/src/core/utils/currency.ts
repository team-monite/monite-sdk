import { CurrencyEnum } from '@team-monite/sdk-api';

const CURRENCY_LIST: Readonly<Record<CurrencyEnum, string>> = {
  AED: 'AED',
  AFN: 'AFN',
  ALL: 'ALL',
  AMD: 'AMD',
  ANG: 'ANG',
  AOA: 'AOA',
  ARS: 'ARS',
  AUD: '$',
  AWG: 'AWG',
  AZN: 'AZN',
  BAM: 'BAM',
  BBD: 'BBD',
  BDT: 'BDT',
  BGN: 'BGN',
  BHD: 'BHD',
  BND: 'BND',
  BOB: 'BOB',
  BRL: 'R$',
  BSD: 'BSD',
  BWP: 'BWP',
  BZD: 'BZD',
  CAD: '$',
  CHF: 'CHF',
  CLP: 'CLP',
  CNY: '¥',
  COP: 'COP',
  CRC: 'CRC',
  CZK: 'CZK',
  DKK: 'DKK',
  DOP: 'DOP',
  DZD: 'DZD',
  EGP: 'EGP',
  ETB: 'ETB',
  EUR: '€',
  FJD: 'FJD',
  GBP: '£',
  GEL: 'GEL',
  GMD: 'GMD',
  GTQ: 'GTQ',
  GYD: 'GYD',
  HKD: '$',
  HNL: 'HNL',
  HRK: 'HRK',
  HUF: 'HUF',
  IDR: 'IDR',
  ILS: 'ILS',
  INR: '₹',
  ISK: 'ISK',
  JMD: 'JMD',
  JOD: 'JOD',
  JPY: '¥',
  KES: 'KES',
  KGS: 'KGS',
  KHR: 'KHR',
  KRW: '₩',
  KWD: 'KWD',
  KYD: 'KYD',
  KZT: 'KZT',
  LBP: 'LBP',
  LKR: 'LKR',
  MAD: 'MAD',
  MDL: 'MDL',
  MGA: 'MGA',
  MKD: 'MKD',
  MMK: 'MMK',
  MNT: 'MNT',
  MOP: 'MOP',
  MUR: 'MUR',
  MVR: 'MVR',
  MXN: '$',
  MYR: 'MYR',
  MZN: 'MZN',
  NAD: 'NAD',
  NGN: 'NGN',
  NIO: 'NIO',
  NOK: 'kr',
  NPR: 'NPR',
  NZD: '$',
  OMR: 'OMR',
  PEN: 'PEN',
  PGK: 'PGK',
  PHP: 'PHP',
  PKR: 'PKR',
  PLN: 'PLN',
  PYG: 'PYG',
  QAR: 'QAR',
  RON: 'RON',
  RSD: 'RSD',
  RUB: '₽',
  RWF: 'RWF',
  SAR: 'SAR',
  SCR: 'SCR',
  SEK: 'kr',
  SGD: 'S$',
  STD: 'STD',
  THB: 'THB',
  TND: 'TND',
  TRY: '₺',
  TTD: 'TTD',
  TWD: 'TWD',
  TZS: 'TZS',
  UAH: 'UAH',
  UGX: 'UGX',
  USD: '$',
  UYU: 'UYU',
  VND: 'VND',
  VUV: 'VUV',
  WST: 'WST',
  XAF: 'XAF',
  XCD: 'XCD',
  XOF: 'XOF',
  XPF: 'XPF',
  ZAR: 'R',
  ZMW: 'ZMW',
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
