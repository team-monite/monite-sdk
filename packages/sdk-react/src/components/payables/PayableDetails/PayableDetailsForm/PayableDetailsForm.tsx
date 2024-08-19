import { forwardRef, useEffect, useMemo, useRef } from 'react';
import {
  Controller,
  useForm,
  useFormState,
  FieldNamesMarkedBoolean,
  FormProvider,
} from 'react-hook-form';

import { components } from '@/api';
import { PayablesDetailsProps } from '@/components';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useOptionalFields } from '@/core/hooks/useOptionalFields';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getBankAccountName } from '@/core/utils/getBankAccountName';
import { MoniteCurrency } from '@/ui/Currency';
import { classNames } from '@/utils/css-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Grid,
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

import * as yup from 'yup';

import { OptionalFields } from '../../types';
import { PayableLineItemsForm } from '../PayableLineItemsForm';
import {
  counterpartsToSelect,
  tagsToSelect,
  prepareDefaultValues,
  prepareSubmit,
  PayableDetailsFormFields,
  LineItem,
  calculateTotalsForPayable,
} from './helpers';
import { usePayableDetailsForm } from './usePayableDetailsForm';

interface PayableDetailsFormProps {
  payable?: components['schemas']['PayableResponseSchema'];
  savePayable?: (
    id: string,
    payable: components['schemas']['PayableUpdateSchema'],
    lineItems?: Array<LineItem>,
    dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsFormFields>
  ) => void;
  createPayable?: (
    payable: components['schemas']['PayableUploadWithDataSchema'],
    createdLineItems?: Array<LineItem>
  ) => void;
  optionalFields?: OptionalFields;
  lineItems: components['schemas']['LineItemResponse'][] | undefined;
  payableDetailsFormId: string;
  ocrRequiredFields?: Pick<
    PayablesDetailsProps,
    'ocrRequiredFields'
  >['ocrRequiredFields'];
}

const getValidationSchema = (i18n: I18n) =>
  yup
    .object({
      invoiceNumber: yup
        .string()
        .label(t(i18n)`Invoice Number`)
        .required(),
      counterpart: yup.string().label(t(i18n)`Counterpart`),
      counterpartBankAccount: yup
        .string()
        .label(t(i18n)`Counterpart bank account`),
      dueDate: yup
        .date()
        .typeError(t(i18n)`Invalid date`)
        .label(t(i18n)`Due date`)
        .nullable()
        .required(),
      lineItems: yup.array().of(
        yup.object().shape({
          name: yup
            .string()
            .label(t(i18n)`Item name`)
            .required(),
          quantity: yup
            .number()
            .label(t(i18n)`Item quantity`)
            .positive()
            .required()
            .typeError(t(i18n)`Item quantity must be a number`),
          price: yup
            .number()
            .label(t(i18n)`Item price`)
            .required()
            .min(0)
            .typeError(t(i18n)`Item price must be a number`),
          tax: yup
            .number()
            .label(t(i18n)`Item tax`)
            .required()
            .min(0)
            .max(100)
            .typeError(t(i18n)`Item tax must be a number between 0 and 100`),
        })
      ),
      tags: yup.array(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      ),
    })
    .required();

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
      optionalFields,
      ocrRequiredFields,
      lineItems,
      payableDetailsFormId,
    },
    ref
  ) => {
    const { i18n } = useLingui();
    const {
      formatFromMinorUnits,
      formatToMinorUnits,
      formatCurrencyToDisplay,
    } = useCurrencies();
    const defaultValues = useMemo(
      () => prepareDefaultValues(formatFromMinorUnits, payable, lineItems),
      [formatFromMinorUnits, payable, lineItems]
    );
    const methods = useForm<PayableDetailsFormFields>({
      resolver: yupResolver(getValidationSchema(i18n)),
      defaultValues,
    });
    const { control, handleSubmit, watch, reset, resetField } = methods;
    const { dirtyFields } = useFormState({ control });
    const currentCounterpart = watch('counterpart');
    const currentInvoiceDate = watch('invoiceDate');
    const currentDueDate = watch('dueDate');
    const currentCurrency = watch('currency');
    const currentLineItems = watch('lineItems');

    const totals = calculateTotalsForPayable(currentLineItems);

    useEffect(() => {
      reset(prepareDefaultValues(formatFromMinorUnits, payable, lineItems));
    }, [payable, formatFromMinorUnits, reset, lineItems]);

    const { api } = useMoniteContext();
    const { data: matchingToOCRCounterpartId } =
      api.counterparts.getCounterparts.useQuery(
        {
          query: {
            counterpart_name__icontains: payable?.counterpart_raw_data?.name,
            limit: 1,
          },
        },
        {
          enabled: Boolean(
            !payable?.counterpart_id && payable?.counterpart_raw_data?.name
          ),
          select: (data) => data.data.at(0)?.id,
        }
      );

    useEffect(() => {
      if (!matchingToOCRCounterpartId) return;
      const getFieldState = methods.getFieldState;
      if (getFieldState('counterpart').isTouched) return;
      const setValue = methods.setValue;
      setValue('counterpart', matchingToOCRCounterpartId);
    }, [
      matchingToOCRCounterpartId,
      methods.resetField,
      methods.getFieldState,
      methods.setValue,
    ]);

    const { tagQuery, counterpartQuery, counterpartBankAccountQuery } =
      usePayableDetailsForm({
        currentCounterpartId: currentCounterpart,
      });
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

    const { root } = useRootElements();

    const className = 'Monite-PayableDetailsForm';

    const isFieldRequired = (fieldName: string) => {
      return ocrRequiredFields && ocrRequiredFields[fieldName];
    };

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
                const invoiceData = prepareSubmit({
                  ...values,
                  counterpartAddressId: counterpartQuery.data?.data?.find(
                    ({ id }) => id === values.counterpart
                  )?.default_billing_address_id,
                });

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
                <Grid item xs={12} className={className + '-Details'}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
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
                            label={t(i18n)`Invoice Number`}
                            variant="outlined"
                            fullWidth
                            error={Boolean(error)}
                            helperText={error?.message}
                            required={isFieldRequired('invoiceNumber')}
                            InputLabelProps={{
                              style: {
                                color: isFieldRequired('invoiceNumber')
                                  ? 'red'
                                  : undefined,
                              },
                            }}
                            InputProps={{
                              endAdornment: isFieldRequired('invoiceNumber')
                                ? '*'
                                : undefined,
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="counterpart"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl
                            variant="outlined"
                            fullWidth
                            error={Boolean(error)}
                            required={isFieldRequired('counterpart')}
                          >
                            <InputLabel
                              htmlFor={field.name}
                              style={{
                                color: isFieldRequired('counterpart')
                                  ? 'red'
                                  : undefined,
                              }}
                            >
                              {t(i18n)`Counterpart`}
                              {isFieldRequired('counterpart') && ' *'}
                            </InputLabel>
                            <Select
                              {...field}
                              id={field.name}
                              labelId={field.name}
                              label={t(i18n)`Counterpart`}
                              MenuProps={{ container: root }}
                              onChange={(event) => {
                                resetField('counterpartBankAccount');

                                return field.onChange(event);
                              }}
                            >
                              {counterpartsToSelect(
                                counterpartQuery?.data?.data
                              ).map((counterpart) => (
                                <MenuItem
                                  key={counterpart.value}
                                  value={counterpart.value}
                                >
                                  {counterpart.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {error && (
                              <FormHelperText>{error.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                      <Controller
                        name="counterpartBankAccount"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl
                            variant="outlined"
                            fullWidth
                            error={Boolean(error)}
                            required={isFieldRequired('counterpartBankAccount')}
                          >
                            <InputLabel
                              htmlFor={field.name}
                              style={{
                                color: isFieldRequired('counterpartBankAccount')
                                  ? 'red'
                                  : undefined,
                              }}
                            >
                              {t(i18n)`Bank Account`}
                              {isFieldRequired('counterpartBankAccount') &&
                                ' *'}
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
                                  required: isFieldRequired('invoiceDate'),
                                  InputLabelProps: {
                                    style: {
                                      color: isFieldRequired('invoiceDate')
                                        ? 'red'
                                        : undefined,
                                    },
                                  },
                                  InputProps: {
                                    endAdornment: isFieldRequired('invoiceDate')
                                      ? '*'
                                      : undefined,
                                  },
                                },
                              }}
                              {...field}
                              label={t(i18n)`Invoice date`}
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
                                required: isFieldRequired('dueDate'),
                                InputLabelProps: {
                                  style: {
                                    color: isFieldRequired('dueDate')
                                      ? 'red'
                                      : undefined,
                                  },
                                },
                                InputProps: {
                                  endAdornment: isFieldRequired('dueDate')
                                    ? '*'
                                    : undefined,
                                },
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
                        required={isFieldRequired('currency')}
                      />
                      {showTags && (
                        <Controller
                          name="tags"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <FormControl
                              variant="outlined"
                              fullWidth
                              required={isFieldRequired('tags')}
                              error={Boolean(error)}
                            >
                              <Autocomplete
                                {...field}
                                id={field.name}
                                disabled={!isTagsReadAllowed}
                                multiple
                                filterSelectedOptions
                                getOptionLabel={(option) => option.label}
                                options={tagsToSelect(tagQuery.data?.data)}
                                slotProps={{
                                  popper: { container: root },
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                onChange={(_, data) => {
                                  field.onChange(data);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t(i18n)`Tags`}
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(error)}
                                    helperText={error?.message}
                                    InputLabelProps={{
                                      style: {
                                        color: isFieldRequired('tags')
                                          ? 'red'
                                          : undefined,
                                      },
                                    }}
                                    InputProps={{
                                      endAdornment: isFieldRequired('tags')
                                        ? '*'
                                        : undefined,
                                    }}
                                  />
                                )}
                              />
                              {error && (
                                <FormHelperText>{error.message}</FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      )}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} className={className + '-Items'}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
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
                            {totals.subtotal && currentCurrency
                              ? formatCurrencyToDisplay(
                                  formatToMinorUnits(
                                    totals.subtotal,
                                    currentCurrency
                                  ) || 0,
                                  currentCurrency
                                )
                              : '—'}
                          </TableCell>
                        </TableRow>
                        <TableRow className={className + '-Totals-Taxes'}>
                          <TableCell>{t(i18n)`Taxes`}</TableCell>
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
                        <TableRow
                          className={className + '-Totals-Total'}
                          sx={{ '& td': { fontWeight: 500 } }}
                        >
                          <TableCell>{t(i18n)`Total`}</TableCell>
                          <TableCell align="right">
                            {totals.total && currentCurrency
                              ? formatCurrencyToDisplay(
                                  formatToMinorUnits(
                                    totals.total,
                                    currentCurrency
                                  ) || 0,
                                  currentCurrency
                                )
                              : '—'}
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
      </>
    );
  }
);
