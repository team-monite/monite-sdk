export type CurrenciesType = {
  code: string;
  label: string;
};

const currencies: readonly CurrenciesType[] = [
  {
    code: 'chf',
    label: 'CHF - Swiss Franc',
  },
  {
    code: 'dkk',
    label: 'DKK - Danish Krone',
  },
  {
    code: 'eur',
    label: 'EUR - Euro',
  },
  {
    code: 'gbp',
    label: 'GBP - British Pound',
  },
  {
    code: 'nok',
    label: 'NOK - Norwegian Krone',
  },
  {
    code: 'sek',
    label: 'SEK - Swedish Krona',
  },
  {
    code: 'usd',
    label: 'USD - US Dollar',
  },
];

export default currencies;
