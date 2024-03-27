import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { useDialog } from '@/components/Dialog';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { ActionEnum } from '@/utils/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CounterpartIndividualRootCreatePayload,
  CounterpartIndividualRootResponse,
  CounterpartIndividualRootUpdatePayload,
} from '@monite/sdk-api';
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
  CounterpartIndividualFields,
  prepareCounterpartIndividual,
  prepareCounterpartIndividualCreate,
  prepareCounterpartIndividualUpdate,
} from './mapper';
import { getValidationSchema } from './validation';

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

  const { data: isCreateAllowed, isInitialLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: ActionEnum.CREATE,
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const individualCounterpart = counterpart as
    | CounterpartIndividualRootResponse
    | undefined;

  const { showCategories, defaultValues } = props;

  const methods = useForm<{
    individual: CounterpartIndividualFields;
    tax_id: string;
  }>({
    resolver: yupResolver(getValidationSchema(!!individualCounterpart, i18n)),
    defaultValues: useMemo(
      () => ({
        tax_id: individualCounterpart?.tax_id ?? '',
        individual: prepareCounterpartIndividual(
          individualCounterpart?.individual,
          defaultValues
        ),
      }),
      [
        individualCounterpart?.tax_id,
        individualCounterpart?.individual,
        defaultValues,
      ]
    ),
  });

  const { control, handleSubmit, reset, watch } = methods;

  const handleSubmitWithoutPropagation = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();

      handleSubmit((values) => {
        if (!!counterpart) {
          const payload: CounterpartIndividualRootUpdatePayload = {
            type: CounterpartIndividualRootUpdatePayload.type.INDIVIDUAL,
            tax_id: values.tax_id ?? '',
            individual: prepareCounterpartIndividualUpdate(values.individual),
          };

          return updateCounterpart(payload);
        }

        const payload: CounterpartIndividualRootCreatePayload = {
          type: CounterpartIndividualRootCreatePayload.type.INDIVIDUAL,
          tax_id: values.tax_id ?? '',
          individual: prepareCounterpartIndividualCreate(values.individual),
        };

        return createCounterpart(payload);
      })(e);
    },
    [counterpart, createCounterpart, handleSubmit, updateCounterpart]
  );

  useEffect(() => {
    reset({
      tax_id: individualCounterpart?.tax_id ?? '',
      individual: prepareCounterpartIndividual(
        individualCounterpart?.individual,
        defaultValues
      ),
    });
  }, [
    defaultValues,
    individualCounterpart?.individual,
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
            <IconButton
              aria-label={t(i18n)`Counterpart Close`}
              onClick={dialogContext.onClose}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
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
