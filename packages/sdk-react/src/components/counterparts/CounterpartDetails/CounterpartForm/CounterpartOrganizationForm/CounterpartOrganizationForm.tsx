import { CounterpartOrganizationFields } from '../../CounterpartForm';
import { InlineSuggestionFill } from '../InlineSuggestionFill';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '../useCounterpartForm';
import {
  usePayableCounterpartRawDataSuggestions,
  CounterpartFormFieldsRawMapping,
} from '../usePayableCounterpartRawDataSuggestions';
import {
  prepareCounterpartOrganization,
  prepareCounterpartOrganizationUpdate,
  prepareCounterpartOrganizationCreate,
} from './mapper';
import {
  getUpdateCounterpartValidationSchema,
  getCreateCounterpartValidationSchema,
  type UpdateCounterpartOrganizationFormFields,
  type CreateCounterpartOrganizationFormFields,
} from './validation';
import { components } from '@/api';
import { CounterpartAddressForm } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm';
import { CounterpartReminderToggle } from '@/components/counterparts/CounterpartDetails/CounterpartForm/CounterpartReminderToggle';
import { type DefaultValuesOCROrganization } from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { useDialog } from '@/ui/Dialog';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { AccessRestriction } from '@/ui/accessRestriction';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

interface CounterpartOrganizationFormProps extends CounterpartsFormProps {
  isInvoiceCreation?: boolean;
  defaultValuesOCR?: DefaultValuesOCROrganization;
}

const organizationFieldsMapping: CounterpartFormFieldsRawMapping = {
  'organization.companyName': 'name',
  'organization.email': 'email',
  'organization.phone': 'phone',
  tax_id: 'tax_id',
};

export const CounterpartOrganizationForm = (
  props: CounterpartOrganizationFormProps
) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const dialogContext = useDialog();

  const {
    id: counterpartId,
    isInvoiceCreation,
    showCategories,
    defaultValuesOCR,
    defaultValues,
    payableCounterpartRawData,
    onCancel,
    onClose,
  } = props;

  const {
    counterpart,
    formRef,
    createCounterpart,
    updateCounterpart,
    isLoading,
  } = useCounterpartForm(props);

  const organizationCounterpart = counterpart as
    | components['schemas']['CounterpartOrganizationRootResponse']
    | undefined;

  const { data: isCreateAllowed } = useIsActionAllowed({
    method: 'counterpart',
    action: 'create',
    entityUserId: counterpart?.created_by_entity_user_id,
  });

  const formName = `Monite-Form-counterpartOrganizationForm-${useId()}`;

  const methods = useForm<
    | CreateCounterpartOrganizationFormFields
    | UpdateCounterpartOrganizationFormFields
  >({
    resolver: zodResolver(
      counterpartId || counterpart
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
              defaultValues,
              componentSettings?.onboarding?.allowedCountries &&
                componentSettings?.onboarding?.allowedCountries.length === 1
                ? componentSettings?.onboarding?.allowedCountries[0]
                : undefined
            ),
      }),
      [
        organizationCounterpart?.tax_id,
        organizationCounterpart?.reminders_enabled,
        organizationCounterpart?.organization,
        defaultValues,
        defaultValuesOCR,
        componentSettings?.onboarding?.allowedCountries,
      ]
    ),
  });

  const { control, handleSubmit, reset, setValue, watch } = methods;

  const values = watch();

  const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
    usePayableCounterpartRawDataSuggestions(
      payableCounterpartRawData,
      values,
      setValue,
      organizationFieldsMapping
    );

  const showFillMatchBillButton =
    !!payableCounterpartRawData && !allFieldsEqual;

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
      remindersEnabled: organizationCounterpart?.reminders_enabled ?? true,
      organization: defaultValuesOCR
        ? defaultValuesOCR.counterpart
        : prepareCounterpartOrganization(
            organizationCounterpart?.organization,
            defaultValues,
            componentSettings?.onboarding?.allowedCountries &&
              componentSettings?.onboarding?.allowedCountries.length === 1
              ? componentSettings?.onboarding?.allowedCountries[0]
              : undefined
          ),
    });
  }, [
    defaultValues,
    defaultValuesOCR,
    organizationCounterpart?.organization,
    organizationCounterpart?.tax_id,
    organizationCounterpart?.reminders_enabled,
    reset,
    componentSettings?.onboarding?.allowedCountries,
  ]);

  if (!isCreateAllowed && !counterpartId) {
    return <AccessRestriction />;
  }

  return (
    <>
      {((isInvoiceCreation && !counterpartId) || !isInvoiceCreation) && (
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
            counterpartId || isInvoiceCreation
              ? onCancel
              : onClose || dialogContext?.onClose
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
                    <>
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
                      <InlineSuggestionFill
                        rawData={payableCounterpartRawData?.name}
                        isHidden={fieldsEqual[field.name]}
                        fieldOnChange={field.onChange}
                      />
                    </>
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
                    <>
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
                      <InlineSuggestionFill
                        rawData={payableCounterpartRawData?.email}
                        isHidden={fieldsEqual[field.name]}
                        fieldOnChange={field.onChange}
                      />
                    </>
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
                    <>
                      <TextField
                        id={field.name}
                        label={t(i18n)`Phone number`}
                        variant="standard"
                        fullWidth
                        error={Boolean(error)}
                        helperText={error?.message}
                        {...field}
                      />
                      <InlineSuggestionFill
                        rawData={payableCounterpartRawData?.phone}
                        isHidden={fieldsEqual[field.name]}
                        fieldOnChange={field.onChange}
                      />
                    </>
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
                    <>
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
                      <InlineSuggestionFill
                        rawData={payableCounterpartRawData?.tax_id}
                        isHidden={fieldsEqual[field.name]}
                        fieldOnChange={field.onChange}
                      />
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogFooter
        primaryButton={{
          label: counterpartId ? t(i18n)`Save` : t(i18n)`Create`,
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
          label: isInvoiceCreation ? t(i18n)`Back` : t(i18n)`Cancel`,
          onClick:
            counterpartId || isInvoiceCreation
              ? onCancel
              : onClose || dialogContext?.onClose,
        }}
      />
    </>
  );
};
