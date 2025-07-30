import type { OptionalFields } from '../../types';
import { PayableLineItemsForm } from '../PayableLineItemsForm';
import {
  type MonitePayableDetailsInfoProps,
  type SubmitPayload,
  calculateTotalsForPayable,
  findDefaultBankAccount,
  isFieldRequired,
  prepareDefaultValues,
  prepareSubmit,
  usePayableDetailsThemeProps,
} from './helpers';
import type { LineItem } from './types';
import { usePayableDetailsForm } from './usePayableDetailsForm';
import {
  type PayableDetailsValidationFields,
  getPayableDetailsValidationSchema,
  isFieldRequiredByValidations,
} from './validation';
import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { CounterpartDetails } from '@/components/counterparts/CounterpartDetails';
import { CounterpartAutocomplete } from '@/components/counterparts/components';
import {
  CustomerTypes,
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useOptionalFields } from '@/core/hooks/useOptionalFields';
import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getBankAccountName } from '@/core/utils/getBankAccountName';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { MoniteCurrency } from '@/ui/Currency';
import { Dialog } from '@/ui/Dialog';
import { TagsAutocompleteInput } from '@/ui/TagsAutocomplete';
import { classNames } from '@/utils/css-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  type FieldNamesMarkedBoolean,
  Controller,
  FormProvider,
  useForm,
  useFormState,
} from 'react-hook-form';

export interface PayableDetailsFormProps extends MonitePayableDetailsInfoProps {
  payable?: components['schemas']['PayableResponseSchema'];
  savePayable?: (
    id: string,
    payable: components['schemas']['PayableUpdateSchema'],
    lineItems?: Array<LineItem>,
    dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsValidationFields>
  ) => void;
  createPayable?: (
    payable: components['schemas']['PayableUploadWithDataSchema'],
    createdLineItems?: Array<LineItem>
  ) => void;
  lineItems: components['schemas']['LineItemResponse'][] | undefined;
  payableDetailsFormId: string;
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
}

/**
 * PayableDetailsForm component.
 *
 * This component is responsible for rendering a form that allows users to create or edit payable details, including invoice number, counterpart, due date, line items, and tags. It uses various hooks and utilities to manage form state, validation, and submission.
 *
 * The component supports both controlled and uncontrolled modes, allowing for either external control or internal state management.
 *
 * @component
 * @example Monite Provider customisation
 * ```ts
 * // You can configure the component through Monite Provider property `componentSettings` like this:
 * const componentSettings = {
 *   optionalFields: {
 *     invoiceDate: true,         // Show the invoice date field
 *     tags: true,                // Show the tags field
 *   },
 *   ocrMismatchFields: {
 *     amount_to_pay: true,       // Show the amount to pay field
 *     counterpart_bank_account_id: true,  // Show the counterpart bank account id field
 *   },
 *   ocrRequiredFields: {
 *     invoiceNumber: true,       // The invoice number is required based on OCR data
 *     dueDate: true,             // The due date is required based on OCR data
 *     currency: true,            // The currency is required based on OCR data
 *   },
 *   isTagsDisabled: true,        // The tags field is disabled
 * };
 * ```
 *
 * @param {components['schemas']['PayableResponseSchema']} [payable] - Optional payable data to pre-fill the form for editing.
 * @param {(id: string, payable: components['schemas']['PayableUpdateSchema'], lineItems?: Array<LineItem>, dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsFormFields>) => void} [savePayable] - Callback function to save changes to an existing payable.
 * @param {(payable: components['schemas']['PayableUploadWithDataSchema'], createdLineItems?: Array<LineItem>) => void} [createPayable] - Callback function to create a new payable.
 * @param {OptionalFields} [optionalFields] - Configuration object to show or hide optional fields.
 * @param {components['schemas']['LineItemResponse'][]} [lineItems] - Array of line items associated with the payable.
 * @param {Record<string, boolean> | undefined} [ocrRequiredFields] - Array of required fields that should be provided by OCR.
 * @param {string} payableDetailsFormId - Unique identifier for the form.
 *
 * @returns {JSX.Element} The PayableDetailsForm component.
 */
export const PayableDetailsForm = forwardRef<
  HTMLFormElement,
  PayableDetailsFormProps
>((props, ref) => (
  <MoniteScopedProviders>
    <PayableDetailsFormBase ref={ref} {...props} />
  </MoniteScopedProviders>
));

const PayableDetailsFormBase = forwardRef<
  HTMLFormElement,
  PayableDetailsFormProps
>(
  (
    {
      payable,
      savePayable,
      createPayable,
      lineItems,
      payableDetailsFormId,
      customerTypes,
      ...inProps
    },
    ref
  ) => {
    const { i18n } = useLingui();
    const { api, componentSettings } = useMoniteContext();
    const { root } = useRootElements();
    const className = 'Monite-PayableDetailsForm';

    const {
      formatFromMinorUnits,
      formatToMinorUnits,
      formatCurrencyToDisplay,
      getSymbolFromCurrency,
    } = useCurrencies();

    const { isTagsDisabled } = usePayableDetailsThemeProps(inProps);

    const { data: payablesValidations } =
      api.payables.getPayablesValidations.useQuery();

    const defaultValues = useMemo(
      () => prepareDefaultValues(formatFromMinorUnits, payable, lineItems),
      [formatFromMinorUnits, payable, lineItems]
    );

    const methods = useForm<PayableDetailsValidationFields>({
      resolver: zodResolver(
        getPayableDetailsValidationSchema(i18n, payablesValidations)
      ),
      defaultValues,
      mode: 'onTouched',
    });
    const {
      control,
      handleSubmit,
      watch,
      reset,
      trigger,
      setValue,
      getValues,
      getFieldState,
    } = methods;
    const { dirtyFields } = useFormState({ control });
    const currentCounterpart = watch('counterpart');
    const currentCounterpartBankAccount = watch('counterpartBankAccount');
    const currentInvoiceDate = watch('invoiceDate');
    const currentDueDate = watch('dueDate');
    const currentCurrency = watch('currency') as CurrencyEnum;
    const currentLineItems = watch('lineItems');
    const currentDiscount = watch('discount');

    const totals = calculateTotalsForPayable(currentLineItems, currentDiscount);

    const [isEditCounterpartOpened, setIsEditCounterpartOpened] =
      useState<boolean>(false);

    const { counterpartQuery, counterpartBankAccountQuery } =
      usePayableDetailsForm({
        currentCounterpartId: currentCounterpart,
      });

    const { ocrRequiredFields, optionalFields } =
      usePayableDetailsThemeProps(inProps);
    const { showInvoiceDate, showTags } = useOptionalFields<OptionalFields>(
      optionalFields,
      {
        showInvoiceDate: true,
        showTags: true,
      }
    );
    const { data: user } = useEntityUserByAuthToken();
    const { data: isTagsReadAllowed } = useIsActionAllowed({
      method: 'tag',
      action: 'read',
      entityUserId: user?.id,
    });

    const isSubmittedByKeyboardRef = useRef(false);

    const { data: matchingToOCRCounterpart } =
      api.counterparts.getCounterparts.useQuery(
        {
          query: {
            counterpart_name__icontains: payable?.counterpart_raw_data?.name,
            is_vendor: true,
            limit: 1,
          },
        },
        {
          enabled: Boolean(
            !payable?.counterpart_id && payable?.counterpart_raw_data?.name
          ),
          select: (data) => data.data.at(0),
        }
      );
    const matchingToOCRCounterpartId = matchingToOCRCounterpart?.id;

    useEffect(() => {
      reset(prepareDefaultValues(formatFromMinorUnits, payable, lineItems));
    }, [payable, formatFromMinorUnits, reset, lineItems]);

    useEffect(() => {
      if (!currentCounterpart && !!currentCounterpartBankAccount) {
        setValue('counterpartBankAccount', '', { shouldValidate: true });
      }
    }, [currentCounterpart, currentCounterpartBankAccount, setValue]);

    useEffect(() => {
      if (!matchingToOCRCounterpartId) return;
      if (getFieldState('counterpart').isTouched) return;
      setValue('counterpart', matchingToOCRCounterpartId);
    }, [matchingToOCRCounterpartId, getFieldState, setValue]);

    useEffect(() => {
      if (
        counterpartBankAccountQuery.isSuccess &&
        counterpartBankAccountQuery.data?.data
      ) {
        const defaultBankAccount = findDefaultBankAccount(
          counterpartBankAccountQuery.data.data,
          currentCurrency
        );
        const currentValue = getValues('counterpartBankAccount');
        if (currentValue !== defaultBankAccount) {
          setValue('counterpartBankAccount', defaultBankAccount, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }
      }
    }, [
      counterpartBankAccountQuery.data,
      counterpartBankAccountQuery.isSuccess,
      currentCurrency,
      getValues,
      setValue,
    ]);

    useEffect(() => {
      // Trigger validation for existing payables (not new ones)
      if (payable?.id) {
        trigger();
      }
    }, [trigger, payable?.id]);

    const { currencyGroups, isLoadingCurrencyGroups } =
      useProductCurrencyGroups();

    return (
      <>
        <Box
          className={classNames(ScopedCssBaselineContainerClassName, className)}
          sx={{
            pb: 6,
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'auto',
            width: '100%',
            height: 0,
          }}
        >
          <FormProvider {...methods}>
            <form
              style={{ width: '100%' }}
              ref={ref}
              id={payableDetailsFormId}
              noValidate
              onBlur={() => {
                isSubmittedByKeyboardRef.current = false;
              }}
              onKeyDown={(event) => {
                isSubmittedByKeyboardRef.current = event.key === 'Enter';
              }}
              onSubmit={handleSubmit(async (values) => {
                const submitPayload: SubmitPayload = {
                  ...values,
                  currency: values.currency as CurrencyEnum,
                  counterpartAddressId: counterpartQuery.data?.data?.find(
                    ({ id }) => id === values.counterpart
                  )?.default_billing_address_id,
                };
                const invoiceData = prepareSubmit(
                  submitPayload,
                  formatToMinorUnits
                );

                if (payable) {
                  savePayable &&
                    savePayable(
                      payable.id,
                      invoiceData,
                      values.lineItems,
                      dirtyFields
                    );
                } else {
                  createPayable && createPayable(invoiceData, values.lineItems);
                }
              })}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 3 }}
                    className={className + '-Details'}
                  >
                    <Typography variant="subtitle2" mb={2}>
                      {t(i18n)`Details`}
                    </Typography>
                    <Stack spacing={3}>
                      <Controller
                        name="invoiceNumber"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            id={field.name}
                            label={t(i18n)`Number`}
                            variant="standard"
                            fullWidth
                            error={Boolean(error)}
                            helperText={error?.message}
                            required={isFieldRequired(
                              'invoiceNumber',
                              ocrRequiredFields
                            )}
                          />
                        )}
                      />
                      <CounterpartAutocomplete
                        control={control}
                        disabled={false}
                        name="counterpart"
                        label={t(i18n)`Vendor`}
                        customerTypes={customerTypes}
                        required={
                          isFieldRequired('counterpart', ocrRequiredFields) ||
                          isFieldRequiredByValidations(
                            'counterpart_id',
                            payablesValidations
                          )
                        }
                        getCounterpartDefaultValues={(
                          counterpartType?: string
                        ):
                          | DefaultValuesOCRIndividual
                          | DefaultValuesOCROrganization => {
                          const {
                            counterpart_address_object = null,
                            tax_payer_id = '',
                            counterpart_name = '',
                          } = (payable?.other_extracted_data as components['schemas']['OCRResponseInvoiceReceiptData']) ||
                          {};
                          return {
                            tax_id: tax_payer_id || '',
                            counterpart: {
                              email: '',
                              phone: '',
                              isCustomer: false,
                              isVendor: false,
                              line1: counterpart_address_object?.line1 || '',
                              line2: counterpart_address_object?.line2 || '',
                              city: counterpart_address_object?.city || '',
                              state: counterpart_address_object?.state || '',
                              postalCode:
                                counterpart_address_object?.postal_code || '',
                              ...(counterpart_address_object?.country && {
                                country:
                                  counterpart_address_object?.country as keyof typeof AllowedCountries,
                              }),
                              ...(counterpartType === 'individual' && {
                                firstName: counterpart_name,
                              }),
                              ...(counterpartType === 'individual' && {
                                lastName: '',
                              }),
                              ...(counterpartType === 'organization' && {
                                companyName: counterpart_name,
                              }),
                            },
                          };
                        }}
                        counterpartMatchingToOCRFound={matchingToOCRCounterpart}
                        counterpartRawName={payable?.counterpart_raw_data?.name}
                        showEditCounterpartButton
                        setShowEditCounterpartDialog={
                          setIsEditCounterpartOpened
                        }
                      />
                      <Controller
                        name="counterpartBankAccount"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl
                            variant="standard"
                            fullWidth
                            error={Boolean(error)}
                            required={
                              isFieldRequired(
                                'counterpartBankAccount',
                                ocrRequiredFields
                              ) ||
                              isFieldRequiredByValidations(
                                'counterpart_bank_account_id',
                                payablesValidations
                              )
                            }
                          >
                            <InputLabel htmlFor={field.name}>
                              {t(i18n)`Bank account`}
                            </InputLabel>
                            <Select
                              {...field}
                              id={field.name}
                              labelId={field.name}
                              label={t(i18n)`Bank Account`}
                              MenuProps={{ container: root }}
                              disabled={
                                !counterpartBankAccountQuery?.data ||
                                counterpartBankAccountQuery?.data?.data
                                  .length === 0
                              }
                            >
                              <Button
                                variant="text"
                                startIcon={<AddIcon />}
                                fullWidth
                                sx={{
                                  justifyContent: 'flex-start',
                                  px: 2,
                                  py: 1,
                                }}
                                onClick={() => setIsEditCounterpartOpened(true)}
                              >
                                {t(i18n)`Add new bank account`}
                              </Button>
                              {counterpartBankAccountQuery?.data?.data.map(
                                (bankAccount) => (
                                  <MenuItem
                                    key={bankAccount.id}
                                    value={bankAccount.id}
                                  >
                                    {getBankAccountName(i18n, bankAccount)}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {error && (
                              <FormHelperText>{error.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                      {showInvoiceDate && (
                        <Controller
                          name="invoiceDate"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <MuiDatePicker
                              maxDate={currentDueDate}
                              slotProps={{
                                popper: { container: root },
                                dialog: { container: root },
                                actionBar: {
                                  actions: ['clear', 'today'],
                                },
                                textField: {
                                  id: field.name,
                                  variant: 'outlined',
                                  fullWidth: true,
                                  error: Boolean(error),
                                  helperText: error?.message,
                                  required:
                                    isFieldRequired(
                                      'invoiceDate',
                                      ocrRequiredFields
                                    ) ||
                                    isFieldRequiredByValidations(
                                      'issued_at',
                                      payablesValidations
                                    ),
                                },
                              }}
                              {...field}
                              label={t(i18n)`Issue date`}
                              views={['year', 'month', 'day']}
                            />
                          )}
                        />
                      )}
                      <Controller
                        name="dueDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <MuiDatePicker
                            minDate={currentInvoiceDate}
                            slotProps={{
                              popper: { container: root },
                              dialog: { container: root },
                              actionBar: {
                                actions: ['clear', 'today'],
                              },
                              textField: {
                                id: field.name,
                                variant: 'outlined',
                                fullWidth: true,
                                error: Boolean(error),
                                helperText: error?.message,
                                required: isFieldRequired(
                                  'dueDate',
                                  ocrRequiredFields
                                ),
                              },
                            }}
                            {...field}
                            label={t(i18n)`Due date`}
                            views={['year', 'month', 'day']}
                          />
                        )}
                      />
                      <MoniteCurrency
                        name="currency"
                        control={control}
                        required={
                          isFieldRequired('currency', ocrRequiredFields) ||
                          isFieldRequiredByValidations(
                            'currency',
                            payablesValidations
                          )
                        }
                        groups={currencyGroups}
                        disabled={isLoadingCurrencyGroups}
                      />
                      {showTags && (
                        <TagsAutocompleteInput
                          control={control}
                          name="tags"
                          label={t(i18n)`Tags`}
                          variant="standard"
                          disabled={isTagsDisabled || !isTagsReadAllowed}
                          required={isFieldRequired('tags', ocrRequiredFields)}
                        />
                      )}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 3 }}
                    className={className + '-Items'}
                  >
                    <Typography variant="subtitle2" mb={2}>
                      {t(i18n)`Items`}
                    </Typography>
                    <PayableLineItemsForm />
                  </Paper>
                </Grid>
                <Grid item xs={12} className={className + '-Totals'}>
                  <Paper variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow className={className + '-Totals-Subtotal'}>
                          <TableCell>{t(i18n)`Subtotal`}</TableCell>
                          <TableCell align="right">
                            <Box
                              gap={0.5}
                              alignItems="center"
                              justifyContent="flex-end"
                              display="flex"
                            >
                              {currentDiscount === null && (
                                <Button
                                  startIcon={<AddIcon />}
                                  size="small"
                                  sx={{ pl: 1.25, pr: 2, py: 0 }}
                                  onClick={() => {
                                    const setValue = methods.setValue;
                                    setValue('discount', 0);
                                  }}
                                >
                                  {t(i18n)`Add Discount`}
                                </Button>
                              )}
                              {totals.subtotal && currentCurrency
                                ? formatCurrencyToDisplay(
                                    formatToMinorUnits(
                                      totals.subtotal,
                                      currentCurrency
                                    ) || 0,
                                    currentCurrency
                                  )
                                : '—'}
                            </Box>
                          </TableCell>
                        </TableRow>
                        {currentDiscount !== null && (
                          <TableRow className={className + '-Totals-Discount'}>
                            <TableCell>{t(i18n)`Discount`}</TableCell>
                            <TableCell align="right">
                              <Box
                                gap={0.5}
                                alignItems="center"
                                justifyContent="flex-end"
                                display="flex"
                              >
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    const setValue = methods.setValue;
                                    setValue('discount', null);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>

                                <Controller
                                  name="discount"
                                  control={control}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <TextField
                                      {...field}
                                      id={field.name}
                                      variant="standard"
                                      type="number"
                                      inputProps={{ min: 0, step: 0.01 }}
                                      error={Boolean(error)}
                                      sx={{ width: 150 }}
                                      InputProps={{
                                        endAdornment:
                                          getSymbolFromCurrency(
                                            currentCurrency
                                          ),
                                      }}
                                    />
                                  )}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className={className + '-Totals-Taxes'}>
                          <TableCell>{t(i18n)`VAT total`}</TableCell>
                          <TableCell align="right">
                            {totals.taxes && currentCurrency
                              ? formatCurrencyToDisplay(
                                  formatToMinorUnits(
                                    totals.taxes,
                                    currentCurrency
                                  ) || 0,
                                  currentCurrency
                                )
                              : '—'}
                          </TableCell>
                        </TableRow>
                        <TableRow className={className + '-Totals-Total'}>
                          <TableCell>
                            <Typography variant="subtitle1">{t(
                              i18n
                            )`Total`}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              {totals.total && currentCurrency
                                ? formatCurrencyToDisplay(
                                    formatToMinorUnits(
                                      totals.total,
                                      currentCurrency
                                    ) || 0,
                                    currentCurrency
                                  )
                                : '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
        <Dialog
          alignDialog="right"
          open={isEditCounterpartOpened}
          container={root}
          onClose={() => setIsEditCounterpartOpened(false)}
        >
          <CounterpartDetails
            id={currentCounterpart!}
            customerTypes={
              customerTypes || componentSettings?.counterparts?.customerTypes
            }
          />
        </Dialog>
      </>
    );
  }
);

type CurrencyEnum = components['schemas']['CurrencyEnum'];
