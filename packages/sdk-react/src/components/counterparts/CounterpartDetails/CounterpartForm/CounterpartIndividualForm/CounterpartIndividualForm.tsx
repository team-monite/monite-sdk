import { type CounterpartIndividualFields } from '../../CounterpartForm';
import { InlineSuggestionFill } from '../InlineSuggestionFill';
import {
  usePayableCounterpartRawDataSuggestions,
  CounterpartFormFieldsRawMapping,
} from '../usePayableCounterpartRawDataSuggestions';
import {
  prepareCounterpartIndividual,
  prepareCounterpartIndividualCreate,
  prepareCounterpartIndividualUpdate,
} from './mapper';
import {
  getUpdateIndividualValidationSchema,
  getCreateIndividualValidationSchema,
  type CreateCounterpartIndividualFormFields,
  type UpdateCounterpartIndividualFormFields,
} from './validation';
import { components } from '@/api';
import { CounterpartAddressForm } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm/CounterpartAddressForm';
import { CounterpartReminderToggle } from '@/components/counterparts/CounterpartDetails/CounterpartForm/CounterpartReminderToggle';
import {
  useCounterpartForm,
  CounterpartsFormProps,
} from '@/components/counterparts/CounterpartDetails/CounterpartForm/useCounterpartForm';
import { type DefaultValuesOCRIndividual } from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { useDialog } from '@/ui/Dialog';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader/DialogHeader';
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
import { BaseSyntheticEvent, useCallback, useEffect, useId } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

interface CounterpartIndividualFormProps extends CounterpartsFormProps {
  isInvoiceCreation?: boolean;
  defaultValuesOCR?: DefaultValuesOCRIndividual;
}

const individualFieldsMapping: CounterpartFormFieldsRawMapping = {
  'individual.email': 'email',
  'individual.phone': 'phone',
  tax_id: 'tax_id',
};

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
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { componentSettings } = useMoniteContext();

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

  const individualCounterpart = counterpart as
    | components['schemas']['CounterpartIndividualRootResponse']
    | undefined;

  const { data: isCreateAllowed } = useIsActionAllowed({
    method: 'counterpart',
    action: 'create',
    entityUserId: counterpart?.created_by_entity_user_id,
  });

  const formName = `Monite-Form-counterpartIndividualForm-${useId()}`;

  const methods = useForm<
    | CreateCounterpartIndividualFormFields
    | UpdateCounterpartIndividualFormFields
  >({
    resolver: zodResolver(
      counterpartId || individualCounterpart
        ? getUpdateIndividualValidationSchema(i18n)
        : getCreateIndividualValidationSchema(i18n)
    ),
    defaultValues: {
      tax_id: individualCounterpart?.tax_id ?? defaultValuesOCR?.tax_id ?? '',
      remindersEnabled: individualCounterpart?.reminders_enabled ?? true,
      individual: defaultValuesOCR
        ? defaultValuesOCR.counterpart
        : prepareCounterpartIndividual(
            individualCounterpart?.individual,
            defaultValues,
            componentSettings?.onboarding?.allowedCountries &&
              componentSettings?.onboarding?.allowedCountries.length === 1
              ? componentSettings?.onboarding?.allowedCountries[0]
              : undefined
          ),
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = methods;

  const values = watch();

  const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
    usePayableCounterpartRawDataSuggestions(
      payableCounterpartRawData,
      values,
      setValue,
      individualFieldsMapping
    );

  const showFillMatchBillButton =
    !!payableCounterpartRawData && !allFieldsEqual;

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
              individual: prepareCounterpartIndividualUpdate(
                values.individual as CounterpartIndividualFields
              ),
            };

          return updateCounterpart(payload);
        }

        const payload: components['schemas']['CounterpartIndividualRootCreatePayload'] =
          {
            type: 'individual',
            tax_id: values.tax_id ?? '',
            individual: prepareCounterpartIndividualCreate(
              values.individual as CounterpartIndividualFields
            ),
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
      tax_id: individualCounterpart?.tax_id ?? defaultValuesOCR?.tax_id ?? '',
      remindersEnabled: individualCounterpart?.reminders_enabled ?? true,
      individual: defaultValuesOCR
        ? defaultValuesOCR.counterpart
        : prepareCounterpartIndividual(
            individualCounterpart?.individual,
            defaultValues,
            componentSettings?.onboarding?.allowedCountries &&
              componentSettings?.onboarding?.allowedCountries.length === 1
              ? componentSettings?.onboarding?.allowedCountries[0]
              : undefined
          ),
    });
  }, [
    defaultValues,
    individualCounterpart?.individual,
    individualCounterpart?.reminders_enabled,
    individualCounterpart?.tax_id,
    reset,
    defaultValuesOCR,
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
                ? t(i18n)`Edit individual`
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
                          value={field.value ?? ''}
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
                          value={field.value ?? ''}
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
                              name={t(i18n)`Vendor`}
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
                  name="individual.email"
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
                  name="individual.phone"
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
                        value={field.value ?? ''}
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
