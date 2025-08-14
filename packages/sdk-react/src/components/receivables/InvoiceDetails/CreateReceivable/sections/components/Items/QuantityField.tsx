import { useState } from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';

import { components } from '@/api';
import type { LineItemPath } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/types';
import { CreateReceivablesFormBeforeValidationProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useLingui } from '@lingui/react';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { parseLocaleNumericString } from '../../utils';
import { MeasureUnitField } from './MeasureUnitField';

type MeasureUnitListResponseType = components['schemas']['UnitListResponse'];

interface QuantityFieldProps {
  index: number;
  control: Control<CreateReceivablesFormBeforeValidationProps>;
  quantityError?: boolean;
  measureUnitsData?: MeasureUnitListResponseType;
  measureUnitFieldError?: FieldError;
  onRequestLineItemValue: (fieldPathSuffix: LineItemPath) => unknown;
  onLineItemValueChange: (
    fieldPathSuffix: LineItemPath,
    value: unknown,
    options?: { shouldValidate?: boolean }
  ) => void;
  onLineItemManuallyChanged: () => void;
}

export const QuantityField: React.FC<QuantityFieldProps> = ({
  index,
  control,
  quantityError: hasQuantityError,
  measureUnitsData,
  measureUnitFieldError,
  onRequestLineItemValue,
  onLineItemValueChange,
  onLineItemManuallyChanged,
}) => {
  const { i18n } = useLingui();
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<
    number | null
  >(null);
  const [quantityRawValue, setQuantityRawValue] = useState<string>('');

  return (
    <Controller
      name={`line_items.${index}.quantity`}
      control={control}
      render={({ field: quantityControllerField }) => (
        <FormControl
          variant="standard"
          fullWidth
          required
          error={hasQuantityError || Boolean(measureUnitFieldError)}
        >
          <TextField
            {...quantityControllerField}
            error={hasQuantityError || Boolean(measureUnitFieldError)}
            InputProps={{
              endAdornment: (measureUnitsData?.data?.length ?? 0) > 0 && (
                <InputAdornment position="end">
                  <MeasureUnitField
                    value={
                      onRequestLineItemValue('product.measure_unit_id') as
                        | string
                        | undefined
                    }
                    onChange={(newId: string) => {
                      onLineItemValueChange('product.measure_unit_id', newId, {
                        shouldValidate: true,
                      });
                      onLineItemManuallyChanged();
                    }}
                    availableMeasureUnits={measureUnitsData?.data || []}
                    fieldError={measureUnitFieldError}
                    skipDefaultAssignment={
                      Boolean(onRequestLineItemValue('product.name')) ||
                      Boolean(
                        onRequestLineItemValue('product.measure_unit_name') ||
                          onRequestLineItemValue('measure_unit.name')
                      )
                    }
                  />
                </InputAdornment>
              ),
            }}
            type="text"
            size="small"
            value={
              index === editingQuantityIndex
                ? quantityRawValue
                : quantityControllerField.value?.toString() || ''
            }
            onFocus={() => {
              setEditingQuantityIndex(index);
              setQuantityRawValue(
                quantityControllerField.value?.toString() || ''
              );
            }}
            onBlur={() => {
              const numericValue = parseLocaleNumericString(
                quantityRawValue,
                i18n.locale
              );
              onLineItemValueChange('quantity', numericValue, {
                shouldValidate: true,
              });
              setEditingQuantityIndex(null);
              quantityControllerField.onBlur();
            }}
            onChange={(e) => {
              const rawValue = e.target.value;
              setQuantityRawValue(rawValue);
              onLineItemManuallyChanged();
              const numericValue = parseLocaleNumericString(
                rawValue,
                i18n.locale
              );
              onLineItemValueChange('quantity', numericValue, {
                shouldValidate: false,
              });
            }}
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: '0 !important',
                '.MuiInputBase-input': { paddingRight: 0 },
              },
            }}
          />
        </FormControl>
      )}
    />
  );
};
