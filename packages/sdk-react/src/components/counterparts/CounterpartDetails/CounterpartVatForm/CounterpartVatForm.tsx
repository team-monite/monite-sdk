import { useId } from 'react';

import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useVatTypes } from '@/core/hooks/useVatTypes';
import { MoniteCountry } from '@/ui/Country';
import { DialogHeader } from '@/ui/DialogHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Stack,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { getCounterpartName } from '../../helpers';
import {
  CounterpartVatFormProps,
  useCounterpartVatForm,
} from './useCounterpartVatForm';

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
      <Divider />
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button variant="text" onClick={props.onCancel}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            type="submit"
            form={formName}
            disabled={isLoading}
          >
            {t(i18n)`Save`}
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};
