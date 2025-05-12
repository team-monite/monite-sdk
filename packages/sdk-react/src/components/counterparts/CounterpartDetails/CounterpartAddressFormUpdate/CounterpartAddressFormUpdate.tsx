import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { MoniteCountry } from '@/ui/Country';
import { LoadingPage } from '@/ui/loadingPage/LoadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getCounterpartName } from '../../helpers';
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
    counterpart,
    methods: { control, handleSubmit },
    updateAddress,
    isLoading,
  } = useCounterpartAddressFormUpdate(props);
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartAddress-${useId()}`;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!counterpart) return null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ padding: 3 }}
      >
        <Typography variant="caption">
          {getCounterpartName(counterpart)}
        </Typography>
        <ArrowForwardIcon fontSize="small" color="disabled" />
        <Typography variant="caption">{t(i18n)`Edit address`}</Typography>
      </Stack>
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
                  label={t(i18n)`Postal code`}
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
