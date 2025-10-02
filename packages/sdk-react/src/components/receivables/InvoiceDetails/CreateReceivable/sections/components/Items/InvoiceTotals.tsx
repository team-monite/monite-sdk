import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TotalTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  className?: string;
}

const TotalTableItem = ({ label, value, className }: TotalTableItemProps) => {
  return (
    <li
      className={twMerge(
        'mtw:flex mtw:justify-between mtw:items-center',
        className
      )}
    >
      <span>{label}</span>
      <span>{value?.toString()}</span>
    </li>
  );
};

interface InvoiceTotalsProps {
  subtotalPrice?: Price;
  totalTaxes?: Price;
  totalPrice?: Price;
  taxesByVatRate?: Record<number, number>;
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
}

export const InvoiceTotals = ({
  subtotalPrice,
  totalTaxes,
  totalPrice,
  taxesByVatRate = {},
  actualCurrency,
  defaultCurrency,
}: InvoiceTotalsProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <ul className="mtw:w-full mtw:flex mtw:flex-col mtw:gap-2 mtw:list-none">
      <TotalTableItem
        label={t(i18n)`Subtotal`}
        value={subtotalPrice}
        className="mtw:text-sm mtw:font-normal mtw:text-neutral-50"
      />

      {Object.entries(taxesByVatRate)?.length > 0 ? (
        Object.entries(taxesByVatRate).map(([taxRate, totalTax]) => (
          <TotalTableItem
            key={taxRate}
            label={t(i18n)`Total Tax (${taxRate}%)`}
            value={formatCurrencyToDisplay(
              totalTax,
              actualCurrency || defaultCurrency || 'USD',
              true
            )?.toString()}
            className="mtw:text-sm mtw:font-normal mtw:text-neutral-50"
          />
        ))
      ) : (
        <TotalTableItem
          label={t(i18n)`Taxes total`}
          value={totalTaxes}
          className="mtw:text-sm mtw:font-normal mtw:text-neutral-50"
        />
      )}

      <TotalTableItem
        label={t(i18n)`Total`}
        value={totalPrice}
        className="mtw:text-base mtw:font-medium mtw:text-neutral-10"
      />
    </ul>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
