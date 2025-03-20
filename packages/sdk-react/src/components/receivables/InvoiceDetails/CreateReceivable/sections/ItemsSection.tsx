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

interface CreateInvoiceProductsTableProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
}

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
    isNonVatSupported: isNonVatSupported,
    actualCurrency,
  });

  // Hook to detect when rows finish adding
  useEffect(() => {
    // When fields length changes, we know the row addition has completed
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
    () => ({
      id: generateUniqueId(),
      product: {
        price: {
          value: 0,
          currency: actualCurrency || defaultCurrency || 'USD',
        },
        name: '',
        type: 'product' as const, //since those are not saved in catalogue i am presuming type does not matter
      },
      quantity: 1,
      vat_rate_id: highestVatRate?.id,
      vat_rate_value: highestVatRate?.value,
    }),
    [actualCurrency, defaultCurrency, highestVatRate?.id, highestVatRate?.value]
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

    // Prevent duplicate additions
    if (isAddingRow.current) {
      return;
    }

    setTooManyEmptyRows(false);
    isAddingRow.current = true;
    append(createEmptyRow());
  }, [fields, append, createEmptyRow]);

  const handleAutoAddRow = useCallback(() => {
    // Prevent duplicate additions
    if (isAddingRow.current) {
      return;
    }

    // Get a fresh count of empty rows
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

  // Initialize with a single empty row only once
  useEffect(() => {
    if (!mounted.current) {
      // Prevent adding a row if we're already in the process
      if (isAddingRow.current) {
        return;
      }

      // Check if we already have line items from the form
      const existingItems = getValues('line_items');

      // Only add a row if no items exist
      if (!existingItems || existingItems.length === 0) {
        isAddingRow.current = true;
        append(createEmptyRow());
      }

      mounted.current = true;
    }
  }, [append, createEmptyRow, getValues]);

  // Reset the isAddingRow flag whenever fields change
  useEffect(() => {
    isAddingRow.current = false;
  }, [fields.length]);

  const { data: measureUnitsData, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const measureUnits = measureUnitsData?.data;

  const setValueWithValidationLocal = useCallback(
    (name: string, value: any, shouldValidate = true) => {
      setValueWithValidation(name, value, shouldValidate, setValue);
    },
    [setValue]
  );

  const handleUpdate = useCallback(
    (index: number, item: ProductItem) => {
      if (item) {
        // Name doesn't affect calculations - no validation needed
        setValueWithValidationLocal(
          `line_items.${index}.product.name`,
          item.label,
          false
        );

        // Price affects calculations - validation needed
        const currentPrice = getValues(
          `line_items.${index}.product.price.value`
        );
        if (!currentPrice || currentPrice === 0) {
          setValueWithValidationLocal(
            `line_items.${index}.product.price.value`,
            item.price?.value || 0
          );
        }

        setValueWithValidationLocal(
          `line_items.${index}.product.price.currency`,
          actualCurrency || defaultCurrency || 'USD'
        );

        // Measure unit affects display but not calculations
        // First check if the item already has a measure unit
        const currentMeasureUnitId = getValues(
          `line_items.${index}.product.measure_unit_id`
        );
        const itemMeasureUnitId = item.measureUnit?.id;
        const itemMeasureUnitName = item.measureUnit?.name;

        // Prioritize:
        // 1. Keep current if exists
        // 2. Find by name if item has name but no ID
        // 3. Use item's measure unit ID
        // 4. Fallback to first available
        let measureUnitId: string | undefined;

        if (currentMeasureUnitId) {
          // Keep existing measure unit if there is one
          measureUnitId = currentMeasureUnitId;
        } else if (itemMeasureUnitName && !itemMeasureUnitId && measureUnits) {
          // Find measure unit by name if it has a name but no ID
          const matchedUnit = measureUnits.find(
            (unit) => unit.name === itemMeasureUnitName
          );
          if (matchedUnit) {
            measureUnitId = matchedUnit.id;
          }
        } else if (itemMeasureUnitId) {
          // Use the item's measure unit
          measureUnitId = itemMeasureUnitId;
        } else if (measureUnits?.[0]?.id) {
          // Fallback to first available measure unit
          measureUnitId = measureUnits[0].id;
        }

        if (measureUnitId) {
          setValueWithValidationLocal(
            `line_items.${index}.product.measure_unit_id`,
            measureUnitId,
            false
          );
        }

        // VAT/Tax rates affect calculations - validation needed
        setValueWithValidationLocal(
          `line_items.${index}.vat_rate_id`,
          item.vat_rate_id
        );
        setValueWithValidationLocal(
          `line_items.${index}.vat_rate_value`,
          item.vat_rate_value
        );
        setValueWithValidationLocal(
          `line_items.${index}.quantity`,
          item.smallestAmount || 1
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
      measureUnits,
      handleAutoAddRow,
    ]
  );

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

      {/* quantity error */}
      <Collapse
        in={Boolean(quantityError)}
        sx={{
          ':not(.MuiCollapse-hidden)': {
            marginBottom: 1,
          },
        }}
      >
        <Alert severity="error">{quantityError}</Alert>
      </Collapse>

      {/* name error */}
      <Collapse
        in={Boolean(nameError)}
        sx={{
          ':not(.MuiCollapse-hidden)': {
            marginBottom: 1,
          },
        }}
      >
        <Alert severity="error">{nameError}</Alert>
      </Collapse>

      <Box>
        <TableContainer
          sx={{
            overflow: 'visible',
            overflowY: 'auto',
          }}
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '8px',
                  }}
                >
                  <CircularProgress size={20} />
                </Box>
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
                          setIsCreateItemOpened={setIsCreateDialogOpen}
                          onUpdate={(item) => handleUpdate(index, item)}
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
                            variant="standard"
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
      </Box>

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
