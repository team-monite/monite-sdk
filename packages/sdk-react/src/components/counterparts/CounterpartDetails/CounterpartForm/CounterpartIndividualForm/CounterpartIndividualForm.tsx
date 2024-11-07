import { BaseSyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { CounterpartReminderToggle } from '@/components/counterparts/CounterpartDetails/CounterpartForm/CounterpartReminderToggle';
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
  IconButton,
} from '@mui/material';

import { getIndividualName } from '../../../helpers';
import { CounterpartAddressForm } from '../../CounterpartAddressForm';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '../useCounterpartForm';
import {
  prepareCounterpartIndividual,
  prepareCounterpartIndividualCreate,
  prepareCounterpartIndividualUpdate,
} from './mapper';
import {
  getUpdateIndividualValidationSchema,
  getCreateIndividualValidationSchema,
} from './validation';

/**
 * Counterpart Individual Form may be used to create or update counterpart
 *  for the type = individual
 *
 * If a counterpart is provided, it will be updated,
 *  otherwise new counterpart will be created
 */
export const CounterpartIndividualForm = (props: CounterpartsFormProps) => {
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

  if (isCreateAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isCreateAllowed && !props.id) {
    return <AccessRestriction />;
  }

  return (
    <>
      <Grid
        container
        alignItems="center"
        data-testid={CounterpartDataTestId.IndividualForm}
      >
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {isUpdateMode
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
              onClick={dialogContext.onClose}
              color="inherit"
              showCloseIcon
            />
          )}
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <FormProvider {...methods}>
          <form
            id="counterpartIndividualForm"
            ref={formRef}
            onSubmit={handleSubmitWithoutPropagation}
          >
            <Grid container direction="column" rowSpacing={3}>
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
                      name="individual.lastName"
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
                      variant="outlined"
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
                      variant="outlined"
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
      <DialogActions>
        {(isUpdateMode || dialogContext) && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={isUpdateMode ? props.onCancel : dialogContext?.onClose}
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button variant="outlined" onClick={submitForm} disabled={isLoading}>
          {isUpdateMode ? t(i18n)`Update` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
