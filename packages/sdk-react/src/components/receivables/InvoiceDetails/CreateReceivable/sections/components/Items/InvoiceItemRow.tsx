import type { LineItemPath } from '../../types';
import { ItemSelector, ProductItem } from './ItemSelector';
import { PriceField } from './PriceField';
import { QuantityField } from './QuantityField';
import { TaxRateField } from './TaxRateField';
import { VatRateField } from './VatRateField';
import { components } from '@/api';
import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { TableCell, TableRow, IconButton, FormControl } from '@mui/material';
import { memo } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

interface InvoiceItemRowProps {
  field: { id: string };
  index: number;
  control: Control<CreateReceivablesFormBeforeValidationProps>;
  errors: FieldErrors<CreateReceivablesFormBeforeValidationProps>;
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  measureUnitsData?: MeasureUnitListResponseType;
  catalogEnabled?: boolean;
  isNonVatSupported: boolean;
  vatRates?: VatRateItemType[];
  highestVatRate?: VatRateItemType;
  tableRowClassName: string;

  onLineItemValueChange: (
    fieldPathSuffix: LineItemPath,
    value: unknown,
    options?: { shouldValidate?: boolean }
  ) => void;
  onLineItemManuallyChanged: () => void;
  onRequestLineItemValue: (fieldPathSuffix: LineItemPath) => unknown;
  onRequestLineItemValidation?: (fieldPathSuffix?: LineItemPath) => void;
  onRequestOpenCreateProductDialog: () => void;
  onUpdateItem: (
    index: number,
    item: ProductItem,
    isCatalogItem?: boolean
  ) => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceItemRowComponent = ({
  field,
  index,
  control,
  errors,
  actualCurrency,
  defaultCurrency = 'USD',
  measureUnitsData,
  isNonVatSupported,
  vatRates,
  highestVatRate,
  catalogEnabled = true,
  tableRowClassName,
  onRequestLineItemValue,
  onLineItemValueChange,
  onLineItemManuallyChanged,
  onRequestOpenCreateProductDialog,
  onUpdateItem,
  onRemoveItem,
  onRequestLineItemValidation,
}: InvoiceItemRowProps) => {
  const lineItemError = errors.line_items?.[index] as
    | FieldErrors<CreateReceivablesFormBeforeValidationLineItemProps>
    | undefined;
  const itemNameError = Boolean(
    lineItemError?.product?.name || lineItemError?.name
  );
  const quantityError = Boolean(lineItemError?.quantity);
  const priceError = Boolean(
    lineItemError?.product?.price?.value ||
    lineItemError?.price?.value ||
    lineItemError?.price
  );
  const taxOrVatError = isNonVatSupported
    ? Boolean(lineItemError?.tax_rate_value)
    : Boolean(lineItemError?.vat_rate_id || lineItemError?.vat_rate_value);
  const measureUnitFieldError =
    lineItemError?.product?.measure_unit_id ??
    lineItemError?.measure_unit_id;

  const handleVatRateDefaults = (
    defaultVatId: string | null,
    defaultVatValue?: number | null,
    defaultTaxRate?: number | null
  ) => {
    if (onRequestLineItemValue('vat_rate_id') !== defaultVatId) {
      onLineItemValueChange('vat_rate_id', defaultVatId, {
        shouldValidate: false,
      });
    }
    if (onRequestLineItemValue('vat_rate_value') !== defaultVatValue) {
      onLineItemValueChange('vat_rate_value', defaultVatValue, {
        shouldValidate: false,
      });
    }
    if (
      isNonVatSupported &&
      onRequestLineItemValue('tax_rate_value') !== defaultTaxRate
    ) {
      onLineItemValueChange('tax_rate_value', defaultTaxRate, {
        shouldValidate: false,
      });
    } else if (
      !isNonVatSupported &&
      defaultTaxRate === null &&
      onRequestLineItemValue('tax_rate_value') !== undefined
    ) {
      onLineItemValueChange('tax_rate_value', undefined, {
        shouldValidate: false,
      });
    }
  };

  const handleTaxRateBlur = () => {
    onRequestLineItemValidation?.('tax_rate_value');
  };

  return (
    <TableRow key={field.id} className={tableRowClassName}>
      <TableCell
        sx={{
          width: { xs: '30%', xl: '40%' },
          paddingLeft: 0,
          paddingRight: 2,
        }}
      >
        <ItemSelector
          onCreateItem={onRequestOpenCreateProductDialog}
          onChange={(item, isCatalogItem) =>
            onUpdateItem(index, item, isCatalogItem)
          }
          fieldName={
            (onRequestLineItemValue('product.name') as string | undefined) || ''
          }
          index={index}
          error={itemNameError}
          actualCurrency={actualCurrency}
          defaultCurrency={defaultCurrency}
          measureUnits={measureUnitsData}
          catalogEnabled={catalogEnabled}
        />
      </TableCell>

      <TableCell
        sx={{
          width: { xs: '30%', xl: '20%' },
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <QuantityField
          index={index}
          control={control}
          quantityError={quantityError}
          measureUnitsData={measureUnitsData}
          measureUnitFieldError={measureUnitFieldError}
          onRequestLineItemValue={onRequestLineItemValue}
          onLineItemValueChange={onLineItemValueChange}
          onLineItemManuallyChanged={onLineItemManuallyChanged}
        />
      </TableCell>

      <TableCell
        sx={{ width: '20%', paddingLeft: 2, paddingRight: 2 }}
        align="right"
      >
        <PriceField
          error={priceError}
          currency={actualCurrency ?? defaultCurrency}
          value={
            onRequestLineItemValue('product.price.value') as number | undefined
          }
          onChange={(newPrice) => {
            onLineItemValueChange('product.price.value', newPrice, {
              shouldValidate: true,
            });
            onLineItemManuallyChanged();
          }}
        />
      </TableCell>

      <TableCell sx={{ width: 'fit-content', paddingLeft: 2, paddingRight: 2 }}>
        {isNonVatSupported ? (
          <TaxRateField
            value={
              onRequestLineItemValue('tax_rate_value') as number | undefined
            }
            onChange={(newRate) => {
              onLineItemValueChange('tax_rate_value', newRate, {
                shouldValidate: true,
              });
              onLineItemManuallyChanged();
            }}
            error={Boolean(errors.line_items?.[index]?.tax_rate_value)}
            onModified={onLineItemManuallyChanged}
            onBlur={handleTaxRateBlur}
          />
        ) : (
          <FormControl
            variant="outlined"
            fullWidth
            required
            error={taxOrVatError}
          >
            <VatRateField
              value={
                onRequestLineItemValue('vat_rate_id') as string | undefined
              }
              onChange={(newId, newValue) => {
                onLineItemValueChange('vat_rate_id', newId, {
                  shouldValidate: true,
                });
                onLineItemValueChange('vat_rate_value', newValue, {
                  shouldValidate: true,
                });
                onLineItemValueChange('tax_rate_value', undefined, {
                  shouldValidate: false,
                });
                onLineItemManuallyChanged();
              }}
              availableVatRates={vatRates ?? []}
              error={taxOrVatError}
              fieldError={
                lineItemError?.vat_rate_id || lineItemError?.vat_rate_value
              }
              isNonVatSupported={isNonVatSupported}
              highestVatRate={highestVatRate}
              currentTaxRateValue={
                onRequestLineItemValue('tax_rate_value') as number | undefined
              }
              currentVatRateValue={
                onRequestLineItemValue('vat_rate_value') as number | undefined
              }
              onInitializeDefaults={handleVatRateDefaults}
              onModified={onLineItemManuallyChanged}
            />
          </FormControl>
        )}
      </TableCell>

      <TableCell sx={{ padding: 0, width: '48px' }}>
        <IconButton onClick={() => onRemoveItem(index)} sx={{ padding: '4px' }}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export const InvoiceItemRow = memo(InvoiceItemRowComponent);

type CurrencyEnum = components['schemas']['CurrencyEnum'];
type MeasureUnitListResponseType = components['schemas']['UnitListResponse'];
type VatRateItemType = components['schemas']['VatRateResponse'];
