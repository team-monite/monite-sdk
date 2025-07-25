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
import { VatModeMenu } from '@/components/receivables/components';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { generateUniqueId } from '@/utils/uuid';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  Button,
  FormControl,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Stack,
  TableContainer,
  Box,
  Collapse,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

import { twMerge } from 'tailwind-merge';

import { CreateProductDialog } from '../components/CreateProductDialog';
import {
  FormErrorDisplay,
  useFormErrors,
} from '../components/FormErrorDisplay';
import { useCreateInvoiceProductsTable } from '../components/useCreateInvoiceProductsTable';
import { setValueWithValidation } from '../utils';
import { sanitizeLineItems } from '../utils';
import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '../validation';
import { ItemSelector } from './ItemSelector';
import { CUSTOM_ID } from './ItemSelector';
import { MeasureUnitController } from './MeasureUnitController';
import { PriceField } from './PriceField';
import { TaxRateController } from './TaxRateController';
import { VatRateController } from './VatRateController';

interface TotalTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  className?: string;
}

const TotalTableItem = ({ label, value, className }: TotalTableItemProps) => {
  return (
    <li
      className={twMerge(
        'mtw:flex mtw:justify-between mtw:items-center',
        className
      )}
    >
      <span>{label}</span>
      <span>{value?.toString()}</span>
    </li>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];

interface ProductItem {
  id: string;
  label: string;
  description?: string;
  price?: {
    currency: components['schemas']['CurrencyEnum'];
    value: number;
  };
  smallestAmount?: number;
  measureUnit?: components['schemas']['LineItemProductMeasureUnit'];
  vat_rate_id?: string;
  vat_rate_value?: number;
}

interface CreateInvoiceProductsTableProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
  isVatSelectionDisabled?: boolean;
}

export const ItemsSection = ({
  defaultCurrency,
  actualCurrency,
  isNonVatSupported,
  isVatSelectionDisabled,
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
  const { generalError, fieldErrors } = useFormErrors(error);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
    shouldUnregister: false,
  });

  const watchedLineItems = watch('line_items');
  const currentLineItems = useMemo(
    () => watchedLineItems || [],
    [watchedLineItems]
  );
  const isInclusivePricing = watch('vat_mode') === 'inclusive';

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
    taxesByVatRate,
  } = useCreateInvoiceProductsTable({
    lineItems: sanitizeLineItems(currentLineItems || fields),
    formatCurrencyToDisplay,
    isNonVatSupported,
    actualCurrency,
    isInclusivePricing,
  });

  useEffect(() => {
    isAddingRow.current = false;
  }, [fields.length]);

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
          description: template?.product?.description || '',
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
    if (isAddingRow.current || !mounted.current) {
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
    (name: string, value: unknown, shouldValidate = true) => {
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

        if (item.description) {
          setValueWithValidationLocal(
            `line_items.${index}.product.description`,
            item.description,
            false
          );
        }

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
        if (item.id !== CUSTOM_ID) {
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
          setValue('line_items', getValues('line_items'), {
            shouldValidate: true,
          });
        }, 0);
      }
    },
    [
      setValueWithValidationLocal,
      getValues,
      actualCurrency,
      defaultCurrency,
      setValue,
      handleAutoAddRow,
    ]
  );

  const handleCustomUpdate = useCallback(
    (index: number, item: ProductItem) => {
      if (!item) return;

      setValueWithValidationLocal(
        `line_items.${index}.product.name`,
        item.label || '',
        false
      );

      if (item.id !== '' && item.id !== CUSTOM_ID) {
        handleUpdate(index, item);
      }
    },
    [handleUpdate, setValueWithValidationLocal]
  );

  const createItemUpdateHandler =
    (index: number) => (item: ProductItem, isCatalogItem?: boolean) => {
      if (
        !item ||
        item.id === '' ||
        (item.id === CUSTOM_ID && !isCatalogItem)
      ) {
        handleCustomUpdate(index, item);
      } else {
        handleUpdate(index, item);
      }
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

      <FormErrorDisplay generalError={generalError} fieldErrors={fieldErrors} />

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
                <TableCell
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {t(i18n)`Price`}
                  <VatModeMenu disabled={isVatSelectionDisabled} />
                </TableCell>
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
                            !field.product?.name &&
                              !field.name &&
                              fieldErrors.name
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
                                error={Boolean(fieldErrors.quantity)}
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
                                    field.onChange(value);
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
                        sx={{ width: '25%', paddingLeft: 2, paddingRight: 2 }}
                        align="right"
                      >
                        <PriceField
                          index={index}
                          error={Boolean(fieldErrors.price)}
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
                            error={Boolean(fieldErrors.tax)}
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

      <Divider sx={{ my: 2 }} />

      <ul className="mtw:w-full mtw:flex mtw:flex-col mtw:gap-2 mtw:list-none">
        <TotalTableItem
          label={t(i18n)`Subtotal`}
          value={subtotalPrice}
          className="mtw:text-sm mtw:font-regular mtw:text-neutral-50"
        />

        {Object.entries(taxesByVatRate)?.length > 0 ? (
          Object.entries(taxesByVatRate).map(([taxRate, totalTax]) => (
            <TotalTableItem
              key={taxRate}
              label={t(i18n)`Total Tax (${taxRate}%)`}
              value={formatCurrencyToDisplay(
                totalTax,
                actualCurrency || defaultCurrency || 'USD',
                true
              )?.toString()}
              className="mtw:text-sm mtw:font-regular mtw:text-neutral-50"
            />
          ))
        ) : (
          <TotalTableItem
            label={t(i18n)`Taxes total`}
            value={totalTaxes}
            className="mtw:text-sm mtw:font-regular mtw:text-neutral-50"
          />
        )}

        <TotalTableItem
          label={t(i18n)`Total`}
          value={totalPrice}
          className="mtw:text-base mtw:font-medium mtw:text-neutral-10"
        />
      </ul>

      <CreateProductDialog
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
        open={isCreateDialogOpen}
        handleClose={() => setIsCreateDialogOpen(false)}
      />
    </Stack>
  );
};
