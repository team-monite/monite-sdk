import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { MoniteCountry } from '@/ui/Country';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { prepareCounterpartAddressSubmit } from '../CounterpartAddressForm';
import {
  useCounterpartAddressFormUpdate,
  CounterpartAddressFormUpdateProps,
} from './useCounterpartAddressFormUpdate';

export const CounterpartAddressFormUpdate = (
  props: CounterpartAddressFormUpdateProps
) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit },
    updateAddress,
    isLoading,
  } = useCounterpartAddressFormUpdate(props);
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartAddress-${useId()}`;

  return (
    <>
      <Typography variant="h3" sx={{ padding: 3 }}>
        {t(i18n)`Address`}
      </Typography>
      <Divider />
      <DialogContent>
        <form
          id={formName}
          onSubmit={handleSubmit((values) => {
            updateAddress(prepareCounterpartAddressSubmit(values));
          })}
        >
          <Stack spacing={3}>
            <Controller
              name="line1"
              control={control}
              render={({ field, fieldState: { error } }) => (
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
              )}
            />
            <Controller
              name="line2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Address line 2`}
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState: { error } }) => (
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
              )}
            />
            <Controller
              name="postalCode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`ZIP code`}
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="state"
              control={control}
              render={({ field, fieldState: { error } }) => (
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
              )}
            />
            <MoniteCountry name="country" control={control} required />
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={props.onCancel}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          form={formName}
          disabled={isLoading}
        >
          {t(i18n)`Update`}
        </Button>
      </DialogActions>
    </>
  );
};
