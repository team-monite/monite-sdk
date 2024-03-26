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
  CounterpartOrganizationRootCreatePayload,
  CounterpartOrganizationRootUpdatePayload,
  CounterpartOrganizationRootResponse,
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

import { CounterpartAddressForm } from '../../CounterpartAddressForm';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '../useCounterpartForm';
import {
  CounterpartOrganizationFields,
  prepareCounterpartOrganization,
  prepareCounterpartOrganizationUpdate,
  prepareCounterpartOrganizationCreate,
} from './mapper';
import { getValidationSchema } from './validation';

export const CounterpartOrganizationForm = (props: CounterpartsFormProps) => {
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

  const { data: isCreateAllowed, isInitialLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: ActionEnum.CREATE,
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const { showCategories, defaultValues } = props;

  const organizationCounterpart = counterpart as
    | CounterpartOrganizationRootResponse
    | undefined;

  const methods = useForm<{
    organization: CounterpartOrganizationFields;
    tax_id: string;
  }>({
    resolver: yupResolver(getValidationSchema(!!organizationCounterpart, i18n)),
    defaultValues: useMemo(
      () => ({
        tax_id: organizationCounterpart?.tax_id ?? '',
        organization: prepareCounterpartOrganization(
          organizationCounterpart?.organization,
          defaultValues
        ),
      }),
      [
        organizationCounterpart?.tax_id,
        organizationCounterpart?.organization,
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
          const payload: CounterpartOrganizationRootUpdatePayload = {
            type: CounterpartOrganizationRootUpdatePayload.type.ORGANIZATION,
            tax_id: values.tax_id ?? '',
            organization: prepareCounterpartOrganizationUpdate(
              values.organization
            ),
          };

          return updateCounterpart(payload);
        }

        const payload: CounterpartOrganizationRootCreatePayload = {
          type: CounterpartOrganizationRootCreatePayload.type.ORGANIZATION,
          tax_id: values.tax_id ?? '',
          organization: prepareCounterpartOrganizationCreate(
            values.organization
          ),
        };

        return createCounterpart(payload);
      })(e);
    },
    [counterpart, createCounterpart, handleSubmit, updateCounterpart]
  );

  /** Returns `true` if the form works for `update` but not `create` flow */
  const isUpdateMode = useMemo(() => Boolean(counterpart), [counterpart]);

  useEffect(() => {
    reset({
      tax_id: organizationCounterpart?.tax_id ?? '',
      organization: prepareCounterpartOrganization(
        organizationCounterpart?.organization,
        defaultValues
      ),
    });
  }, [
    defaultValues,
    organizationCounterpart?.organization,
    organizationCounterpart?.tax_id,
    reset,
  ]);

  if (isCreateAllowedLoading || isLoading) {
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
        data-testid={CounterpartDataTestId.OrganizationForm}
      >
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {isUpdateMode
              ? watch('organization.companyName')
              : t(i18n)`Create Counterpart – Company`}
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
            id="counterpartOrganizationForm"
            ref={formRef}
            onSubmit={handleSubmitWithoutPropagation}
          >
            <Grid container direction="column" rowSpacing={3}>
              <Grid item>
                <Controller
                  name="organization.companyName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Company name`}
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
                        name="organization.isCustomer"
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
                        name="organization.isVendor"
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
                  name="organization.email"
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
                  name="organization.phone"
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
                        {t(i18n)`Business address`}
                      </Typography>
                      {(() => {
                        const message = t(i18n)({
                          id: 'CounterpartDetails--CounterpartOrganizationForm--businessAddressSection--caption',
                          message: '🚫',
                          comment:
                            'Counterpart Organization create form Business address Section description.',
                        });

                        if (message === '🚫') return null;
                        return (
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {message}
                          </Typography>
                        );
                      })()}
                    </Grid>
                    <Grid item>
                      <CounterpartAddressForm parentField="organization" />
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
        <Button
          variant="outlined"
          color="primary"
          disabled={isLoading}
          onClick={submitForm}
        >
          {isUpdateMode ? t(i18n)`Update` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
