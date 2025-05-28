import { useId } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Grid,
  Typography,
  Stack,
  Divider,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

import { getCounterpartName } from '../../helpers';
import { CounterpartAddressForm } from '../CounterpartAddressForm';
import {
  useCounterpartContactForm,
  CounterpartContactFormProps,
} from './useCounterpartContactForm';

export const CounterpartContactForm = (props: CounterpartContactFormProps) => {
  const { i18n } = useLingui();
  const { methods, counterpart, contact, formRef, saveContact, isLoading } =
    useCounterpartContactForm(props);

  const { control, handleSubmit } = methods;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartContact-${useId()}`;

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <DialogHeader
        secondaryLevel
        previousLevelTitle={getCounterpartName(counterpart)}
        title={
          contact ? t(i18n)`Edit contact person` : t(i18n)`Add contact person`
        }
        closeSecondaryLevelDialog={props.onCancel}
      />
      <DialogContent>
        <FormProvider {...methods}>
          <form
            id={formName}
            ref={formRef}
            onSubmit={handleSubmit(saveContact)}
          >
            <Grid container direction="column" rowSpacing={3}>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          id={field.name}
                          label={t(i18n)`First name`}
                          variant="standard"
                          fullWidth
                          error={Boolean(error)}
                          helperText={error?.message}
                          required
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          id={field.name}
                          label={t(i18n)`Last name`}
                          variant="standard"
                          fullWidth
                          error={Boolean(error)}
                          helperText={error?.message}
                          required
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Email`}
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Phone number`}
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Grid container direction="column" rowSpacing={2}>
                  <Grid item>
                    <Typography variant="subtitle2">
                      {t(i18n)`Address`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CounterpartAddressForm />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
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
