import { Control, Controller, useFormContext } from 'react-hook-form';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FormControlLabel, Radio, RadioGroup, Switch } from '@mui/material';

import { OtherSettingsFormValues } from '../types';

type Props = {
  control: Control<OtherSettingsFormValues>;
};

export const DisplaySignatureSection = ({ control }: Props) => {
  const { i18n } = useLingui();
  const { watch, setValue } = useFormContext<OtherSettingsFormValues>();

  const isQuoteSignatureSelected = watch('quote_signature_display');

  return (
    <section className="mtw:flex mtw:flex-col mtw:gap-6">
      <div className="mtw:flex mtw:justify-between mtw:gap-4">
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <h2 className="mtw:text-lg mtw:font-semibold mtw:text-neutral-30">{t(
            i18n
          )`Display signature section on a Quote`}</h2>
          <p className="mtw:text-sm mtw:font-normal mtw:text-neutral-50">{t(
            i18n
          )`Add a dedicated space for signature on PDF`}</p>
        </div>

        <Controller
          name="quote_signature_display"
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              color="primary"
              onChange={(event) => {
                if (!event.target.checked) {
                  setValue('quote_electronic_signature', false);
                }

                field.onChange(event.target.checked);
              }}
              checked={field.value}
              aria-label={t(i18n)`Display signature section display options`}
            />
          )}
        />
      </div>

      {isQuoteSignatureSelected && (
        <Controller
          name="quote_electronic_signature"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <FormControlLabel
                sx={{
                  mx: 0,
                  alignItems: 'center !important',
                  '& .MuiFormControlLabel-label': {
                    padding: '0 !important',
                  },
                }}
                control={<Radio value="false" size="small" />}
                label={
                  <>
                    <span className="mtw:font-medium mtw:text-neutral-10">{t(
                      i18n
                    )`Physical signature for quotes`}</span>
                    <br />
                    <span className="mtw:text-neutral-50">
                      {t(i18n)`Printed quotes are signed physically`}
                    </span>
                  </>
                }
              />

              <FormControlLabel
                sx={{
                  mx: 0,
                  alignItems: 'center !important',
                  '& .MuiFormControlLabel-label': {
                    padding: '0 !important',
                  },
                }}
                control={<Radio value="true" size="small" />}
                label={
                  <>
                    <span className="mtw:font-medium mtw:text-neutral-10">
                      {t(i18n)`Electronic signature for quotes`}
                    </span>
                    <br />
                    <span className="mtw:text-neutral-50">
                      {t(
                        i18n
                      )`Quotes are signed virtually, both parties get the signed version via email`}
                    </span>
                  </>
                }
              />
            </RadioGroup>
          )}
        />
      )}
    </section>
  );
};
