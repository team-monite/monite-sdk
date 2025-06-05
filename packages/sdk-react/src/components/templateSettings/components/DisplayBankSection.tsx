import { useState } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';

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
  const { setValue } = useFormContext<OtherSettingsFormValues>();
  const [isShowing, setIsShowing] = useState(shouldShowBankOptionsByDefault);

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
        </div>
      )}
    </section>
  );
};
