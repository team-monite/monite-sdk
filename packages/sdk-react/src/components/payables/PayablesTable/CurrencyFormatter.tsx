import { useContext } from 'react';

import { useCurrencies } from '@/core/hooks';
import { CurrencyEnum } from '@monite/sdk-api';

export const CurrencyFormatter = ({
  amountInMinorUnits,
  currency,
}: {
  amountInMinorUnits: string | number;
  currency: CurrencyEnum | string;
}) => {
  const settings = useSettings('CurrencyFormatter', SettingsContext);

  const { formatCurrencyToDisplay } = useCurrencies();

  return <>{formatCurrencyToDisplay(amountInMinorUnits, currency)}</>;
};
