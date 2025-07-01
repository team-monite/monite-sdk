import { useFormContext } from 'react-hook-form';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Switch } from '@mui/material';

import { OtherSettingsFormValues } from '../types';

type Props = {
  shouldShowBankOptionsByDefault: boolean;
};

export const DisplayBankSection = ({
  shouldShowBankOptionsByDefault,
}: Props) => {
  const { i18n } = useLingui();
  const { setValue } = useFormContext<OtherSettingsFormValues>();

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
        defaultChecked={shouldShowBankOptionsByDefault}
        onChange={(event) => {
          setValue('credit_note_bank_display', event.target.checked, {
            shouldDirty: true,
          });
          setValue('invoice_bank_display', event.target.checked, {
            shouldDirty: true,
          });
          setValue('quote_bank_display', event.target.checked, {
            shouldDirty: true,
          });
        }}
        color="primary"
        aria-label={t(i18n)`Display bank display options`}
      />
    </section>
  );
};
