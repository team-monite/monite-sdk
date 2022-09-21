export const CURRENCIES = {
  USD: { name: 'USD', minor_units: 2 },
  EUR: { name: 'EUR', minor_units: 2 },
  JPY: { name: 'JPY', minor_units: 0 },
  GBP: { name: 'GBP', minor_units: 2 },
  AUD: { name: 'AUD', minor_units: 2 },
  CAD: { name: 'CAD', minor_units: 2 },
  CHF: { name: 'CHF', minor_units: 2 },
  CNY: { name: 'CNY', minor_units: 2 },
  HKD: { name: 'HKD', minor_units: 2 },
  NZD: { name: 'NZD', minor_units: 2 },
  SEK: { name: 'SEK', minor_units: 0 },
  KRW: { name: 'KRW', minor_units: 2 },
  SGD: { name: 'SGD', minor_units: 2 },
  NOK: { name: 'NOK', minor_units: 2 },
  MXN: { name: 'MXN', minor_units: 2 },
  INR: { name: 'INR', minor_units: 2 },
  RUB: { name: 'RUB', minor_units: 2 },
  ZAR: { name: 'ZAR', minor_units: 2 },
  TRY: { name: 'TRY', minor_units: 2 },
  BRL: { name: 'BRL', minor_units: 2 },
};

const DEFAULT_MINOR_UNITS = 2;

export const formatAmountFromMinor = (
  amount: number,
  currency: string
): number => {
  //@ts-ignore
  if (CURRENCIES[currency as Keys<CURRENCIES>]?.minor_units) {
    //@ts-ignore

    return amount / 10 ** CURRENCIES[currency].minor_units;
  }
  return amount / 10 ** DEFAULT_MINOR_UNITS;
};
