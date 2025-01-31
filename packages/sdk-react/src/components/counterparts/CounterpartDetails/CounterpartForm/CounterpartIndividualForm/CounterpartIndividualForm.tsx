import { BaseSyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { CounterpartAddressForm } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm/CounterpartAddressForm';
import { CounterpartReminderToggle } from '@/components/counterparts/CounterpartDetails/CounterpartForm/CounterpartReminderToggle';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '@/components/counterparts/CounterpartDetails/CounterpartForm/useCounterpartForm';
import { getIndividualName } from '@/components/counterparts/helpers';
import { useDialog } from '@/components/Dialog';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { AccessRestriction } from '@/ui/accessRestriction';
import { IconWrapper } from '@/ui/iconWrapper';
import { LoadingPage } from '@/ui/loadingPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  DialogActions,
  DialogContent,
  Divider,
  Typography,
  Button,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  prepareCounterpartIndividual,
  prepareCounterpartIndividualCreate,
  prepareCounterpartIndividualUpdate,
} from './mapper';
import {
  getUpdateIndividualValidationSchema,
  getCreateIndividualValidationSchema,
} from './validation';

interface CounterpartIndividualFormProps extends CounterpartsFormProps {
  isInvoiceCreation?: boolean;
}

/**
 * Counterpart Individual Form may be used to create or update counterpart
 *  for the type = individual
 *
 * If a counterpart is provided, it will be updated,
 *  otherwise new counterpart will be created
 */
export const CounterpartIndividualForm = ({
  ...props
}: CounterpartIndividualFormProps) => {
  const isInvoiceCreation = props.isInvoiceCreation;
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const {
    counterpart,
    formRef,
    submitForm,
    createCounterpart,
    updateCounterpart,
    isLoading,
  } = useCounterpartForm(props);

  /** Returns `true` if the form works for `update` but not `create` flow */
  const isUpdateMode = useMemo(() => Boolean(counterpart), [counterpart]);

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'create',
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const individualCounterpart = counterpart as
    | components['schemas']['CounterpartIndividualRootResponse']
    | undefined;

  const { showCategories, defaultValues } = props;

  const methods = useForm({
    resolver: yupResolver(
      props.id || individualCounterpart
        ? getUpdateIndividualValidationSchema(i18n)
        : getCreateIndividualValidationSchema(i18n)
    ),
    defaultValues: {
      tax_id: individualCounterpart?.tax_id ?? '',
      remindersEnabled: individualCounterpart?.reminders_enabled ?? true,
      individual: prepareCounterpartIndividual(
        individualCounterpart?.individual,
        defaultValues
      ),
    },
  });

  const { control, handleSubmit, reset, watch } = methods;

  const handleSubmitWithoutPropagation = useCallback(
    (e: BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();

      handleSubmit((values) => {
        if (counterpart) {
          const payload: components['schemas']['CounterpartIndividualRootUpdatePayload'] =
            {
              tax_id: values.tax_id ?? '',
              reminders_enabled: values.remindersEnabled,
              individual: prepareCounterpartIndividualUpdate(values.individual),
            };

          return updateCounterpart(payload);
        }

        const payload: components['schemas']['CounterpartIndividualRootCreatePayload'] =
          {
            type: 'individual',
            tax_id: values.tax_id ?? '',
            individual: prepareCounterpartIndividualCreate(values.individual),
            language:
              LanguageCodeEnum.find(
                (code) => code === i18n.locale.split('-')[0]
              ) ?? 'en',
            reminders_enabled: values.remindersEnabled,
          };

        return createCounterpart(payload);
      })(e);
    },
    [counterpart, createCounterpart, handleSubmit, i18n, updateCounterpart]
  );

  useEffect(() => {
    reset({
      tax_id: individualCounterpart?.tax_id ?? '',
      remindersEnabled: individualCounterpart?.reminders_enabled ?? false,
      individual: prepareCounterpartIndividual(
        individualCounterpart?.individual,
        defaultValues
      ),
    });
  }, [
    defaultValues,
    individualCounterpart?.individual,
    individualCounterpart?.reminders_enabled,
    individualCounterpart?.tax_id,
    reset,
  ]);

  if (isCreateAllowedLoading || isLoading) {
    if (isInvoiceCreation) {
      return (
        <Grid pb={4}>
          <LoadingPage />
        </Grid>
      );
    }
    return <LoadingPage />;
  }

  if (!isCreateAllowed && !props.id) {
    return <AccessRestriction />;
  }

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <>
      {((isInvoiceCreation && !isUpdateMode) || !isInvoiceCreation) && (
        <Grid
          container
          alignItems="center"
          data-testid={CounterpartDataTestId.IndividualForm}
        >
          <Grid item xs={11}>
            <Typography variant="h3" sx={{ padding: 3, fontWeight: 500 }}>
              {isInvoiceCreation
                ? t(i18n)`Create customer`
                : isUpdateMode
                ? getIndividualName(
                    watch('individual.firstName'),
                    watch('individual.lastName')
                  )
                : t(i18n)`Create Counterpart - Individual`}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {dialogContext?.isDialogContent && (
              <IconWrapper
                aria-label={t(i18n)`Counterpart Close`}
                onClick={props.onClose || dialogContext.onClose}
                color="inherit"
              >
                <CloseIcon />
              </IconWrapper>
            )}
          </Grid>
        </Grid>
      )}

      {!isInvoiceCreation && <Divider />}

      <DialogContent
        sx={{
          padding: '0 2rem',
          maxHeight: isLargeScreen ? 480 : 360,
          overflowY: 'auto',
        }}
      >
        <FormProvider {...methods}>
          <form
            id="counterpartIndividualForm"
            ref={formRef}
            onSubmit={handleSubmitWithoutPropagation}
          >
            <Grid container direction="column" rowSpacing={3} pb={4}>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller
                      name="individual.firstName"
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
                      name="individual.lastName"
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
              {showCategories && (
                <Grid item>
                  <Typography
                    variant="caption"
                    sx={{ marginBottom: 1 }}
                    component="div"
                  >
                    {t(i18n)`Set this counterpart as:`}
                  </Typography>
                  <List
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                    disablePadding
                  >
                    <ListItem disablePadding>
                      <Controller
                        name="individual.isCustomer"
                        control={control}
                        render={({ field }) => (
                          <ListItemButton
                            id={field.name}
                            role={undefined}
                            onClick={() => {
                              field.onChange(!field.value);
                            }}
                          >
                            <Checkbox
                              edge="start"
                              checked={field.value}
                              name={t(i18n)`Customer`}
                              disableRipple
                            />
                            <ListItemText>{t(i18n)`Customer`}</ListItemText>
                          </ListItemButton>
                        )}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <Controller
                        name="individual.isVendor"
                        control={control}
                        render={({ field }) => (
                          <ListItemButton
                            id={field.name}
                            role={undefined}
                            onClick={() => {
                              field.onChange(!field.value);
                            }}
                          >
                            <Checkbox
                              edge="start"
                              checked={field.value}
                              name={t(i18n)`Vendor`}
                              disableRipple
                            />
                            <ListItemText>{t(i18n)`Vendor`}</ListItemText>
                          </ListItemButton>
                        )}
                      />
                    </ListItem>
                  </List>
                </Grid>
              )}
              <Grid item>
                <Controller
                  name="individual.email"
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
                <CounterpartReminderToggle
                  name="remindersEnabled"
                  control={control}
                />
              </Grid>
              <Grid item>
                <Controller
                  name="individual.phone"
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
              {!counterpart && (
                <Grid item>
                  <Grid container direction="column" rowSpacing={2}>
                    <Grid item>
                      <Typography variant="subtitle2">
                        {t(i18n)`Address`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CounterpartAddressForm parentField="individual" />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid item>
                <Controller
                  name="tax_id"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Tax ID`}
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <Divider />

      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1em',
          padding: 4,
        }}
      >
        {(isUpdateMode || dialogContext) && (
          <Button
            variant="text"
            onClick={
              isUpdateMode
                ? props.onCancel
                : props.onClose || dialogContext?.onClose
            }
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          disabled={isLoading}
          onClick={submitForm}
        >
          {isUpdateMode ? t(i18n)`Save` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
