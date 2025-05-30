import {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { CounterpartAddressForm } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm';
import { CounterpartReminderToggle } from '@/components/counterparts/CounterpartDetails/CounterpartForm/CounterpartReminderToggle';
import { type DefaultValuesOCROrganization } from '@/components/counterparts/types';
import { useDialog } from '@/components/Dialog';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { AccessRestriction } from '@/ui/accessRestriction';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DialogContent,
  Divider,
  Typography,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
} from '@mui/material';

import { CounterpartOrganizationFields } from '../../CounterpartForm';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '../useCounterpartForm';
import {
  prepareCounterpartOrganization,
  prepareCounterpartOrganizationUpdate,
  prepareCounterpartOrganizationCreate,
} from './mapper';
import {
  getUpdateCounterpartValidationSchema,
  getCreateCounterpartValidationSchema,
} from './validation';

interface CounterpartOrganizationFormProps extends CounterpartsFormProps {
  isInvoiceCreation?: boolean;
  defaultValuesOCR?: DefaultValuesOCROrganization;
}

export const CounterpartOrganizationForm = (
  props: CounterpartOrganizationFormProps
) => {
  const isInvoiceCreation = props.isInvoiceCreation;
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const {
    counterpart,
    formRef,
    createCounterpart,
    updateCounterpart,
    isLoading,
  } = useCounterpartForm(props);

  const { data: isCreateAllowed } = useIsActionAllowed({
    method: 'counterpart',
    action: 'create',
    entityUserId: counterpart?.created_by_entity_user_id,
  });

  const { showCategories, defaultValuesOCR, defaultValues } = props;

  const organizationCounterpart = counterpart as
    | components['schemas']['CounterpartOrganizationRootResponse']
    | undefined;

  const methods = useForm({
    resolver: yupResolver(
      props.id || counterpart
        ? getUpdateCounterpartValidationSchema(i18n)
        : getCreateCounterpartValidationSchema(i18n)
    ),
    defaultValues: useMemo(
      () => ({
        tax_id: organizationCounterpart?.tax_id ?? defaultValuesOCR?.tax_id,
        remindersEnabled: organizationCounterpart?.reminders_enabled ?? true,
        organization: defaultValuesOCR
          ? defaultValuesOCR.counterpart
          : prepareCounterpartOrganization(
              organizationCounterpart?.organization,
              defaultValues
            ),
      }),
      [
        organizationCounterpart?.tax_id,
        organizationCounterpart?.reminders_enabled,
        organizationCounterpart?.organization,
        defaultValues,
        defaultValuesOCR,
      ]
    ),
  });

  const { control, handleSubmit, reset } = methods;

  const handleSubmitWithoutPropagation = useCallback(
    (e: BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();

      handleSubmit((values) => {
        const language =
          LanguageCodeEnum.find((code) => code === i18n.locale.split('-')[0]) ??
          'en';

        if (counterpart) {
          const payload: components['schemas']['CounterpartOrganizationRootUpdatePayload'] =
            {
              tax_id: values.tax_id ?? '',
              reminders_enabled: values.remindersEnabled,
              language: counterpart.language ?? language,
              organization: prepareCounterpartOrganizationUpdate(
                values.organization as CounterpartOrganizationFields
              ),
            };

          return updateCounterpart(payload);
        }

        const payload: components['schemas']['CounterpartOrganizationRootCreatePayload'] =
          {
            type: 'organization',
            tax_id: values.tax_id ?? '',
            language,
            reminders_enabled: values.remindersEnabled,
            organization: prepareCounterpartOrganizationCreate(
              values.organization as CounterpartOrganizationFields
            ),
          };
        return createCounterpart(payload);
      })(e);
    },
    [
      counterpart,
      createCounterpart,
      handleSubmit,
      i18n.locale,
      updateCounterpart,
    ]
  );

  useEffect(() => {
    reset({
      tax_id: organizationCounterpart?.tax_id ?? defaultValuesOCR?.tax_id,
      remindersEnabled: organizationCounterpart?.reminders_enabled ?? false,
      organization: defaultValuesOCR
        ? defaultValuesOCR.counterpart
        : prepareCounterpartOrganization(
            organizationCounterpart?.organization,
            defaultValues
          ),
    });
  }, [
    defaultValues,
    defaultValuesOCR,
    organizationCounterpart?.organization,
    organizationCounterpart?.tax_id,
    organizationCounterpart?.reminders_enabled,
    reset,
  ]);

  const formName = `Monite-Form-counterpartOrganizationForm-${useId()}`;

  if (!isCreateAllowed && !props.id) {
    return <AccessRestriction />;
  }

  return (
    <>
      {((isInvoiceCreation && !props?.id) || !isInvoiceCreation) && (
        <DialogHeader
          secondaryLevel
          title={
            isInvoiceCreation
              ? t(i18n)`Create customer`
              : props?.id
              ? t(i18n)`Edit company`
              : t(i18n)`Create new counterpart`
          }
          closeSecondaryLevelDialog={
            props?.id || isInvoiceCreation
              ? props.onCancel
              : props.onClose || dialogContext?.onClose
          }
          showDivider={!isInvoiceCreation}
        />
      )}

      <DialogContent
        sx={{ padding: '2rem', overflowY: 'auto', height: '450px' }}
      >
        <FormProvider {...methods}>
          <form
            id={formName}
            ref={formRef}
            onSubmit={handleSubmitWithoutPropagation}
          >
            <Grid container direction="column" rowSpacing={3} pb={4}>
              <Grid item>
                <Controller
                  name="organization.companyName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Company name`}
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      required
                      {...field}
                      value={field.value ?? ''}
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
                              checked={field.value ?? false}
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
                              checked={field.value ?? false}
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
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      required
                      {...field}
                      value={field.value ?? ''}
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
                  name="organization.phone"
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
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      helperText={error?.message}
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogFooter
        primaryButton={{
          label: props?.id ? t(i18n)`Save` : t(i18n)`Create`,
          formId: formName,
          isLoading: isLoading,
        }}
        cancelButton={{
          label: isInvoiceCreation ? t(i18n)`Back` : t(i18n)`Cancel`,
          onClick:
            props?.id || isInvoiceCreation
              ? props.onCancel
              : props.onClose || dialogContext?.onClose,
        }}
      />
    </>
  );
};
