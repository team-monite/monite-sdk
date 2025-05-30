import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export type CountriesType = Record<string, string>;

export type CountryType = {
  code: AllowedCountries;
  label: string;
};

export const getCountriesArray = (i18n: I18n): CountryType[] =>
  Object.entries(getCountries(i18n)).map(([code, label]) => ({
    code: code as AllowedCountries,
    label,
  }));

export const getCountries = (i18n: I18n): CountriesType => ({
  AF: t(i18n)`Afghanistan`,
  AX: t(i18n)`Aland Islands`,
  AL: t(i18n)`Albania`,
  DZ: t(i18n)`Algeria`,
  AS: t(i18n)`American Samoa`,
  AD: t(i18n)`Andorra`,
  AO: t(i18n)`Angola`,
  AI: t(i18n)`Anguilla`,
  AQ: t(i18n)`Antarctica`,
  AG: t(i18n)`Antigua And Barbuda`,
  AR: t(i18n)`Argentina`,
  AM: t(i18n)`Armenia`,
  AW: t(i18n)`Aruba`,
  AU: t(i18n)`Australia`,
  AT: t(i18n)`Austria`,
  AZ: t(i18n)`Azerbaijan`,
  BS: t(i18n)`Bahamas`,
  BH: t(i18n)`Bahrain`,
  BD: t(i18n)`Bangladesh`,
  BB: t(i18n)`Barbados`,
  BY: t(i18n)`Belarus`,
  BE: t(i18n)`Belgium`,
  BZ: t(i18n)`Belize`,
  BJ: t(i18n)`Benin`,
  BM: t(i18n)`Bermuda`,
  BT: t(i18n)`Bhutan`,
  BO: t(i18n)`Bolivia`,
  BA: t(i18n)`Bosnia And Herzegovina`,
  BW: t(i18n)`Botswana`,
  BV: t(i18n)`Bouvet Island`,
  BR: t(i18n)`Brazil`,
  IO: t(i18n)`British Indian Ocean Territory`,
  BN: t(i18n)`Brunei Darussalam`,
  BG: t(i18n)`Bulgaria`,
  BF: t(i18n)`Burkina Faso`,
  BI: t(i18n)`Burundi`,
  KH: t(i18n)`Cambodia`,
  CM: t(i18n)`Cameroon`,
  CA: t(i18n)`Canada`,
  CV: t(i18n)`Cape Verde`,
  KY: t(i18n)`Cayman Islands`,
  CF: t(i18n)`Central African Republic`,
  TD: t(i18n)`Chad`,
  CL: t(i18n)`Chile`,
  CN: t(i18n)`China`,
  CX: t(i18n)`Christmas Island`,
  CC: t(i18n)`Cocos (Keeling) Islands`,
  CO: t(i18n)`Colombia`,
  KM: t(i18n)`Comoros`,
  CG: t(i18n)`Congo`,
  CD: t(i18n)`Congo, Democratic Republic`,
  CK: t(i18n)`Cook Islands`,
  CR: t(i18n)`Costa Rica`,
  CI: t(i18n)`Cote D"Ivoire`,
  HR: t(i18n)`Croatia`,
  CU: t(i18n)`Cuba`,
  CY: t(i18n)`Cyprus`,
  CZ: t(i18n)`Czech Republic`,
  DK: t(i18n)`Denmark`,
  DJ: t(i18n)`Djibouti`,
  DM: t(i18n)`Dominica`,
  DO: t(i18n)`Dominican Republic`,
  EC: t(i18n)`Ecuador`,
  EG: t(i18n)`Egypt`,
  SV: t(i18n)`El Salvador`,
  GQ: t(i18n)`Equatorial Guinea`,
  ER: t(i18n)`Eritrea`,
  EE: t(i18n)`Estonia`,
  ET: t(i18n)`Ethiopia`,
  FK: t(i18n)`Falkland Islands (Malvinas)`,
  FO: t(i18n)`Faroe Islands`,
  FJ: t(i18n)`Fiji`,
  FI: t(i18n)`Finland`,
  FR: t(i18n)`France`,
  GF: t(i18n)`French Guiana`,
  PF: t(i18n)`French Polynesia`,
  TF: t(i18n)`French Southern Territories`,
  GA: t(i18n)`Gabon`,
  GM: t(i18n)`Gambia`,
  GE: t(i18n)`Georgia`,
  DE: t(i18n)`Germany`,
  GH: t(i18n)`Ghana`,
  GI: t(i18n)`Gibraltar`,
  GR: t(i18n)`Greece`,
  GL: t(i18n)`Greenland`,
  GD: t(i18n)`Grenada`,
  GP: t(i18n)`Guadeloupe`,
  GU: t(i18n)`Guam`,
  GT: t(i18n)`Guatemala`,
  GG: t(i18n)`Guernsey`,
  GN: t(i18n)`Guinea`,
  GW: t(i18n)`Guinea-Bissau`,
  GY: t(i18n)`Guyana`,
  HT: t(i18n)`Haiti`,
  HM: t(i18n)`Heard Island & Mcdonald Islands`,
  VA: t(i18n)`Holy See (Vatican City State)`,
  HN: t(i18n)`Honduras`,
  HK: t(i18n)`Hong Kong`,
  HU: t(i18n)`Hungary`,
  IS: t(i18n)`Iceland`,
  IN: t(i18n)`India`,
  ID: t(i18n)`Indonesia`,
  IR: t(i18n)`Iran, Islamic Republic Of`,
  IQ: t(i18n)`Iraq`,
  IE: t(i18n)`Ireland`,
  IM: t(i18n)`Isle Of Man`,
  IL: t(i18n)`Israel`,
  IT: t(i18n)`Italy`,
  JM: t(i18n)`Jamaica`,
  JP: t(i18n)`Japan`,
  JE: t(i18n)`Jersey`,
  JO: t(i18n)`Jordan`,
  KZ: t(i18n)`Kazakhstan`,
  KE: t(i18n)`Kenya`,
  KI: t(i18n)`Kiribati`,
  KR: t(i18n)`Korea`,
  KP: t(i18n)`North Korea`,
  KW: t(i18n)`Kuwait`,
  KG: t(i18n)`Kyrgyzstan`,
  LA: t(i18n)`Lao People"s Democratic Republic`,
  LV: t(i18n)`Latvia`,
  LB: t(i18n)`Lebanon`,
  LS: t(i18n)`Lesotho`,
  LR: t(i18n)`Liberia`,
  LY: t(i18n)`Libyan Arab Jamahiriya`,
  LI: t(i18n)`Liechtenstein`,
  LT: t(i18n)`Lithuania`,
  LU: t(i18n)`Luxembourg`,
  MO: t(i18n)`Macao`,
  MK: t(i18n)`Macedonia`,
  MG: t(i18n)`Madagascar`,
  MW: t(i18n)`Malawi`,
  MY: t(i18n)`Malaysia`,
  MV: t(i18n)`Maldives`,
  ML: t(i18n)`Mali`,
  MT: t(i18n)`Malta`,
  MH: t(i18n)`Marshall Islands`,
  MQ: t(i18n)`Martinique`,
  MR: t(i18n)`Mauritania`,
  MU: t(i18n)`Mauritius`,
  YT: t(i18n)`Mayotte`,
  MX: t(i18n)`Mexico`,
  FM: t(i18n)`Micronesia, Federated States Of`,
  MD: t(i18n)`Moldova`,
  MC: t(i18n)`Monaco`,
  MN: t(i18n)`Mongolia`,
  MS: t(i18n)`Montserrat`,
  MA: t(i18n)`Morocco`,
  MZ: t(i18n)`Mozambique`,
  MM: t(i18n)`Myanmar`,
  NA: t(i18n)`Namibia`,
  NR: t(i18n)`Nauru`,
  NP: t(i18n)`Nepal`,
  NL: t(i18n)`Netherlands`,
  AN: t(i18n)`Netherlands Antilles`,
  NC: t(i18n)`New Caledonia`,
  NZ: t(i18n)`New Zealand`,
  NI: t(i18n)`Nicaragua`,
  NE: t(i18n)`Niger`,
  NG: t(i18n)`Nigeria`,
  NU: t(i18n)`Niue`,
  NF: t(i18n)`Norfolk Island`,
  MP: t(i18n)`Northern Mariana Islands`,
  NO: t(i18n)`Norway`,
  OM: t(i18n)`Oman`,
  PK: t(i18n)`Pakistan`,
  PW: t(i18n)`Palau`,
  PS: t(i18n)`Palestinian Territory, Occupied`,
  PA: t(i18n)`Panama`,
  PG: t(i18n)`Papua New Guinea`,
  PY: t(i18n)`Paraguay`,
  PE: t(i18n)`Peru`,
  PH: t(i18n)`Philippines`,
  PN: t(i18n)`Pitcairn`,
  PL: t(i18n)`Poland`,
  PT: t(i18n)`Portugal`,
  PR: t(i18n)`Puerto Rico`,
  QA: t(i18n)`Qatar`,
  RE: t(i18n)`Reunion`,
  RO: t(i18n)`Romania`,
  RU: t(i18n)`Russian Federation`,
  RW: t(i18n)`Rwanda`,
  SH: t(i18n)`Saint Helena`,
  KN: t(i18n)`Saint Kitts And Nevis`,
  LC: t(i18n)`Saint Lucia`,
  PM: t(i18n)`Saint Pierre And Miquelon`,
  VC: t(i18n)`Saint Vincent And Grenadines`,
  WS: t(i18n)`Samoa`,
  SM: t(i18n)`San Marino`,
  ST: t(i18n)`Sao Tome And Principe`,
  SA: t(i18n)`Saudi Arabia`,
  CS: t(i18n)`Serbia and Montenegro`,
  SN: t(i18n)`Senegal`,
  SC: t(i18n)`Seychelles`,
  SL: t(i18n)`Sierra Leone`,
  SG: t(i18n)`Singapore`,
  SK: t(i18n)`Slovakia`,
  SI: t(i18n)`Slovenia`,
  SB: t(i18n)`Solomon Islands`,
  SO: t(i18n)`Somalia`,
  ZA: t(i18n)`South Africa`,
  GS: t(i18n)`South Georgia And Sandwich Isl.`,
  ES: t(i18n)`Spain`,
  LK: t(i18n)`Sri Lanka`,
  SD: t(i18n)`Sudan`,
  SR: t(i18n)`Suriname`,
  SJ: t(i18n)`Svalbard And Jan Mayen`,
  SZ: t(i18n)`Swaziland`,
  SE: t(i18n)`Sweden`,
  CH: t(i18n)`Switzerland`,
  SY: t(i18n)`Syrian Arab Republic`,
  TW: t(i18n)`Taiwan`,
  TJ: t(i18n)`Tajikistan`,
  TZ: t(i18n)`Tanzania`,
  TH: t(i18n)`Thailand`,
  TL: t(i18n)`Timor-Leste`,
  TG: t(i18n)`Togo`,
  TK: t(i18n)`Tokelau`,
  TO: t(i18n)`Tonga`,
  TT: t(i18n)`Trinidad And Tobago`,
  TN: t(i18n)`Tunisia`,
  TR: t(i18n)`Turkey`,
  TM: t(i18n)`Turkmenistan`,
  TC: t(i18n)`Turks And Caicos Islands`,
  TV: t(i18n)`Tuvalu`,
  UG: t(i18n)`Uganda`,
  UA: t(i18n)`Ukraine`,
  AE: t(i18n)`United Arab Emirates`,
  GB: t(i18n)`United Kingdom`,
  US: t(i18n)`United States`,
  UM: t(i18n)`United States Outlying Islands`,
  UY: t(i18n)`Uruguay`,
  UZ: t(i18n)`Uzbekistan`,
  VU: t(i18n)`Vanuatu`,
  VE: t(i18n)`Venezuela`,
  VN: t(i18n)`Vietnam`,
  VG: t(i18n)`Virgin Islands, British`,
  VI: t(i18n)`Virgin Islands, U.S.`,
  WF: t(i18n)`Wallis And Futuna`,
  EH: t(i18n)`Western Sahara`,
  YE: t(i18n)`Yemen`,
  ZM: t(i18n)`Zambia`,
  ZW: t(i18n)`Zimbabwe`,
});

export const defaultAvailableCountries: AllowedCountries[] = [
  'AF',
  'AX',
  'AL',
  'DZ',
  'AS',
  'AD',
  'AO',
  'AI',
  'AQ',
  'AG',
  'AR',
  'AM',
  'AW',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BM',
  'BT',
  'BO',
  'BA',
  'BW',
  'BV',
  'BR',
  'IO',
  'BN',
  'BG',
  'BF',
  'BI',
  'KH',
  'CM',
  'CA',
  'CV',
  'KY',
  'CF',
  'TD',
  'CL',
  'CN',
  'CX',
  'CC',
  'CO',
  'KM',
  'CG',
  'CD',
  'CK',
  'CR',
  'CI',
  'HR',
  'CU',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'ET',
  'FK',
  'FO',
  'FJ',
  'FI',
  'FR',
  'GF',
  'PF',
  'TF',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GI',
  'GR',
  'GL',
  'GD',
  'GP',
  'GU',
  'GT',
  'GG',
  'GN',
  'GW',
  'GY',
  'HT',
  'HM',
  'VA',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IM',
  'IL',
  'IT',
  'JM',
  'JP',
  'JE',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KR',
  'KP',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MK',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MQ',
  'MR',
  'MU',
  'YT',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'MS',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'AN',
  'NC',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NU',
  'NF',
  'MP',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PN',
  'PL',
  'PT',
  'PR',
  'QA',
  'RE',
  'RO',
  'RU',
  'RW',
  'SH',
  'KN',
  'LC',
  'PM',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'SC',
  'SL',
  'SG',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'GS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SJ',
  'SZ',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TK',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TC',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UM',
  'UY',
  'UZ',
  'VU',
  'VE',
  'VN',
  'VG',
  'VI',
  'WF',
  'EH',
  'YE',
  'ZM',
  'ZW',
];

export const countryCurrencyList = [
  { country: 'AF', currency: 'AFN' },
  { country: 'AX', currency: 'EUR' },
  { country: 'AL', currency: 'ALL' },
  { country: 'DZ', currency: 'DZD' },
  { country: 'AS', currency: 'USD' },
  { country: 'AD', currency: 'EUR' },
  { country: 'AO', currency: 'AOA' },
  { country: 'AI', currency: 'XCD' },
  { country: 'AQ', currency: '' },
  { country: 'AG', currency: 'XCD' },
  { country: 'AR', currency: 'ARS' },
  { country: 'AM', currency: 'AMD' },
  { country: 'AW', currency: 'AWG' },
  { country: 'AU', currency: 'AUD' },
  { country: 'AT', currency: 'EUR' },
  { country: 'AZ', currency: 'AZN' },
  { country: 'BS', currency: 'BSD' },
  { country: 'BH', currency: 'BHD' },
  { country: 'BD', currency: 'BDT' },
  { country: 'BB', currency: 'BBD' },
  { country: 'BY', currency: 'BYN' },
  { country: 'BE', currency: 'EUR' },
  { country: 'BZ', currency: 'BZD' },
  { country: 'BJ', currency: 'XOF' },
  { country: 'BM', currency: 'BMD' },
  { country: 'BT', currency: 'BTN' },
  { country: 'BO', currency: 'BOB' },
  { country: 'BA', currency: 'BAM' },
  { country: 'BW', currency: 'BWP' },
  { country: 'BV', currency: 'NOK' },
  { country: 'BR', currency: 'BRL' },
  { country: 'IO', currency: 'USD' },
  { country: 'BN', currency: 'BND' },
  { country: 'BG', currency: 'BGN' },
  { country: 'BF', currency: 'XOF' },
  { country: 'BI', currency: 'BIF' },
  { country: 'KH', currency: 'KHR' },
  { country: 'CM', currency: 'XAF' },
  { country: 'CA', currency: 'CAD' },
  { country: 'CV', currency: 'CVE' },
  { country: 'KY', currency: 'KYD' },
  { country: 'CF', currency: 'XAF' },
  { country: 'TD', currency: 'XAF' },
  { country: 'CL', currency: 'CLP' },
  { country: 'CN', currency: 'CNY' },
  { country: 'CX', currency: 'AUD' },
  { country: 'CC', currency: 'AUD' },
  { country: 'CO', currency: 'COP' },
  { country: 'KM', currency: 'KMF' },
  { country: 'CG', currency: 'XAF' },
  { country: 'CD', currency: 'CDF' },
  { country: 'CK', currency: 'NZD' },
  { country: 'CR', currency: 'CRC' },
  { country: 'CI', currency: 'XOF' },
  { country: 'HR', currency: 'EUR' },
  { country: 'CU', currency: 'CUP' },
  { country: 'CY', currency: 'EUR' },
  { country: 'CZ', currency: 'CZK' },
  { country: 'DK', currency: 'DKK' },
  { country: 'DJ', currency: 'DJF' },
  { country: 'DM', currency: 'XCD' },
  { country: 'DO', currency: 'DOP' },
  { country: 'EC', currency: 'USD' },
  { country: 'EG', currency: 'EGP' },
  { country: 'SV', currency: 'SVC' },
  { country: 'GQ', currency: 'XAF' },
  { country: 'ER', currency: 'ERN' },
  { country: 'EE', currency: 'EUR' },
  { country: 'ET', currency: 'ETB' },
  { country: 'FK', currency: 'FKP' },
  { country: 'FO', currency: 'DKK' },
  { country: 'FJ', currency: 'FJD' },
  { country: 'FI', currency: 'EUR' },
  { country: 'FR', currency: 'EUR' },
  { country: 'GF', currency: 'EUR' },
  { country: 'PF', currency: 'XPF' },
  { country: 'TF', currency: 'EUR' },
  { country: 'GA', currency: 'XAF' },
  { country: 'GM', currency: 'GMD' },
  { country: 'GE', currency: 'GEL' },
  { country: 'DE', currency: 'EUR' },
  { country: 'GH', currency: 'GHS' },
  { country: 'GI', currency: 'GIP' },
  { country: 'GR', currency: 'EUR' },
  { country: 'GL', currency: 'DKK' },
  { country: 'GD', currency: 'XCD' },
  { country: 'GP', currency: 'EUR' },
  { country: 'GU', currency: 'USD' },
  { country: 'GT', currency: 'GTQ' },
  { country: 'GG', currency: 'GBP' },
  { country: 'GN', currency: 'GNF' },
  { country: 'GW', currency: 'XOF' },
  { country: 'GY', currency: 'GYD' },
  { country: 'HT', currency: 'HTG' },
  { country: 'HM', currency: 'AUD' },
  { country: 'VA', currency: 'EUR' },
  { country: 'HN', currency: 'HNL' },
  { country: 'HK', currency: 'HKD' },
  { country: 'HU', currency: 'HUF' },
  { country: 'IS', currency: 'ISK' },
  { country: 'IN', currency: 'INR' },
  { country: 'ID', currency: 'IDR' },
  { country: 'IR', currency: 'IRR' },
  { country: 'IQ', currency: 'IQD' },
  { country: 'IE', currency: 'EUR' },
  { country: 'IM', currency: 'GBP' },
  { country: 'IL', currency: 'ILS' },
  { country: 'IT', currency: 'EUR' },
  { country: 'JM', currency: 'JMD' },
  { country: 'JP', currency: 'JPY' },
  { country: 'JE', currency: 'GBP' },
  { country: 'JO', currency: 'JOD' },
  { country: 'KZ', currency: 'KZT' },
  { country: 'KE', currency: 'KES' },
  { country: 'KI', currency: 'AUD' },
  { country: 'KR', currency: 'KRW' },
  { country: 'KP', currency: 'KPW' },
  { country: 'KW', currency: 'KWD' },
  { country: 'KG', currency: 'KGS' },
  { country: 'LA', currency: 'LAK' },
  { country: 'LV', currency: 'EUR' },
  { country: 'LB', currency: 'LBP' },
  { country: 'LS', currency: 'LSL' },
  { country: 'LR', currency: 'LRD' },
  { country: 'LY', currency: 'LYD' },
  { country: 'LI', currency: 'CHF' },
  { country: 'LT', currency: 'EUR' },
  { country: 'LU', currency: 'EUR' },
  { country: 'MO', currency: 'MOP' },
  { country: 'MK', currency: 'MKD' },
  { country: 'MG', currency: 'MGA' },
  { country: 'MW', currency: 'MWK' },
  { country: 'MY', currency: 'MYR' },
  { country: 'MV', currency: 'MVR' },
  { country: 'ML', currency: 'XOF' },
  { country: 'MT', currency: 'EUR' },
  { country: 'MH', currency: 'USD' },
  { country: 'MQ', currency: 'EUR' },
  { country: 'MR', currency: 'MRU' },
  { country: 'MU', currency: 'MUR' },
  { country: 'YT', currency: 'EUR' },
  { country: 'MX', currency: 'MXN' },
  { country: 'FM', currency: 'USD' },
  { country: 'MD', currency: 'MDL' },
  { country: 'MC', currency: 'EUR' },
  { country: 'MN', currency: 'MNT' },
  { country: 'MS', currency: 'XCD' },
  { country: 'MA', currency: 'MAD' },
  { country: 'MZ', currency: 'MZN' },
  { country: 'MM', currency: 'MMK' },
  { country: 'NA', currency: 'NAD' },
  { country: 'NR', currency: 'AUD' },
  { country: 'NP', currency: 'NPR' },
  { country: 'NL', currency: 'EUR' },
  { country: 'AN', currency: 'ANG' },
  { country: 'NC', currency: 'XPF' },
  { country: 'NZ', currency: 'NZD' },
  { country: 'NI', currency: 'NIO' },
  { country: 'NE', currency: 'XOF' },
  { country: 'NG', currency: 'NGN' },
  { country: 'NU', currency: 'NZD' },
  { country: 'NF', currency: 'AUD' },
  { country: 'MP', currency: 'USD' },
  { country: 'NO', currency: 'NOK' },
  { country: 'OM', currency: 'OMR' },
  { country: 'PK', currency: 'PKR' },
  { country: 'PW', currency: 'USD' },
  { country: 'PS', currency: '' },
  { country: 'PA', currency: 'PAB' },
  { country: 'PG', currency: 'PGK' },
  { country: 'PY', currency: 'PYG' },
  { country: 'PE', currency: 'PEN' },
  { country: 'PH', currency: 'PHP' },
  { country: 'PN', currency: 'NZD' },
  { country: 'PL', currency: 'PLN' },
  { country: 'PT', currency: 'EUR' },
  { country: 'PR', currency: 'USD' },
  { country: 'QA', currency: 'QAR' },
  { country: 'RE', currency: 'EUR' },
  { country: 'RO', currency: 'RON' },
  { country: 'RU', currency: 'RUB' },
  { country: 'RW', currency: 'RWF' },
  { country: 'SH', currency: 'SHP' },
  { country: 'KN', currency: 'XCD' },
  { country: 'LC', currency: 'XCD' },
  { country: 'PM', currency: 'EUR' },
  { country: 'VC', currency: 'XCD' },
  { country: 'WS', currency: 'WST' },
  { country: 'SM', currency: 'EUR' },
  { country: 'ST', currency: 'STN' },
  { country: 'SA', currency: 'SAR' },
  { country: 'CS', currency: 'RSD' },
  { country: 'SN', currency: 'XOF' },
  { country: 'SC', currency: 'SCR' },
  { country: 'SL', currency: 'SLE' },
  { country: 'SG', currency: 'SGD' },
  { country: 'SK', currency: 'EUR' },
  { country: 'SI', currency: 'EUR' },
  { country: 'SB', currency: 'SBD' },
  { country: 'SO', currency: 'SOS' },
  { country: 'ZA', currency: 'ZAR' },
  { country: 'GS', currency: '' },
  { country: 'ES', currency: 'EUR' },
  { country: 'LK', currency: 'LKR' },
  { country: 'SD', currency: 'SDG' },
  { country: 'SR', currency: 'SRD' },
  { country: 'SJ', currency: 'NOK' },
  { country: 'SZ', currency: 'SZL' },
  { country: 'SE', currency: 'SEK' },
  { country: 'CH', currency: 'CHF' },
  { country: 'SY', currency: 'SYP' },
  { country: 'TW', currency: 'TWD' },
  { country: 'TJ', currency: 'TJS' },
  { country: 'TZ', currency: 'TZS' },
  { country: 'TH', currency: 'THB' },
  { country: 'TL', currency: 'USD' },
  { country: 'TG', currency: 'XOF' },
  { country: 'TK', currency: 'NZD' },
  { country: 'TO', currency: 'TOP' },
  { country: 'TT', currency: 'TTD' },
  { country: 'TN', currency: 'TND' },
  { country: 'TR', currency: 'TRY' },
  { country: 'TM', currency: 'TMT' },
  { country: 'TC', currency: 'USD' },
  { country: 'TV', currency: 'AUD' },
  { country: 'UG', currency: 'UGX' },
  { country: 'UA', currency: 'UAH' },
  { country: 'AE', currency: 'AED' },
  { country: 'GB', currency: 'GBP' },
  { country: 'UM', currency: 'USD' },
  { country: 'US', currency: 'USD' },
  { country: 'UY', currency: 'UYU' },
  { country: 'UZ', currency: 'UZS' },
  { country: 'VU', currency: 'VUV' },
  { country: 'VE', currency: 'VEF' },
  { country: 'VN', currency: 'VND' },
  { country: 'VG', currency: 'USD' },
  { country: 'VI', currency: 'USD' },
  { country: 'WF', currency: 'XPF' },
  { country: 'EH', currency: 'MAD' },
  { country: 'YE', currency: 'YER' },
  { country: 'ZM', currency: 'ZMW' },
  { country: 'ZW', currency: 'ZWL' },
];

type AllowedCountries = components['schemas']['AllowedCountries'];
