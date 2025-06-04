import { Control, Controller } from 'react-hook-form';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Switch } from '@mui/material';

import { OtherSettingsFormValues } from '../types';

type Props = {
  control: Control<OtherSettingsFormValues>;
};

export const UpdatePaidInvoiceSection = ({ control }: Props) => {
  const { i18n } = useLingui();

  return (
    <section className="mtw:flex mtw:flex-col mtw:gap-6">
      <div className="mtw:flex mtw:justify-between mtw:gap-4">
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <h2 className="mtw:text-lg mtw:font-semibold mtw:text-neutral-30">{t(
            i18n
          )`Update PDF files for paid invoices`}</h2>
          <p className="mtw:text-sm mtw:font-normal mtw:text-neutral-50">{t(
            i18n
          )`Invoices will auto-regenerate reflecting payments made and the remaining due amount.`}</p>
          <p className="mtw:text-sm mtw:font-medium mtw:text-neutral-50">{t(
            i18n
          )`Once updated, you won't be able to revert the PDFs.`}</p>
        </div>

        <Controller
          name="update_paid_invoices"
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              color="primary"
              aria-label={t(i18n)`Enable update paid invoices pdf`}
              checked={field.value}
            />
          )}
        />
      </div>
    </section>
  );
};
