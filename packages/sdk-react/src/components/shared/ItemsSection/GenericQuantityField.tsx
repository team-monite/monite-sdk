import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TextField, FormControl, InputAdornment } from '@mui/material';
import { useState } from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';

type MeasureUnitListResponseType = components['schemas']['UnitListResponse'];

interface GenericQuantityFieldProps<TFieldValues extends FieldValues> {
  index: number;
  control: Control<TFieldValues>;
  quantityError?: boolean;
  measureUnitsData?: MeasureUnitListResponseType;
  measureUnitFieldError?: FieldError;
  disabled?: boolean;
  onRequestLineItemValue: (fieldPathSuffix: string) => unknown;
  onLineItemValueChange: (
    fieldPathSuffix: string,
    value: unknown,
    options?: { shouldValidate?: boolean }
  ) => void;
  onLineItemManuallyChanged: () => void;
}

export const GenericQuantityField = <TFieldValues extends FieldValues>({
  index,
  control,
  quantityError: hasQuantityError,
  measureUnitsData,
  measureUnitFieldError,
  disabled = false,
  onRequestLineItemValue,
  onLineItemValueChange,
  onLineItemManuallyChanged,
}: GenericQuantityFieldProps<TFieldValues>) => {
  const { i18n } = useLingui();
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<
    number | null
  >(null);
  const [quantityRawValue, setQuantityRawValue] = useState<string>('');

  const parseLocaleNumericString = (value: string, _locale: string): number => {
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);

    return isNaN(num) ? 0 : num;
  };

  const MeasureUnitField = () => {
    if ((measureUnitsData?.data?.length ?? 0) === 0) return null;

    return (
      <InputAdornment position="end">
        <select
          value={
            (onRequestLineItemValue('product.measure_unit_id') as string) || ''
          }
          onChange={(e) => {
            onLineItemValueChange('product.measure_unit_id', e.target.value, {
              shouldValidate: true,
            });
            onLineItemManuallyChanged();
          }}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            padding: '2px',
          }}
        >
          <option value="">{t(i18n)`Unit`}</option>
          {measureUnitsData?.data?.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </InputAdornment>
    );
  };

  return (
    <Controller
      name={`line_items.${index}.quantity` as Path<TFieldValues>}
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
            disabled={disabled}
            error={hasQuantityError || Boolean(measureUnitFieldError)}
            InputProps={{
              endAdornment: <MeasureUnitField />,
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
