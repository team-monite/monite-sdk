import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { components } from '@/api';
import { useVatTypes } from '@/core/hooks/useVatTypes';
import { MoniteCountry } from '@/ui/Country';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { RHFAutocomplete } from '@/ui/RHF/RHFAutocomplete';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack, DialogContent, TextField } from '@mui/material';

import { getCounterpartName } from '../../helpers';
import { InlineSuggestionFill } from '../CounterpartForm/InlineSuggestionFill';
import {
  usePayableCounterpartRawDataSuggestions,
  CounterpartFormFieldsRawMapping,
} from '../CounterpartForm/usePayableCounterpartRawDataSuggestions';
import {
  CounterpartVatFormProps,
  useCounterpartVatForm,
} from './useCounterpartVatForm';

const vatFieldsMapping: CounterpartFormFieldsRawMapping = {
  country: 'vat_id.country',
  type: 'vat_id.type',
  value: 'vat_id.value',
};

export const CounterpartVatForm = (props: CounterpartVatFormProps) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit, setValue, watch },
    counterpart,
    vat,
    saveVat,
    isLoading,
    payableCounterpartRawData,
  } = useCounterpartVatForm(props);

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartVat-${useId()}`;

  const values = watch();

  const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
    usePayableCounterpartRawDataSuggestions(
      payableCounterpartRawData,
      values,
      setValue,
      vatFieldsMapping
    );

  const showFillMatchBillButton =
    !!payableCounterpartRawData?.vat_id && !allFieldsEqual;

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
            <div>
              <MoniteCountry
                name="country"
                control={control}
                disabled={isLoading}
                required
              />
              <InlineSuggestionFill
                rawData={payableCounterpartRawData?.vat_id?.country}
                isHidden={fieldsEqual['country']}
                fieldOnChange={(value) =>
                  setValue(
                    'country',
                    value as components['schemas']['AllowedCountries']
                  )
                }
              />
            </div>

            <Controller
              name="type"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <RHFAutocomplete
                    name="type"
                    disabled={isLoading}
                    control={control}
                    label={t(i18n)`VAT type`}
                    options={vatTypes}
                    optionKey="code"
                    labelKey="label"
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.vat_id?.type}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />

            <Controller
              name="value"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`VAT value`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    disabled={isLoading}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.vat_id?.value}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
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
        secondaryButton={
          showFillMatchBillButton
            ? {
                label: t(i18n)`Update to match bill`,
                onTheLeft: true,
                onClick: () => updateFormWithRawData(),
              }
            : undefined
        }
        cancelButton={{
          onClick: props.onCancel,
        }}
      />
    </>
  );
};
