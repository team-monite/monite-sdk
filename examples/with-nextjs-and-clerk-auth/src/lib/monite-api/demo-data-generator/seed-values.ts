import { getRandomItemFromArray } from '@/lib/monite-api/demo-data-generator/general.service';
import { components } from '@/lib/monite-api/schema';

export const bankCountriesToCurrencies = {
  DE: 'EUR',
  GB: 'GBP',
} satisfies Partial<
  Record<
    components['schemas']['AllowedCountries'],
    components['schemas']['CurrencyEnum']
  >
>;

/**
 * Returns a random country for data generation. Currently, we support 'DE', 'GB' with 'US' to be implemented in future
 */
export const chooseRandomCountryForDataGeneration = () => {
  return getRandomItemFromArray(
    Object.keys(bankCountriesToCurrencies)
  ) as keyof typeof bankCountriesToCurrencies;
};

export const demoBankAccountBICList = {
  DE: [
    'DEUTDEFF',
    'COBADEFF',
    'DRESDEFF',
    'HYVEDEMM',
    'BYLADEM1',
    'BAYBDE61',
    'GENODEF1',
    'SOGEDEFF',
    'DEUTDEBB',
    'DEUTDE3BXXX',
  ],
  GB: [
    'BARCGB22',
    'HBUKGB4B',
    'LOYDGB2L',
    'NWBKGB2L',
    'RBOSGB2L',
    'MIDLGB22',
    'BOFIGB2B',
    'BSCHGB2L',
    'CHASGB2L',
    'CITIGB2L',
  ],
};
