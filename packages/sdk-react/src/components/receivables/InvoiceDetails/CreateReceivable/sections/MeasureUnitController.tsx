import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { MenuItem, Select } from '@mui/material';

import { setValueWithValidation } from '../utils';
import { CreateReceivablesFormBeforeValidationProps } from '../validation';

interface MeasureUnitControllerProps {
  control: Control<CreateReceivablesFormBeforeValidationProps>;
  index: number;
  errors: FieldErrors<CreateReceivablesFormBeforeValidationProps>;
  fieldError: FieldError | undefined;
  measureUnits: components['schemas']['UnitResponse'][] | undefined;
  skipDefaultAssignment?: boolean;
  getValues: UseFormGetValues<CreateReceivablesFormBeforeValidationProps>;
  setValue: UseFormSetValue<CreateReceivablesFormBeforeValidationProps>;
}

export const MeasureUnitController = ({
  control,
  index,
  fieldError: externalFieldError,
  measureUnits,
  skipDefaultAssignment = false,
  getValues,
  setValue,
}: MeasureUnitControllerProps) => {
  const { root } = useRootElements();
  const name = `line_items.${index}.product.measure_unit_id` as const;
  const [hasSetDefaultMeasureUnit, setHasSetDefaultMeasureUnit] =
    useState(false);

  const currentMeasureUnitId = getValues(name);
  const firstAvailableMeasureUnit = measureUnits?.[0]?.id;

  useEffect(() => {
    if (skipDefaultAssignment) {
      return;
    }

    if (
      !currentMeasureUnitId &&
      firstAvailableMeasureUnit &&
      !hasSetDefaultMeasureUnit &&
      currentMeasureUnitId !== '' // Don't set default if explicitly initialized with empty string
    ) {
      setValue(name, firstAvailableMeasureUnit, { shouldValidate: true });
      setHasSetDefaultMeasureUnit(true);
      setValue(name, firstAvailableMeasureUnit, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    currentMeasureUnitId,
    firstAvailableMeasureUnit,
    hasSetDefaultMeasureUnit,
    index,
    name,
    setValue,
    skipDefaultAssignment,
  ]);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: measureUnitField,
        fieldState: { error: internalFieldError },
      }) => {
        const measureUnitId = getValues(name);
        const hasError = Boolean(externalFieldError || internalFieldError);

        return (
          <Select
            MenuProps={{ container: root }}
            {...measureUnitField}
            value={measureUnitId || ''}
            onChange={(e) => {
              const selectedUnitId = e.target.value;

              setValueWithValidation(name, selectedUnitId, false, setValue);
              measureUnitField.onChange(e);
            }}
            sx={{
              background: 'transparent',
              minHeight: 'fit-content !important',
              '.MuiSelect-select.MuiSelect-outlined': {
                paddingLeft: 0,
              },
              '&:hover': {
                boxShadow: 'none !important',
                borderColor: 'transparent !important',
                background: 'transparent',
              },
              '&.MuiInputBase-root .MuiInputBase-inputSizeSmall': {
                paddingLeft: 0,
              },
              '&.Mui-focused.MuiInputBase-root': {
                boxShadow: 'none !important',
                background: 'transparent',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                background: 'transparent',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                background: 'transparent',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                background: 'transparent',
              },
            }}
            size="small"
            error={hasError}
            displayEmpty
          >
            {measureUnits?.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name}
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};
