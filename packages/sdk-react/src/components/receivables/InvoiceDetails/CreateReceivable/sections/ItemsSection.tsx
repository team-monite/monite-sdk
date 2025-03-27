import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { classNames } from '@/utils/css-utils';
import { generateUniqueId } from '@/utils/uuid';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  Alert,
  Button,
  FormControl,
  Card,
  Grid,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  TypographyTypeMap,
  Stack,
  TableContainer,
  Box,
  Collapse,
  CardContent,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

import { CreateProductDialog } from '../components/CreateProductDialog';
import { useCreateInvoiceProductsTable } from '../components/useCreateInvoiceProductsTable';
import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '../validation';
import { ItemSelector } from './ItemSelector';
import { MeasureUnitController } from './MeasureUnitController';
import { PriceField } from './PriceField';
import { ValidationErrorItem } from './Section.types';
import { TaxRateController } from './TaxRateController';
import { setValueWithValidation } from './utils';
import { VatRateController } from './VatRateController';

interface CardTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  variant?: TypographyTypeMap['props']['variant'];
  sx?: TypographyTypeMap['props']['sx'];
  className?: string;
}

const CardTableItem = ({
  label,
  value,
  variant = 'body1',
  sx,
  className,
}: CardTableItemProps) => {
  const componentClassName = 'Monite-CreateReceivable-CardTableItem';
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={classNames(componentClassName, className)}
    >
      <Grid item xs={4}>
        {typeof label === 'string' ? (
          <Typography variant="body1">{label}</Typography>
        ) : (
          label
        )}
      </Grid>
      {value && (
        <Grid item xs={8} display="flex" justifyContent="end">
          <Typography
            variant={variant}
            sx={sx}
            className={componentClassName + '-Value'}
          >
            {value.toString()}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];

interface ProductItem {
  id: string;
  label: string;
  price?: {
    currency: components['schemas']['CurrencyEnum'];
    value: number;
  };
  smallestAmount?: number;
  measureUnit?: components['schemas']['package__receivables__latest__receivables__LineItemProductMeasureUnit'];
  vat_rate_id?: string;
  vat_rate_value?: number;
}

interface CreateInvoiceProductsTableProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
}

export const ItemsSection = ({
  defaultCurrency,
  actualCurrency,
  isNonVatSupported,
}: CreateInvoiceProductsTableProps) => {
  const { i18n } = useLingui();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const error = errors?.line_items;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
    shouldUnregister: false,
  });

  // Use getValues to get current line items instead of watch to prevent excessive re-renders
  const getCurrentLineItems = useCallback(() => {
    return getValues('line_items');
  }, [getValues]);

  // Watch for changes to line items to trigger re-renders
  const watchedLineItems = watch('line_items');

  // To avoid excessive recalculations, memoize the line items for the calculations
  // Include watchedLineItems in dependencies to ensure re-render when values change
  const currentLineItems = useMemo(
    () => getCurrentLineItems(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getCurrentLineItems, watchedLineItems]
  );

  const mounted = useRef(false);
  const isAddingRow = useRef(false);
  const { api } = useMoniteContext();
  const { data: vatRates } = api.vatRates.getVatRates.useQuery();
  const { formatCurrencyToDisplay } = useCurrencies();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const {
    subtotalPrice,
    totalPrice,
    totalTaxes,
    shouldShowVatExemptRationale,
  } = useCreateInvoiceProductsTable({
    lineItems: currentLineItems || fields,
    formatCurrencyToDisplay,
    isNonVatSupported,
    actualCurrency,
  });

  useEffect(() => {
    isAddingRow.current = false;
  }, [fields.length]);

  const generalError = useMemo(() => {
    if (!error || Array.isArray(error)) {
      return;
    }

    return error.message;
  }, [error]);

  const getErrorMessage = useCallback(
    (key: string) => {
      if (!error || !Array.isArray(error)) {
        return;
      }

      const keys = key.split('.');

      const specificError = error.find((item) => {
        let current: ValidationErrorItem = item;
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k] as ValidationErrorItem;
          } else {
            return false;
          }
        }
        return current && typeof current === 'object' && 'message' in current;
      });

      if (!specificError) {
        return;
      }

      let result: ValidationErrorItem = specificError;
      for (const k of keys) {
        result = result?.[k] as ValidationErrorItem;
      }

      return (result as unknown as { message: string })?.message;
    },
    [error]
  );

  const quantityError = useMemo(
    () => getErrorMessage('quantity'),
    [getErrorMessage]
  );
  const nameError = useMemo(
    () => getErrorMessage('product.name'),
    [getErrorMessage]
  );
  const priceError = useMemo(() => {
    return (
      getErrorMessage('product.price.value') ||
      getErrorMessage('product.price.currency')
    );
  }, [getErrorMessage]);
  const taxError = useMemo(() => {
    return (
      getErrorMessage('vat_rate_id') ||
      getErrorMessage('vat_rate_value') ||
      getErrorMessage('tax_rate_value')
    );
  }, [getErrorMessage]);

  const className = 'Monite-CreateReceivable-ItemsSection';
  const tableRowClassName = 'Monite-CreateReceivable-ItemsSection-Table';

  const highestVatRate = useMemo(
    () =>
      vatRates?.data?.reduce(
        (max, rate) => (rate.value > max.value ? rate : max),
        vatRates.data[0]
      ),
    [vatRates]
  );

  const createEmptyRow = useCallback(
    (
      template?: CreateReceivablesFormBeforeValidationLineItemProps
    ): CreateReceivablesFormBeforeValidationLineItemProps => {
      const product: CreateReceivablesFormBeforeValidationLineItemProps['product'] =
        {
          name: template?.product?.name || '',
          price: {
            currency: actualCurrency || defaultCurrency || 'USD',
            value: template?.product?.price?.value || 0,
          },
          measure_unit_id: template?.product?.measure_unit_id || '',
          type: template?.product?.type || 'product',
        };

      // Preserve VAT rates correctly based on region
      // For non-VAT regions, use tax_rate_value, otherwise preserve vat_rate_id and vat_rate_value
      return {
        id: template?.id ?? generateUniqueId(),
        product_id: template?.product_id || '',
        product,
        quantity: template?.quantity ?? 1,
        // Preserve VAT values or set defaults based on region
        vat_rate_id: isNonVatSupported ? undefined : template?.vat_rate_id,
        vat_rate_value: isNonVatSupported
          ? undefined
          : template?.vat_rate_value,
        tax_rate_value: isNonVatSupported
          ? template?.tax_rate_value ?? 0
          : undefined,
        // Preserve measure_unit for custom units
        ...(template?.measure_unit
          ? { measure_unit: template.measure_unit }
          : {}),
      };
    },
    [actualCurrency, defaultCurrency, isNonVatSupported]
  );

  const [tooManyEmptyRows, setTooManyEmptyRows] = useState(false);

  const countEmptyRows = (
    fields: CreateReceivablesFormBeforeValidationLineItemProps[]
  ) => {
    return fields.reduce(
      (count, field) => (field.product?.name === '' ? count + 1 : count),
      0
    );
  };

  const handleAddRow = useCallback(() => {
    const emptyRowCount = countEmptyRows(fields);

    if (emptyRowCount > 4) {
      setTooManyEmptyRows(true);
      return;
    }

    if (isAddingRow.current) {
      return;
    }

    setTooManyEmptyRows(false);
    isAddingRow.current = true;
    append(createEmptyRow());
  }, [fields, append, createEmptyRow]);

  const handleAutoAddRow = useCallback(() => {
    if (isAddingRow.current) {
      return;
    }

    const currentItems = getValues('line_items');
    const emptyRowCount = countEmptyRows(currentItems || fields);

    if (emptyRowCount < 5) {
      setTooManyEmptyRows(false);
    }

    // Only add a new row if there are NO empty rows left
    // This prevents adding too many rows automatically
    if (emptyRowCount === 0 && fields.length > 0) {
      isAddingRow.current = true;
      append(createEmptyRow());
    }
  }, [fields, append, createEmptyRow, getValues]);

  useEffect(() => {
    if (!mounted.current) {
      if (isAddingRow.current) {
        return;
      }

      const existingItems = getValues('line_items');

      if (!existingItems || existingItems.length === 0) {
        isAddingRow.current = true;
        append(createEmptyRow());
      }

      mounted.current = true;
    }
  }, [append, createEmptyRow, getValues]);

  const { data: measureUnitsData, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const measureUnits = measureUnitsData?.data;

  const setValueWithValidationLocal = useCallback(
    (name: string, value: any, shouldValidate = true) => {
      setValueWithValidation(name, value, shouldValidate, setValue);
    },
    [setValue]
  );

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleUpdate = useCallback(
    (index: number, item: ProductItem) => {
      if (item) {
        setValueWithValidationLocal(
          `line_items.${index}.product.name`,
          item.label,
          false
        );

        const currentPrice = getValues(
          // if user manually typed a price it is unlikely they want the price of the catalogue to overwrite it
          `line_items.${index}.product.price.value`
        );
        if (!currentPrice || currentPrice === 0) {
          setValueWithValidationLocal(
            `line_items.${index}.product.price.value`,
            item.price?.value ?? 0
          );
        }

        setValueWithValidationLocal(
          `line_items.${index}.product.price.currency`,
          actualCurrency || defaultCurrency || 'USD'
        );

        const currentMeasureUnitId = getValues(
          `line_items.${index}.product.measure_unit_id`
        );
        const itemMeasureUnitId = item.measureUnit?.id;
        const itemMeasureUnitName = item.measureUnit?.name;

        // If the item has a measure unit with name but no ID, preserve it as a custom unit
        if (itemMeasureUnitName && !itemMeasureUnitId) {
          setValueWithValidationLocal(
            `line_items.${index}.product.measure_unit_id`,
            '',
            false
          );
          setValueWithValidationLocal(
            `line_items.${index}.product.measure_unit_name`,
            itemMeasureUnitName,
            false
          );
          setValueWithValidationLocal(
            `line_items.${index}.measure_unit`,
            { name: itemMeasureUnitName, id: null },
            false
          );
        }
        // Otherwise, if there's a measure unit ID to use, set it
        else if (itemMeasureUnitId || currentMeasureUnitId) {
          setValueWithValidationLocal(
            `line_items.${index}.product.measure_unit_id`,
            itemMeasureUnitId || currentMeasureUnitId,
            false
          );
          // Clear any custom unit name
          setValueWithValidationLocal(
            `line_items.${index}.product.measure_unit_name`,
            undefined,
            false
          );
          setValueWithValidationLocal(
            `line_items.${index}.measure_unit`,
            undefined,
            false
          );
        }

        // Only set VAT rates from catalog item when selecting from catalog, not for manual entries
        if (item.id !== 'custom') {
          // VAT/Tax rates from catalog have priority over existing values
          if (item.vat_rate_id !== undefined) {
            setValueWithValidationLocal(
              `line_items.${index}.vat_rate_id`,
              item.vat_rate_id
            );
          }

          if (item.vat_rate_value !== undefined) {
            setValueWithValidationLocal(
              `line_items.${index}.vat_rate_value`,
              item.vat_rate_value
            );
          }
        }

        setValueWithValidationLocal(
          `line_items.${index}.quantity`,
          item.smallestAmount ?? 1
        );
        setValueWithValidationLocal(
          `line_items.${index}.product.type`,
          'product',
          false
        );

        setTimeout(() => {
          handleAutoAddRow();
        }, 0);
      }
    },
    [
      actualCurrency,
      defaultCurrency,
      setValueWithValidationLocal,
      getValues,
      handleAutoAddRow,
    ]
  );

  const createItemUpdateHandler = (index: number) => (item: ProductItem) => {
    handleUpdate(index, item);
  };

  return (
    <Stack spacing={0} className={className}>
      <Typography
        variant="h3"
        fontSize={'1.25em'}
        fontWeight={500}
        sx={{ marginBottom: 2 }}
      >
        {t(i18n)`Items`}
      </Typography>

      {/* no items error */}
      <Collapse
        in={Boolean(generalError)}
        sx={{
          ':not(.MuiCollapse-hidden)': {
            marginBottom: 1,
          },
        }}
      >
        <Alert severity="error">{generalError}</Alert>
      </Collapse>

      {/* Form-level error message display for specific errors */}
      {(quantityError || nameError || priceError || taxError) && (
        <Box
          sx={{
            color: 'error.main',
            mb: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'error.light',
            borderRadius: 1,
            backgroundColor: 'error.lighter',
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {t(i18n)`Please correct the following errors:`}
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {nameError && <li>{nameError}</li>}
            {quantityError && <li>{quantityError}</li>}
            {priceError && <li>{priceError}</li>}
            {taxError && <li>{taxError}</li>}
          </ul>
        </Box>
      )}

      <Box>
        <TableContainer
          sx={{
            overflow: 'visible',
            overflowY: 'auto',
          }}
          className={`${className}-TableContainer ${tableRowClassName}-TableContainer`}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow className={tableRowClassName}>
                <TableCell sx={{ paddingLeft: 2, paddingRight: 2 }}>{t(
                  i18n
                )`Item name`}</TableCell>
                <TableCell sx={{ paddingLeft: 2, paddingRight: 2 }}>{t(
                  i18n
                )`Quantity`}</TableCell>
                <TableCell sx={{ paddingLeft: 2, paddingRight: 2 }}>{t(
                  i18n
                )`Price`}</TableCell>
                <TableCell sx={{ paddingLeft: 2, paddingRight: 2 }}>
                  {isNonVatSupported ? t(i18n)`Tax` : t(i18n)`VAT`}
                </TableCell>
                <TableCell sx={{ padding: 0, width: '48px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isMeasureUnitsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                fields.map((field, index) => {
                  return (
                    <TableRow
                      key={field.id || generateUniqueId()}
                      className={tableRowClassName}
                    >
                      <TableCell
                        sx={{
                          width: { xs: '30%', xl: '40%' },
                          paddingLeft: 0,
                          paddingRight: 2,
                        }}
                      >
                        <ItemSelector
                          onCreateItem={handleOpenCreateDialog}
                          onUpdate={createItemUpdateHandler(index)}
                          fieldName={field.product?.name || field.name}
                          index={index}
                          error={Boolean(
                            !field.product?.name && !field.name && nameError
                          )}
                          actualCurrency={actualCurrency}
                          defaultCurrency={defaultCurrency}
                          measureUnits={measureUnitsData}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          width: { xs: '30%', xl: '20%' },
                          paddingLeft: 2,
                          paddingRight: 2,
                        }}
                      >
                        {/* TODO: quantity field in its own separate file so it can be reused with measure units? */}
                        <Controller
                          name={`line_items.${index}.quantity`}
                          render={({ field }) => {
                            return (
                              <FormControl
                                variant="standard"
                                fullWidth
                                required
                                error={Boolean(quantityError)}
                              >
                                <TextField
                                  {...field}
                                  InputProps={{
                                    endAdornment: (measureUnits?.length ?? 0) >
                                      0 && (
                                      <InputAdornment position="end">
                                        <MeasureUnitController
                                          control={control}
                                          index={index}
                                          errors={errors}
                                          fieldError={
                                            errors.line_items?.[index]?.product
                                              ?.measure_unit_id
                                          }
                                          measureUnits={measureUnits}
                                          getValues={getValues}
                                          setValue={setValue}
                                          skipDefaultAssignment={
                                            fields.length > 0 ||
                                            Boolean(
                                              getValues(
                                                `line_items.${index}.product.measure_unit_name`
                                              ) ||
                                                getValues(
                                                  `line_items.${index}.measure_unit.name`
                                                )
                                            )
                                          }
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                  type="number"
                                  inputProps={{ min: 1 }}
                                  size="small"
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    setValueWithValidationLocal(
                                      `line_items.${index}.quantity`,
                                      value
                                    );
                                    field.onChange(e);
                                  }}
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      paddingRight: '0 !important',
                                      '.MuiInputBase-input': {
                                        paddingRight: 0,
                                      },
                                      '&:hover .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)':
                                        {
                                          borderColor: 'transparent',
                                        },
                                    },
                                  }}
                                />
                              </FormControl>
                            );
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{ width: '20%', paddingLeft: 2, paddingRight: 2 }}
                        align="right"
                      >
                        <PriceField
                          index={index}
                          error={Boolean(priceError)}
                          currency={actualCurrency || defaultCurrency || 'USD'}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          width: 'fit-content',
                          paddingLeft: 2,
                          paddingRight: 2,
                        }}
                      >
                        {isNonVatSupported ? (
                          <TaxRateController
                            control={control}
                            index={index}
                            errors={errors}
                            fieldError={
                              errors.line_items?.[index]?.tax_rate_value
                            }
                            getValues={getValues}
                            setValue={setValue}
                          />
                        ) : (
                          <FormControl
                            variant="outlined"
                            fullWidth
                            required
                            error={Boolean(taxError)}
                          >
                            <VatRateController
                              control={control}
                              index={index}
                              errors={errors}
                              fieldError={
                                errors.line_items?.[index]?.vat_rate_id
                              }
                              vatRates={vatRates?.data}
                              getValues={getValues}
                              setValue={setValue}
                              isNonVatSupported={isNonVatSupported}
                              highestVatRate={highestVatRate}
                            />
                          </FormControl>
                        )}
                      </TableCell>

                      <TableCell sx={{ padding: 0, width: '48px' }}>
                        <IconButton
                          onClick={() => {
                            remove(index);
                            const emptyRowCount = countEmptyRows(fields);

                            if (emptyRowCount < 5) {
                              setTooManyEmptyRows(false);
                            }
                          }}
                          sx={{ padding: '4px' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddRow}
            disabled={tooManyEmptyRows}
          >
            {t(i18n)`Row`}
          </Button>
          {tooManyEmptyRows && (
            <Typography mt={2} variant="body2" color="warning">{t(
              i18n
            )`Please use some of the rows before adding new ones.`}</Typography>
          )}
        </Box>
      </Box>

      <Collapse in={shouldShowVatExemptRationale}>
        <Box sx={{ m: 2 }}>
          <Controller
            name="vat_exemption_rationale"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t(i18n)`VAT Exempt Rationale`}
                multiline
                rows={2}
                fullWidth
                error={Boolean(error)}
              />
            )}
          />
        </Box>
      </Collapse>

      <Card
        className={className + '-Totals'}
        variant="outlined"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          borderRadius: 0,
          border: 0,
          paddingBottom: 4,
        }}
      >
        <CardContent sx={{ maxWidth: '560px', width: '100%' }}>
          <Stack>
            <CardTableItem
              label={t(i18n)`Subtotal`}
              value={subtotalPrice}
              className="Monite-Subtotal"
            />
            <Divider sx={{ my: 1.5 }} />
            <CardTableItem
              key={`totalTaxes-${totalTaxes}`}
              label={t(i18n)`Taxes total`}
              value={totalTaxes}
              className="Monite-TaxesTotal"
            />
            <Divider sx={{ my: 1.5 }} />
            <CardTableItem
              label={
                <Typography variant="subtitle1">{t(i18n)`Total`}</Typography>
              }
              value={totalPrice}
              variant="subtitle1"
              className="Monite-Total"
            />
          </Stack>
        </CardContent>
      </Card>

      <CreateProductDialog
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
        open={isCreateDialogOpen}
        handleClose={() => setIsCreateDialogOpen(false)}
      />
    </Stack>
  );
};
