import { CreateProductDialog } from '../components/CreateProductDialog';
import { CreateReceivablesFormBeforeValidationProps } from '../validation';
import {
  FormErrorDisplay,
  useFormErrors,
} from './components/Items/FormErrorDisplay';
import { InvoiceItemRow } from './components/Items/InvoiceItemRow';
import { InvoiceTotals } from './components/Items/InvoiceTotals';
import { CUSTOM_ID, ProductItem } from './components/Items/ItemSelector';
import { useLineItemManagement } from './hooks/useLineItemManagement';
import type { FormLineItemPath, CurrencyEnum } from './types';
import { VatModeMenu } from '@/components/receivables/components/VatModeMenu';
import { useMoniteContext } from '@/core/context/MoniteContext';
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
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Controller,
  useFormContext,
  FieldPath,
  FieldPathValue,
} from 'react-hook-form';

interface CreateInvoiceProductsTableProps {
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
  isVatSelectionDisabled?: boolean;
  registerLineItemCleanupFn?: (fn: (() => void) | null) => void;
}

export const ItemsSection = ({
  defaultCurrency = 'USD',
  actualCurrency = defaultCurrency,
  isNonVatSupported,
  isVatSelectionDisabled,
  registerLineItemCleanupFn,
}: CreateInvoiceProductsTableProps) => {
  const { i18n } = useLingui();
  const { control, formState, getValues, trigger, watch } =
    useFormContext<CreateReceivablesFormBeforeValidationProps>();

  const isInclusivePricing = watch('vat_mode') === 'inclusive';

  const { api } = useMoniteContext();
  const { data: vatRates } = api.vatRates.getVatRates.useQuery();
  const { data: measureUnitsData, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

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
    registerLineItemCleanupFn?.(cleanUpLineItemsForSubmission);

    return () => registerLineItemCleanupFn?.(null);
  }, [registerLineItemCleanupFn, cleanUpLineItemsForSubmission]);

  const { generalError, fieldErrors } = useFormErrors(lineItemErrors);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const className = 'Monite-CreateReceivable-ItemsSection';
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
    setIsCreateDialogOpen(true);
  };

  const updateLineItemMeasureUnit = useCallback(
    (
      index: number,
      item: ProductItem,
      currentMeasureUnitId: string | undefined
    ) => {
      const itemMeasureUnitId = item.measureUnit?.id;
      const itemMeasureUnitName = item.measureUnit?.name;

      // If the item has a measure unit with name but no ID, preserve it as a custom unit
      if (itemMeasureUnitName && !itemMeasureUnitId) {
        setValueWithoutValidation(
          `line_items.${index}.product.measure_unit_id`,
          ''
        );
        setValueWithoutValidation(
          `line_items.${index}.product.measure_unit_name`,
          itemMeasureUnitName
        );
        setValueWithoutValidation(`line_items.${index}.measure_unit`, {
          name: itemMeasureUnitName,
          id: null,
        });
      } else if (itemMeasureUnitId || currentMeasureUnitId) {
        // Otherwise, if there's a measure unit ID to use, set it
        setValueWithoutValidation(
          `line_items.${index}.product.measure_unit_id`,
          itemMeasureUnitId || currentMeasureUnitId
        );
        setValueWithoutValidation(
          `line_items.${index}.product.measure_unit_name`,
          undefined
        );
        setValueWithoutValidation(
          `line_items.${index}.measure_unit`,
          undefined
        );

        if (itemMeasureUnitId || currentMeasureUnitId) {
          const fieldPath = `line_items.${index}` as FormLineItemPath;
          const currentValue = getValues(`line_items.${index}`) || {};

          setValueWithValidationLocal(fieldPath, currentValue, {
            shouldValidate: true,
          });
        }
      } else if (measureUnitsData?.data?.length) {
        const defaultUnitId = measureUnitsData.data[0]?.id;
        if (defaultUnitId) {
          setValueWithoutValidation(
            `line_items.${index}.product.measure_unit_id`,
            defaultUnitId
          );
          const fieldPath = `line_items.${index}` as FormLineItemPath;
          const currentValue = getValues(`line_items.${index}`) || {};

          setValueWithValidationLocal(fieldPath, currentValue, {
            shouldValidate: true,
          });
        }
      }
    },
    [
      measureUnitsData?.data,
      setValueWithoutValidation,
      getValues,
      setValueWithValidationLocal,
    ]
  );

  const handleItemUpdate = useCallback(
    async (index: number, item: ProductItem, isCatalogItem?: boolean) => {
      setAutoAddedRows((prev) => prev.filter((i) => i !== index));

      const itemName = item.label ?? '';
      setValueWithoutValidation(`line_items.${index}.product.name`, itemName);

      const isActualCatalogItem =
        item.id !== '' && item.id !== CUSTOM_ID && isCatalogItem;

      // Only set VAT rates from catalog item when selecting from catalog, not for manual entries
      if (isActualCatalogItem) {
        const currentPrice = getValues(
          // if user manually typed a price it is unlikely they want the price of the catalogue to overwrite it
          `line_items.${index}.product.price.value`
        );
        if (!currentPrice) {
          setValueWithoutValidation(
            `line_items.${index}.product.price.value`,
            item.price?.value ?? 0
          );
        }
        setValueWithoutValidation(
          `line_items.${index}.product.price.currency`,
          actualCurrency
        );

        const currentMeasureUnitId = getValues(
          `line_items.${index}.product.measure_unit_id`
        );
        updateLineItemMeasureUnit(index, item, currentMeasureUnitId);

        // VAT/Tax rates from catalog have priority over existing values
        if (item.vat_rate_id !== undefined) {
          setValueWithoutValidation(
            `line_items.${index}.vat_rate_id`,
            item.vat_rate_id
          );
        }
        if (item.vat_rate_value !== undefined) {
          setValueWithoutValidation(
            `line_items.${index}.vat_rate_value`,
            item.vat_rate_value
          );
        }

        const currentQuantity = getValues(`line_items.${index}.quantity`);
        const quantityFromProductCatalog = item.smallestAmount ?? 1;
        if (
          currentQuantity === 1 ||
          currentQuantity === undefined ||
          currentQuantity === null
        ) {
          setValueWithoutValidation(
            `line_items.${index}.quantity`,
            quantityFromProductCatalog
          );
        }
        setValueWithoutValidation(
          `line_items.${index}.product.type`,
          'product'
        );

        await Promise.resolve();

        handleAutoAddRow();
      }
    },
    [
      actualCurrency,
      getValues,
      setAutoAddedRows,
      setValueWithoutValidation,
      handleAutoAddRow,
      updateLineItemMeasureUnit,
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
                  const getLineItemFieldValueForCurrentRow = (
                    fieldPathSuffix: string
                  ) =>
                    getValues(
                      `line_items.${index}.${fieldPathSuffix}` as FormLineItemPath
                    );

                  const setLineItemFieldValueForCurrentRow = (
                    fieldPathSuffix: string,
                    value: unknown,
                    options?: { shouldValidate?: boolean }
                  ) => {
                    const specificPath =
                      `line_items.${index}.${fieldPathSuffix}` as FormLineItemPath;
                    setValueWithValidationLocal(
                      specificPath,
                      value as FieldPathValue<
                        CreateReceivablesFormBeforeValidationProps,
                        FormLineItemPath
                      >,
                      options
                    );
                  };

                  const markLineItemAsModifiedForCurrentRow = () => {
                    setAutoAddedRows((prev) => prev.filter((i) => i !== index));
                  };

                  const triggerLineItemValidationForCurrentRow = (
                    fieldPathSuffix?: string
                  ) => {
                    trigger(
                      fieldPathSuffix
                        ? (`line_items.${index}.${fieldPathSuffix}` as FormLineItemPath)
                        : (`line_items.${index}` as FormLineItemPath)
                    );
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
                      measureUnitsData={measureUnitsData}
                      isNonVatSupported={isNonVatSupported}
                      vatRates={vatRates?.data}
                      highestVatRate={highestVatRate}
                      onRequestLineItemValue={
                        getLineItemFieldValueForCurrentRow
                      }
                      onLineItemValueChange={setLineItemFieldValueForCurrentRow}
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

      <InvoiceTotals
        subtotalPrice={subtotalPrice}
        totalTaxes={totalTaxes}
        totalPrice={totalPrice}
        taxesByVatRate={taxesByVatRate}
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
      />

      <CreateProductDialog
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
        open={isCreateDialogOpen}
        handleClose={() => setIsCreateDialogOpen(false)}
      />
    </Stack>
  );
};
