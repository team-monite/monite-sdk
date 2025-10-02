import { getCounterpartName } from '../../helpers';
import { prepareCounterpartAddressSubmit } from '../CounterpartAddressForm';
import { CounterpartAddressFormFields } from '../CounterpartAddressForm/validation';
import { InlineSuggestionFill } from '../CounterpartForm/InlineSuggestionFill';
import {
  usePayableCounterpartRawDataSuggestions,
  CounterpartFormFieldsRawMapping,
} from '../CounterpartForm/usePayableCounterpartRawDataSuggestions';
import {
  useCounterpartAddressFormUpdate,
  CounterpartAddressFormUpdateProps,
} from './useCounterpartAddressFormUpdate';
import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { USStatesEnum } from '@/enums/USStatesEnum';
import { MoniteCountry } from '@/ui/Country';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage/LoadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DialogContent,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const addressFieldsMapping: CounterpartFormFieldsRawMapping = {
  line1: 'address.line1',
  line2: 'address.line2',
  city: 'address.city',
  state: 'address.state',
  country: 'address.country',
  postalCode: 'address.postal_code',
};

export const CounterpartAddressFormUpdate = (
  props: CounterpartAddressFormUpdateProps
) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const {
    counterpart,
    methods,
    updateAddress,
    isLoading,
    payableCounterpartRawData,
  } = useCounterpartAddressFormUpdate(props);

  const { control, handleSubmit, setValue, watch } = methods;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartAddress-${useId()}`;

  const values = watch();

  const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
    usePayableCounterpartRawDataSuggestions<CounterpartAddressFormFields>(
      payableCounterpartRawData,
      values,
      setValue,
      addressFieldsMapping
    );

  const showFillMatchBillButton =
    !!payableCounterpartRawData?.address && !allFieldsEqual;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!counterpart) return null;

  return (
    <>
      <DialogHeader
        secondaryLevel
        previousLevelTitle={getCounterpartName(counterpart)}
        title={t(i18n)`Edit address`}
        closeSecondaryLevelDialog={props.onCancel}
      />
      <DialogContent>
        <form
          id={formName}
          onSubmit={handleSubmit((values) => {
            updateAddress(prepareCounterpartAddressSubmit(values));
          })}
        >
          <Stack spacing={3}>
            <div>
              <MoniteCountry name="country" control={control} required />
              <InlineSuggestionFill
                rawData={payableCounterpartRawData?.address?.country}
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
              name="line1"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Address line 1`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    required
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.address?.line1}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="line2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Address line 2`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.address?.line2}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`City`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    required
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.address?.city}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="postalCode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Postal code`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    required
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.address?.postal_code}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="state"
              control={control}
              render={({ field, fieldState: { error } }) =>
                watch('country') === 'US' ? (
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ marginBottom: '1rem' }}
                      fullWidth
                      required
                      error={Boolean(error)}
                    >
                      <InputLabel id="state-select">{t(
                        i18n
                      )`State`}</InputLabel>
                      <Select
                        id={field.name}
                        fullWidth
                        required
                        error={Boolean(error)}
                        MenuProps={{ container: root }}
                        {...field}
                      >
                        {Object.entries(USStatesEnum).map(([code, name]) => (
                          <MenuItem key={code} value={code}>
                            {name} — {code}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error?.message}</FormHelperText>
                      )}
                    </FormControl>
                    <InlineSuggestionFill
                      rawData={payableCounterpartRawData?.address?.state}
                      isHidden={fieldsEqual[field.name]}
                      fieldOnChange={field.onChange}
                    />
                  </div>
                ) : (
                  <div>
                    <TextField
                      id={field.name}
                      label={t(i18n)`State / Area / Province`}
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      required
                      {...field}
                    />
                    <InlineSuggestionFill
                      rawData={payableCounterpartRawData?.address?.state}
                      isHidden={fieldsEqual[field.name]}
                      fieldOnChange={field.onChange}
                    />
                  </div>
                )
              }
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
