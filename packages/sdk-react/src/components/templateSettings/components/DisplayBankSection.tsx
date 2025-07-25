import { useState } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Checkbox, FormControlLabel, Switch } from '@mui/material';

import { OtherSettingsFormValues } from '../types';

type Props = {
  control: Control<OtherSettingsFormValues>;
  shouldShowBankOptionsByDefault: boolean;
};

export const DisplayBankSection = ({
  control,
  shouldShowBankOptionsByDefault,
}: Props) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const { setValue, watch } = useFormContext<OtherSettingsFormValues>();
  const [isShowing, setIsShowing] = useState(shouldShowBankOptionsByDefault);

  const availableOptions =
    componentSettings?.templateSettings?.availableARDocuments;
  const availableOptionKey =
    `${availableOptions?.[0]}_bank_display` as keyof OtherSettingsFormValues;
  const availableOptionValue = watch(availableOptionKey);

  if (availableOptions?.length === 1) {
    return (
      <section className="mtw:flex mtw:justify-between mtw:gap-4">
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <h2 className="mtw:text-base mtw:font-medium mtw:text-neutral-30">{t(
            i18n
          )`Display bank account details on PDF`}</h2>
          <p className="mtw:text-sm mtw:font-normal mtw:text-neutral-50">{t(
            i18n
          )`Your customers can make direct bank transfers outside the payment links`}</p>
        </div>

        <Switch
          onChange={(event) => {
            setValue(availableOptionKey, event.target.checked, {
              shouldDirty: true,
            });
          }}
          checked={Boolean(availableOptionValue)}
          color="primary"
          aria-label={t(i18n)`Display bank display options`}
        />
      </section>
    );
  }

  return (
    <section className="mtw:flex mtw:flex-col mtw:gap-6">
      <div className="mtw:flex mtw:justify-between mtw:gap-4">
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <h2 className="mtw:text-base mtw:font-medium mtw:text-neutral-30">{t(
            i18n
          )`Display bank account details on PDF`}</h2>
          <p className="mtw:text-sm mtw:font-normal mtw:text-neutral-50">{t(
            i18n
          )`Your customers can make direct bank transfers outside the payment links`}</p>
        </div>

        <Switch
          checked={isShowing}
          onChange={(event) => {
            if (!event.target.checked) {
              setValue('credit_note_bank_display', false, {
                shouldDirty: true,
              });
              setValue('invoice_bank_display', false, { shouldDirty: true });
              setValue('quote_bank_display', false, { shouldDirty: true });
            }

            setIsShowing(!isShowing);
          }}
          color="primary"
          aria-label={t(i18n)`Display bank display options`}
        />
      </div>
      {isShowing && (
        <div className="mtw:flex mtw:flex-col">
          {componentSettings?.templateSettings?.availableARDocuments?.includes(
            'invoice'
          ) && (
            <Controller
              name="invoice_bank_display"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{
                    mx: 0,
                    alignItems: 'center !important',
                    '& .MuiFormControlLabel-label': {
                      padding: '0 !important',
                    },
                  }}
                  control={
                    <Checkbox {...field} size="small" checked={field.value} />
                  }
                  label={t(i18n)`Invoice`}
                />
              )}
            />
          )}

          {componentSettings?.templateSettings?.availableARDocuments?.includes(
            'quote'
          ) && (
            <Controller
              name="quote_bank_display"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{
                    mx: 0,
                    alignItems: 'center !important',
                    '& .MuiFormControlLabel-label': {
                      padding: '0 !important',
                    },
                  }}
                  control={
                    <Checkbox {...field} size="small" checked={field.value} />
                  }
                  label={t(i18n)`Quote`}
                />
              )}
            />
          )}

          {componentSettings?.templateSettings?.availableARDocuments?.includes(
            'credit_note'
          ) && (
            <Controller
              name="credit_note_bank_display"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{
                    mx: 0,
                    alignItems: 'center !important',
                    '& .MuiFormControlLabel-label': {
                      padding: '0 !important',
                    },
                  }}
                  control={
                    <Checkbox {...field} size="small" checked={field.value} />
                  }
                  label={t(i18n)`Credit note`}
                />
              )}
            />
          )}
        </div>
      )}
    </section>
  );
};
