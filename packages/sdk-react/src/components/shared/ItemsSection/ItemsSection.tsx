import { ItemsSectionConfig } from './types';
import { useFormErrors } from './useFormErrors';
import { CreateProductDialog } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CreateProductDialog';
import { InvoiceItemRow } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/Items/InvoiceItemRow';
import { FormErrorDisplay } from '@/ui/FormErrorDisplay';
import { InvoiceTotals } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/Items/InvoiceTotals';
import {
  CUSTOM_ID,
  ProductItem,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/Items/ItemSelector';
import { useLineItemManagement } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/hooks/useLineItemManagement';
import type { CurrencyEnum } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/types';
import type { CreateReceivablesFormBeforeValidationProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { VatModeMenu } from '@/components/receivables/components';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { vatRateBasisPointsToPercentage } from '@/core/utils/vatUtils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Stack,
  TableContainer,
  Box,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { type ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Controller,
  useFormContext,
  FieldPath,
  FieldPathValue,
} from 'react-hook-form';

interface ConfigurableItemsSectionProps<
  TForm = CreateReceivablesFormBeforeValidationProps,
> {
  config: ItemsSectionConfig<TForm>;
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
  isVatSelectionDisabled?: boolean;
  registerLineItemCleanupFn?: (fn: (() => void) | null) => void;
  renderErrorDisplay?: (result: {
    generalError?: string | null;
    fieldErrors: Record<string, string | null | undefined>;
    hasErrors: boolean;
  }) => ReactNode;
}

export function ConfigurableItemsSection<
  TForm = CreateReceivablesFormBeforeValidationProps,
>({
  config,
  defaultCurrency = 'USD',
  actualCurrency = defaultCurrency,
  isNonVatSupported,
  isVatSelectionDisabled,
  registerLineItemCleanupFn,
  renderErrorDisplay,
}: ConfigurableItemsSectionProps<TForm>) {
  const { i18n } = useLingui();
  const { control, formState, getValues, trigger, watch } =
    useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const isInclusivePricing = watch('vat_mode') === 'inclusive';
  const { api } = useMoniteContext();

  const { data: vatRates } = api.vatRates.getVatRates.useQuery();

  const { data: measureUnitsData, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery(
      {},
      {
        enabled: !config.staticMeasureUnits,
      }
    );

  const effectiveMeasureUnitsData = useMemo(() => {
    if (config.staticMeasureUnits) {
      return {
        data: config.staticMeasureUnits.map((unit) => ({
          id: unit,
          name: unit,
          description: unit,
          created_at: '',
          updated_at: '',
        })),
      };
    }
    return measureUnitsData;
  }, [config.staticMeasureUnits, measureUnitsData]);

  const {
    fields,
    tooManyEmptyRows,
    subtotalPrice,
    totalPrice,
    totalTaxes,
    taxesByVatRate,
    shouldShowVatExemptRationale,
    lineItemErrors,
    handleAddRow,
    handleRemoveItem,
    handleAutoAddRow,
    setAutoAddedRows,
    setValueWithValidationLocal,
    cleanUpLineItemsForSubmission,
  } = useLineItemManagement({
    actualCurrency,
    defaultCurrency,
    isNonVatSupported,
    isInclusivePricing,
    itemStructure: config.fieldMapping.price === 'price' ? 'flat' : 'nested',
  });

  const setValueWithoutValidation = useCallback(
    <TName extends FieldPath<CreateReceivablesFormBeforeValidationProps>>(
      name: TName,
      value: FieldPathValue<CreateReceivablesFormBeforeValidationProps, TName>
    ) => {
      setValueWithValidationLocal(name, value, { shouldValidate: false });
    },
    [setValueWithValidationLocal]
  );

  useEffect(() => {
    if (config.features.autoAddRows) {
      registerLineItemCleanupFn?.(cleanUpLineItemsForSubmission);
      return () => registerLineItemCleanupFn?.(null);
    }
  }, [
    registerLineItemCleanupFn,
    cleanUpLineItemsForSubmission,
    config.features.autoAddRows,
  ]);

  const { generalError, fieldErrors } = useFormErrors(lineItemErrors);
  const hasErrorsDisplay = useMemo(
    () => Boolean(generalError) || Object.values(fieldErrors).some(Boolean),
    [generalError, fieldErrors]
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const className = 'Monite-ConfigurableItemsSection';
  const tableRowClassName = 'Monite-CreateReceivable-ItemsSection-Table';

  const highestVatRate = useMemo(() => {
    const rates = vatRates?.data;

    if (!rates?.length) {
      return undefined;
    }

    return rates.reduce((maxRate, currentRate) =>
      currentRate.value > maxRate.value ? currentRate : maxRate
    );
  }, [vatRates]);

  const handleOpenCreateDialog = () => {
    if (config.features.createNewProduct) {
      setIsCreateDialogOpen(true);
    }
  };

  const updateLineItemMeasureUnit = useCallback(
    (
      index: number,
      item: ProductItem,
      currentMeasureUnitId: string | undefined
    ) => {
      const itemMeasureUnitId = item.measureUnit?.id;
      const itemMeasureUnitName = item.measureUnit?.name;

      const measureUnitField =
        `line_items.${index}.${config.fieldMapping.measureUnit}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;

      if (config.staticMeasureUnits) {
        const unitValue = (itemMeasureUnitName ||
          config.staticMeasureUnits[0]) as FieldPathValue<
          CreateReceivablesFormBeforeValidationProps,
          typeof measureUnitField
        >;
        setValueWithoutValidation(measureUnitField, unitValue);
        return;
      }

      if (itemMeasureUnitName && !itemMeasureUnitId) {
        const measureUnitIdField =
          `line_items.${index}.product.measure_unit_id` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const measureUnitNameField =
          `line_items.${index}.product.measure_unit_name` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const measureUnitField =
          `line_items.${index}.measure_unit` as FieldPath<CreateReceivablesFormBeforeValidationProps>;

        setValueWithoutValidation(
          measureUnitIdField,
          '' as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof measureUnitIdField
          >
        );
        setValueWithoutValidation(
          measureUnitNameField,
          itemMeasureUnitName as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof measureUnitNameField
          >
        );
        setValueWithoutValidation(measureUnitField, {
          name: itemMeasureUnitName,
          id: null,
        } as FieldPathValue<
          CreateReceivablesFormBeforeValidationProps,
          typeof measureUnitField
        >);
      } else if (itemMeasureUnitId || currentMeasureUnitId) {
        const measureUnitIdField =
          `line_items.${index}.product.measure_unit_id` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const measureUnitNameField =
          `line_items.${index}.product.measure_unit_name` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const measureUnitField =
          `line_items.${index}.measure_unit` as FieldPath<CreateReceivablesFormBeforeValidationProps>;

        setValueWithoutValidation(
          measureUnitIdField,
          (itemMeasureUnitId || currentMeasureUnitId) as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof measureUnitIdField
          >
        );
        setValueWithoutValidation(
          measureUnitNameField,
          undefined as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof measureUnitNameField
          >
        );
        setValueWithoutValidation(
          measureUnitField,
          undefined as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof measureUnitField
          >
        );

        if (itemMeasureUnitId || currentMeasureUnitId) {
          const fieldPath =
            `line_items.${index}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          const currentValue = getValues(fieldPath) || {};

          setValueWithValidationLocal(
            fieldPath,
            currentValue as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof fieldPath
            >,
            {
              shouldValidate: true,
            }
          );
        }
      } else if (effectiveMeasureUnitsData?.data?.length) {
        const defaultUnitId = effectiveMeasureUnitsData.data[0]?.id;
        if (defaultUnitId) {
          const measureUnitIdField =
            `line_items.${index}.product.measure_unit_id` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          setValueWithoutValidation(
            measureUnitIdField,
            defaultUnitId as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof measureUnitIdField
            >
          );

          const fieldPath =
            `line_items.${index}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          const currentValue = getValues(fieldPath) || {};

          setValueWithValidationLocal(
            fieldPath,
            currentValue as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof fieldPath
            >,
            {
              shouldValidate: true,
            }
          );
        }
      }
    },
    [
      config.fieldMapping.measureUnit,
      config.staticMeasureUnits,
      effectiveMeasureUnitsData?.data,
      setValueWithoutValidation,
      getValues,
      setValueWithValidationLocal,
    ]
  );

  const handleItemUpdate = useCallback(
    async (index: number, item: ProductItem, isCatalogItem?: boolean) => {
      if (config.features.autoAddRows) {
        setAutoAddedRows((prev) => prev.filter((i) => i !== index));
      }

      const itemName = item.label ?? '';
      const itemNameField =
        `line_items.${index}.${config.fieldMapping.itemName}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
      setValueWithoutValidation(
        itemNameField,
        itemName as FieldPathValue<
          CreateReceivablesFormBeforeValidationProps,
          typeof itemNameField
        >
      );

      const isActualCatalogItem =
        item.id !== '' &&
        item.id !== CUSTOM_ID &&
        isCatalogItem &&
        config.features.productCatalog;

      if (isActualCatalogItem) {
        const priceField =
          `line_items.${index}.${config.fieldMapping.price}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const currencyField =
          `line_items.${index}.${config.fieldMapping.currency}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;

        const currentPrice = getValues(priceField);
        if (!currentPrice) {
          setValueWithoutValidation(
            priceField,
            (item.price?.value ?? 0) as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof priceField
            >
          );
        }
        setValueWithoutValidation(
          currencyField,
          actualCurrency as FieldPathValue<
            CreateReceivablesFormBeforeValidationProps,
            typeof currencyField
          >
        );

        const currentMeasureUnitField =
          `line_items.${index}.${config.fieldMapping.measureUnit}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const currentMeasureUnitId = getValues(currentMeasureUnitField);
        updateLineItemMeasureUnit(
          index,
          item,
          typeof currentMeasureUnitId === 'string'
            ? currentMeasureUnitId
            : undefined
        );

        if (item.vat_rate_id !== undefined && config.fieldMapping.vatRateId) {
          const vatRateIdField =
            `line_items.${index}.${config.fieldMapping.vatRateId}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          setValueWithoutValidation(
            vatRateIdField,
            item.vat_rate_id as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof vatRateIdField
            >
          );
        }
        if (
          item.vat_rate_value !== undefined &&
          config.fieldMapping.vatRateValue
        ) {
          const vatRateValueField =
            `line_items.${index}.${config.fieldMapping.vatRateValue}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          setValueWithoutValidation(
            vatRateValueField,
            item.vat_rate_value as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof vatRateValueField
            >
          );
        }

        const quantityField =
          `line_items.${index}.${config.fieldMapping.quantity}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
        const currentQuantity = getValues(quantityField);
        const quantityFromProductCatalog = item.smallestAmount ?? 1;
        if (
          currentQuantity === 1 ||
          currentQuantity === undefined ||
          currentQuantity === null
        ) {
          setValueWithoutValidation(
            quantityField,
            quantityFromProductCatalog as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof quantityField
            >
          );
        }

        if (config.fieldMapping.itemName === 'product.name') {
          const productTypeField =
            `line_items.${index}.product.type` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
          setValueWithoutValidation(
            productTypeField,
            'product' as FieldPathValue<
              CreateReceivablesFormBeforeValidationProps,
              typeof productTypeField
            >
          );
        }

        await Promise.resolve();

        if (config.features.autoAddRows) {
          handleAutoAddRow();
        }
      }
    },
    [
      config.fieldMapping,
      config.features.productCatalog,
      config.features.autoAddRows,
      actualCurrency,
      getValues,
      setAutoAddedRows,
      setValueWithoutValidation,
      handleAutoAddRow,
      updateLineItemMeasureUnit,
    ]
  );

  const isLoading = !config.staticMeasureUnits && isMeasureUnitsLoading;

  return (
    <Stack spacing={0} className={className}>
      <Typography
        variant="h3"
        fontSize={'1.25em'}
        fontWeight={500}
        sx={{ marginBottom: 1 }}
      >
        {t(i18n)`Items`}
      </Typography>

      {renderErrorDisplay ? (
        renderErrorDisplay({
          generalError,
          fieldErrors,
          hasErrors: hasErrorsDisplay,
        })
      ) : (
        <FormErrorDisplay
          generalError={generalError}
          fieldErrors={fieldErrors}
        />
      )}

      <Box>
        <TableContainer
          sx={{
            overflow: 'visible',
            overflowY: 'auto',
          }}
          className={`${className}-TableContainer ${tableRowClassName}-TableContainer`}
        >
          <Table
            stickyHeader
            sx={{
              '& .MuiTableRow-root': {
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                },
              },
            }}
          >
            <TableHead>
              <TableRow className={tableRowClassName}>
                <TableCell sx={{ padding: '0 !important' }}>{t(i18n)`Item name`}</TableCell>
                <TableCell sx={{ padding: '0 !important' }}>{t(i18n)`Quantity`}</TableCell>
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
                  {config.features.vatModeMenu && (
                    <VatModeMenu disabled={isVatSelectionDisabled} />
                  )}
                </TableCell>
                <TableCell sx={{ paddingLeft: 2, paddingRight: 2 }}>
                  {isNonVatSupported ? t(i18n)`Tax` : t(i18n)`VAT`}
                </TableCell>
                <TableCell sx={{ padding: '0 !important', width: '48px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
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
                  const mapSuffix = (suffix: string): string | null => {
                    switch (suffix) {
                      case 'product.name':
                        return config.fieldMapping.itemName;
                      case 'product.price.value':
                        return config.fieldMapping.price;
                      case 'product.price.currency':
                        return config.fieldMapping.currency;
                      case 'product.measure_unit_id':
                        return config.fieldMapping.measureUnit;
                      // PO flat fields must still map product paths used by child components
                      case 'price.value':
                        return config.fieldMapping.price;
                      case 'price.currency':
                        return config.fieldMapping.currency;
                      case 'quantity':
                        return config.fieldMapping.quantity;
                      case 'vat_rate_id':
                        return config.fieldMapping.vatRateId ?? null;
                      case 'vat_rate_value':
                        return config.fieldMapping.vatRateValue ?? null;
                      case 'tax_rate_value':
                        return config.fieldMapping.taxRateValue ?? null;
                      default:
                        return suffix;
                    }
                  };

                  const getLineItemFieldValueForCurrentRow = (
                    fieldPathSuffix: string
                  ) => {
                    const mapped = mapSuffix(fieldPathSuffix);
                    if (!mapped) return undefined;
                    const fieldPath =
                      `line_items.${index}.${mapped}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
                    const storedValue = getValues(fieldPath);
                    
                    return storedValue;
                  };

                  const setLineItemFieldValueForCurrentRow = (
                    fieldPathSuffix: string,
                    value: unknown,
                    options?: { shouldValidate?: boolean }
                  ) => {
                    const mapped = mapSuffix(fieldPathSuffix);
                    if (!mapped) return;
                    const specificPath =
                      `line_items.${index}.${mapped}` as FieldPath<CreateReceivablesFormBeforeValidationProps>;
                      
                    setValueWithValidationLocal(
                      specificPath,
                      value as FieldPathValue<
                        CreateReceivablesFormBeforeValidationProps,
                        typeof specificPath
                      >,
                      options
                    );
                  };

                  const onLineItemValueChangeAdapter = (
                    fieldPathSuffix: string,
                    value: unknown,
                    options?: { shouldValidate?: boolean }
                  ) => {
                    let newValue = value;
                    if (
                      fieldPathSuffix === 'vat_rate_value' &&
                      typeof value === 'number'
                    ) {
                      newValue =
                        value >= 100
                          ? vatRateBasisPointsToPercentage(value)
                          : value;
                    }
                    setLineItemFieldValueForCurrentRow(
                      fieldPathSuffix,
                      newValue,
                      options
                    );

                    if (
                      fieldPathSuffix === 'vat_rate_id' &&
                      typeof value === 'string' &&
                      vatRates?.data &&
                      Array.isArray(vatRates.data)
                    ) {
                      const rate = vatRates.data.find(
                        (r) => r.id === value
                      );
                      if (rate && typeof rate.value === 'number') {
                        const percent = vatRateBasisPointsToPercentage(
                          rate.value
                        );
                        setLineItemFieldValueForCurrentRow(
                          'vat_rate_value',
                          percent,
                          { shouldValidate: true }
                        );
                        
                        setLineItemFieldValueForCurrentRow(
                          'tax_rate_value',
                          undefined,
                          {
                            shouldValidate: false,
                          }
                        );
                      }
                    }
                  };

                  const markLineItemAsModifiedForCurrentRow = () => {
                    if (config.features.autoAddRows) {
                      setAutoAddedRows((prev) =>
                        prev.filter((i) => i !== index)
                      );
                    }
                  };

                  const triggerLineItemValidationForCurrentRow = (
                    fieldPathSuffix?: string
                  ) => {
                    const fieldPath = fieldPathSuffix
                      ? (`line_items.${index}.${fieldPathSuffix}` as FieldPath<CreateReceivablesFormBeforeValidationProps>)
                      : (`line_items.${index}` as FieldPath<CreateReceivablesFormBeforeValidationProps>);
                    trigger(fieldPath);
                  };

                  return (
                    <InvoiceItemRow
                      key={field.id}
                      field={field}
                      index={index}
                      control={control}
                      errors={formState.errors}
                      tableRowClassName={tableRowClassName}
                      actualCurrency={actualCurrency}
                      defaultCurrency={defaultCurrency}
                      measureUnitsData={effectiveMeasureUnitsData}
                      catalogEnabled={config.itemSelectionMode !== 'manual'}
                      isNonVatSupported={isNonVatSupported}
                      vatRates={vatRates?.data}
                      highestVatRate={highestVatRate}
                      onRequestLineItemValue={
                        getLineItemFieldValueForCurrentRow
                      }
                      onLineItemValueChange={onLineItemValueChangeAdapter}
                      onLineItemManuallyChanged={
                        markLineItemAsModifiedForCurrentRow
                      }
                      onRequestLineItemValidation={
                        triggerLineItemValidationForCurrentRow
                      }
                      onRequestOpenCreateProductDialog={handleOpenCreateDialog}
                      onUpdateItem={handleItemUpdate}
                      onRemoveItem={handleRemoveItem}
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box my={2}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddRow}
            disabled={config.features.autoAddRows && tooManyEmptyRows}
          >
            {t(i18n)`Row`}
          </Button>
          {config.features.autoAddRows && tooManyEmptyRows && (
            <Typography mt={2} variant="body2" color="warning">{t(
              i18n
            )`Please use some of the rows before adding new ones.`}</Typography>
          )}
        </Box>
      </Box>

      {config.features.vatExemptionRationale && (
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
      )}

      <InvoiceTotals
        subtotalPrice={subtotalPrice}
        totalTaxes={totalTaxes}
        totalPrice={totalPrice}
        taxesByVatRate={taxesByVatRate}
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
      />

      {config.features.createNewProduct && (
        <CreateProductDialog
          actualCurrency={actualCurrency}
          defaultCurrency={defaultCurrency}
          open={isCreateDialogOpen}
          handleClose={() => setIsCreateDialogOpen(false)}
        />
      )}
    </Stack>
  );
}
