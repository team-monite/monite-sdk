import { useId } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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

import { getIndividualName, getCounterpartName } from '../../helpers';
import { CounterpartAddressForm } from '../CounterpartAddressForm';
import {
  useCounterpartContactForm,
  CounterpartContactFormProps,
} from './useCounterpartContactForm';

export const CounterpartContactForm = (props: CounterpartContactFormProps) => {
  const { i18n } = useLingui();
  const {
    methods,
    counterpart,
    contact,
    formRef,
    submitForm,
    saveContact,
    isLoading,
  } = useCounterpartContactForm(props);

  const { control, handleSubmit, watch } = methods;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartContact-${useId()}`;

  if (isLoading) {
    return <LoadingPage />;
  }

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
        <Typography variant="caption">
          {Boolean(contact)
            ? getIndividualName(watch('firstName'), watch('lastName'))
            : t(i18n)`Add contact person`}
        </Typography>
      </Stack>
      <Divider />
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
                          variant="outlined"
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
                          variant="outlined"
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
                      variant="outlined"
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
                      variant="outlined"
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
        <Button variant="outlined" color="inherit" onClick={props.onCancel}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={submitForm}
          disabled={isLoading}
        >
          {Boolean(contact) ? t(i18n)`Update contact` : t(i18n)`Add contact`}
        </Button>
      </DialogActions>
    </>
  );
};
