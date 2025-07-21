import { getCounterpartName } from '../../helpers';
import {
  CounterpartVatFormProps,
  useCounterpartVatForm,
} from './useCounterpartVatForm';
import { useVatTypes } from '@/core/hooks/useVatTypes';
import { MoniteCountry } from '@/ui/Country';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { RHFAutocomplete } from '@/ui/RHF/RHFAutocomplete';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack, DialogContent } from '@mui/material';
import { useId } from 'react';

export const CounterpartVatForm = (props: CounterpartVatFormProps) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit },
    counterpart,
    vat,
    saveVat,
    isLoading,
  } = useCounterpartVatForm(props);

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartVat-${useId()}`;

  const vatTypes = useVatTypes();

  if (!counterpart) return null;

  return (
    <>
      <DialogHeader
        secondaryLevel
        previousLevelTitle={getCounterpartName(counterpart)}
        title={vat ? t(i18n)`Edit VAT ID` : t(i18n)`Add VAT ID`}
        closeSecondaryLevelDialog={props.onCancel}
      />
      <DialogContent>
        <form id={formName} onSubmit={handleSubmit(saveVat)}>
          <Stack spacing={3}>
            <MoniteCountry
              name="country"
              control={control}
              disabled={isLoading}
              required
            />

            <RHFAutocomplete
              name="type"
              disabled={isLoading}
              control={control}
              label={t(i18n)`VAT type`}
              options={vatTypes}
              optionKey="code"
              labelKey="label"
            />

            <RHFTextField
              disabled={isLoading}
              label={t(i18n)`VAT value`}
              name="value"
              control={control}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogFooter
        primaryButton={{
          label: t(i18n)`Save`,
          formId: formName,
          isLoading: isLoading,
        }}
        cancelButton={{
          onClick: props.onCancel,
        }}
      />
    </>
  );
};
