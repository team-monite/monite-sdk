import { components } from '@/api';
import { parseLocaleNumericString } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/utils';
import { Input } from '@/ui/components/input';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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

  const MeasureUnitField = () => {
    if ((measureUnitsData?.data?.length ?? 0) === 0) return null;

    return (
      <select
        className="mtw:border-0 mtw:bg-transparent mtw:text-sm mtw:p-0 mtw:focus:outline-hidden"
        disabled={disabled}
        value={
          (onRequestLineItemValue('product.measure_unit_id') as string) || ''
        }
        onChange={(e) => {
          onLineItemValueChange('product.measure_unit_id', e.target.value, {
            shouldValidate: true,
          });
          onLineItemManuallyChanged();
        }}
      >
        <option value="">{t(i18n)`Unit`}</option>
        {measureUnitsData?.data?.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <Controller
      name={`line_items.${index}.quantity` as Path<TFieldValues>}
      control={control}
      render={({ field: quantityControllerField }) => (
        <div className="mtw:w-full">
          <div className="mtw:flex mtw:items-center mtw:gap-2">
            <Input
              {...quantityControllerField}
              disabled={disabled}
              aria-invalid={hasQuantityError || Boolean(measureUnitFieldError)}
              type="text"
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
              className="mtw:flex-1 mtw:pr-0"
            />
            <MeasureUnitField />
          </div>
          {(hasQuantityError || Boolean(measureUnitFieldError)) && (
            <p className="mtw:text-xs mtw:text-red-600 mtw:mt-1">
              {hasQuantityError
                ? t(i18n)`Quantity must be greater than 0`
                : measureUnitFieldError?.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
