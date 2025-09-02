import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { fromMinorUnits, toMinorUnits } from './currency';

export type CurrenciesType = Record<CurrencyEnum, string>;

export type CurrencyType = {
  code: CurrencyEnum;
  label: string;
};

export const getCurrencies = (i18n: I18n): CurrenciesType => ({
  AED: t(i18n)`United Arab Emirates Dirham`,
  AFN: t(i18n)`Afghan Afghani`,
  ALL: t(i18n)`Albanian Lek`,
  AMD: t(i18n)`Armenian Dram`,
  ANG: t(i18n)`Netherlands Antillean Guilder`,
  AOA: t(i18n)`Angolan Kwanza`,
  ARS: t(i18n)`Argentine Peso`,
  AUD: t(i18n)`Australian Dollar`,
  AWG: t(i18n)`Aruban Florin`,
  AZN: t(i18n)`Azerbaijani Manat`,
  BAM: t(i18n)`Bosnia and Herzegovina Convertible Mark`,
  BBD: t(i18n)`Barbadian Dollar`,
  BDT: t(i18n)`Bangladeshi Taka`,
  BGN: t(i18n)`Bulgarian Lev`,
  BHD: t(i18n)`Bahraini Dinar`,
  BIF: t(i18n)`Burundian Franc`,
  BMD: t(i18n)`Bermudian Dollar`,
  BND: t(i18n)`Brunei Dollar`,
  BOB: t(i18n)`Bolivian Boliviano`,
  BRL: t(i18n)`Brazilian Real`,
  BSD: t(i18n)`Bahamian Dollar`,
  BTN: t(i18n)`Bhutanese Ngultrum`,
  BWP: t(i18n)`Botswana Pula`,
  BYN: t(i18n)`Belarusian Ruble`,
  BZD: t(i18n)`Belize Dollar`,
  CAD: t(i18n)`Canadian Dollar`,
  CDF: t(i18n)`Congolese Franc`,
  CHF: t(i18n)`Swiss Franc`,
  CLP: t(i18n)`Chilean Peso`,
  CNY: t(i18n)`Chinese Yuan`,
  COP: t(i18n)`Colombian Peso`,
  CRC: t(i18n)`Costa Rican Colón`,
  CVE: t(i18n)`Cape Verdean Escudo`,
  CZK: t(i18n)`Czech Koruna`,
  DJF: t(i18n)`Djiboutian Franc`,
  DKK: t(i18n)`Danish Krone`,
  DOP: t(i18n)`Dominican Peso`,
  DZD: t(i18n)`Algerian Dinar`,
  EGP: t(i18n)`Egyptian Pound`,
  ETB: t(i18n)`Ethiopian Birr`,
  EUR: t(i18n)`Euro`,
  FJD: t(i18n)`Fijian Dollar`,
  FKP: t(i18n)`Falkland Islands Pound`,
  GBP: t(i18n)`British Pound Sterling`,
  GEL: t(i18n)`Georgian Lari`,
  GHS: t(i18n)`Ghanaian Cedi`,
  GIP: t(i18n)`Gibraltar Pound`,
  GMD: t(i18n)`Gambian Dalasi`,
  GNF: t(i18n)`Guinean Franc`,
  GTQ: t(i18n)`Guatemalan Quetzal`,
  GYD: t(i18n)`Guyanese Dollar`,
  HKD: t(i18n)`Hong Kong Dollar`,
  HNL: t(i18n)`Honduran Lempira`,
  HTG: t(i18n)`Haitian Gourde`,
  HUF: t(i18n)`Hungarian Forint`,
  IDR: t(i18n)`Indonesian Rupiah`,
  ILS: t(i18n)`Israeli New Shekel`,
  INR: t(i18n)`Indian Rupee`,
  IQD: t(i18n)`Iraqi Dinar`,
  ISK: t(i18n)`Icelandic Króna`,
  JMD: t(i18n)`Jamaican Dollar`,
  JOD: t(i18n)`Jordanian Dinar`,
  JPY: t(i18n)`Japanese Yen`,
  KES: t(i18n)`Kenyan Shilling`,
  KGS: t(i18n)`Kyrgystani Som`,
  KHR: t(i18n)`Cambodian Riel`,
  KMF: t(i18n)`Comorian Franc`,
  KRW: t(i18n)`South Korean Won`,
  KWD: t(i18n)`Kuwaiti Dinar`,
  KYD: t(i18n)`Cayman Islands Dollar`,
  KZT: t(i18n)`Kazakhstani Tenge`,
  LAK: t(i18n)`Laotian Kip`,
  LBP: t(i18n)`Lebanese Pound`,
  LKR: t(i18n)`Sri Lankan Rupee`,
  LRD: t(i18n)`Liberian Dollar`,
  LSL: t(i18n)`Lesotho Loti`,
  LYD: t(i18n)`Libyan Dinar`,
  MAD: t(i18n)`Moroccan Dirham`,
  MDL: t(i18n)`Moldovan Leu`,
  MGA: t(i18n)`Malagasy Ariary`,
  MKD: t(i18n)`Macedonian Denar`,
  MMK: t(i18n)`Burmese Kyat`,
  MNT: t(i18n)`Mongolian Tugrik`,
  MOP: t(i18n)`Macanese Pataca`,
  MUR: t(i18n)`Mauritian Rupee`,
  MVR: t(i18n)`Maldivian Rufiyaa`,
  MWK: t(i18n)`Malawian Kwacha`,
  MXN: t(i18n)`Mexican Peso`,
  MYR: t(i18n)`Malaysian Ringgit`,
  MZN: t(i18n)`Mozambican Metical`,
  NAD: t(i18n)`Namibian Dollar`,
  NGN: t(i18n)`Nigerian Naira`,
  NIO: t(i18n)`Nicaraguan Córdoba`,
  NOK: t(i18n)`Norwegian Krone`,
  NPR: t(i18n)`Nepalese Rupee`,
  NZD: t(i18n)`New Zealand Dollar`,
  OMR: t(i18n)`Omani Rial`,
  PAB: t(i18n)`Panamanian Balboa`,
  PEN: t(i18n)`Peruvian Sol`,
  PGK: t(i18n)`Papua New Guinean Kina`,
  PHP: t(i18n)`Philippine Peso`,
  PKR: t(i18n)`Pakistani Rupee`,
  PLN: t(i18n)`Polish Złoty`,
  PYG: t(i18n)`Paraguayan Guarani`,
  QAR: t(i18n)`Qatari Rial`,
  TMT: t(i18n)`Turkmenistan Manat`,
  RON: t(i18n)`Romanian Leu`,
  RSD: t(i18n)`Serbian Dinar`,
  RUB: t(i18n)`Russian Ruble`,
  RWF: t(i18n)`Rwandan Franc`,
  SAR: t(i18n)`Saudi Riyal`,
  SBD: t(i18n)`Solomon Islands Dollar`,
  SCR: t(i18n)`Seychellois Rupee`,
  SEK: t(i18n)`Swedish Krona`,
  SGD: t(i18n)`Singapore Dollar`,
  SHP: t(i18n)`Saint Helena Pound`,
  SLE: t(i18n)`Sierra Leonean Leone`,
  SOS: t(i18n)`Somali Shilling`,
  SRD: t(i18n)`Surinamese Dollar`,
  SSP: t(i18n)`South Sudanese Pound`,
  SVC: t(i18n)`Salvadoran Colón`,
  SZL: t(i18n)`Swazi Lilangeni`,
  THB: t(i18n)`Thai Baht`,
  TJS: t(i18n)`Tajikistani Somoni`,
  TND: t(i18n)`Tunisian Dinar`,
  TOP: t(i18n)`Tongan Paʻanga`,
  TRY: t(i18n)`Turkish Lira`,
  TTD: t(i18n)`Trinidad and Tobago Dollar`,
  TWD: t(i18n)`New Taiwan Dollar`,
  TZS: t(i18n)`Tanzanian Shilling`,
  UAH: t(i18n)`Ukrainian Hryvnia`,
  UGX: t(i18n)`Ugandan Shilling`,
  USD: t(i18n)`United States Dollar`,
  UYU: t(i18n)`Uruguayan Peso`,
  UZS: t(i18n)`Uzbekistan Som`,
  VND: t(i18n)`Vietnamese Đồng`,
  VUV: t(i18n)`Vanuatu Vatu`,
  WST: t(i18n)`Samoan Tala`,
  XAF: t(i18n)`Central African CFA Franc`,
  XCD: t(i18n)`East Caribbean Dollar`,
  XOF: t(i18n)`West African CFA Franc`,
  XPF: t(i18n)`CFP Franc`,
  YER: t(i18n)`Yemeni Rial`,
  ZAR: t(i18n)`South African Rand`,
  ZMW: t(i18n)`Zambian Kwacha`,
});

export const defaultAvailableCurrencies: readonly CurrencyEnum[] = [
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AUD',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BRL',
  'BSD',
  'BTN',
  'BWP',
  'BYN',
  'BZD',
  'CAD',
  'CDF',
  'CHF',
  'CLP',
  'CNY',
  'COP',
  'CRC',
  'CVE',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EGP',
  'ETB',
  'EUR',
  'FJD',
  'FKP',
  'GBP',
  'GEL',
  'GHS',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'IQD',
  'ISK',
  'JMD',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KMF',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LRD',
  'LSL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'TMT',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SEK',
  'SGD',
  'SHP',
  'SLE',
  'SOS',
  'SRD',
  'SSP',
  'SVC',
  'SZL',
  'THB',
  'TJS',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'UYU',
  'UZS',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XCD',
  'XOF',
  'XPF',
  'YER',
  'ZAR',
  'ZMW',
] as const;

export const getCurrenciesArray = (i18n: I18n): Array<CurrencyType> =>
  Object.entries(getCurrencies(i18n)).map(([code, label]) => ({
    code: code as CurrencyEnum,
    label,
  }));

type CurrencyEnum = components['schemas']['CurrencyEnum'];

export interface CurrencyGroup {
  title: string;
  predicate: (option: CurrencyType) => boolean;
}

export const filterOptions = (
  options: CurrencyType[],
  state: { inputValue: string }
): CurrencyType[] => {
  const { inputValue } = state;
  const lowerCaseInput = inputValue.toLowerCase().trim();

  if (!lowerCaseInput) {
    return options;
  }

  return options.filter(
    (option) =>
      option.code.toLowerCase().includes(lowerCaseInput) ||
      option.label.toLowerCase().includes(lowerCaseInput)
  );
};

export const getGroupTitleForOption = (
  option: CurrencyType,
  groups?: CurrencyGroup[]
): { title: string; index: number } => {
  if (!groups) {
    return { title: '', index: Infinity };
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (group.predicate(option)) {
      return { title: group.title, index: i };
    }
  }

  return { title: '', index: groups.length };
};

export const sortCurrencyOptionsByGroup = (
  options: CurrencyType[],
  groups?: CurrencyGroup[]
): CurrencyType[] => {
  if (!groups) {
    return options;
  }

  return [...options].sort((a, b) => {
    const groupA = getGroupTitleForOption(a, groups);
    const groupB = getGroupTitleForOption(b, groups);

    if (groupA.index !== groupB.index) {
      return groupA.index - groupB.index;
    }

    if (groupA.title === '' && groupB.title === '') {
      return a.label.localeCompare(b.label);
    }
    return groupA.title.localeCompare(groupB.title);
  });
};

/**
 * Converts a currency rate from minor units (API format) to major units (UI display format)
 * Example: 2000 -> 20
 * Uses core currency conversion utilities for consistency and precision.
 * Rates always use 2 decimal places.
 * @param rateMinor The rate value in minor units (as received from API)
 * @returns The rate value in major units (for UI display)
 */
export const rateMinorToMajor = (rateMinor: number): number => {
  return fromMinorUnits(rateMinor, 2);
};

/**
 * Converts a currency rate from major units (UI display format) to minor units (API format)
 * Example: 20 -> 2000
 * Uses core currency conversion utilities for consistency and precision.
 * Rates always use 2 decimal places.
 * @param rateMajor The rate value in major units (from UI)
 * @returns The rate value in minor units (for API)
 */
export const rateMajorToMinor = (rateMajor: number): number => {
  return toMinorUnits(rateMajor, 2);
};
