import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { type FieldError } from 'react-hook-form';

interface MeasureUnitFieldProps {
  value?: string;
  availableMeasureUnits?: components['schemas']['UnitResponse'][];
  error?: boolean;
  fieldError?: FieldError;
  skipDefaultAssignment?: boolean;
  disabled?: boolean;
  onChange: (newMeasureUnitId: string) => void;
}

export const MeasureUnitField = ({
  value,
  availableMeasureUnits,
  error,
  skipDefaultAssignment = false,
  disabled = false,
  onChange,
}: MeasureUnitFieldProps) => {
  const { root } = useRootElements();
  const [hasSetDefault, setHasSetDefault] = useState(skipDefaultAssignment);

  useEffect(() => {
    if (skipDefaultAssignment || hasSetDefault) {
      return;
    }

    const firstAvailableMeasureUnitId = availableMeasureUnits?.[0]?.id;

    if (!value && value !== '' && firstAvailableMeasureUnitId) {
      onChange(firstAvailableMeasureUnitId);
      setHasSetDefault(true);
    }
  }, [
    value,
    availableMeasureUnits,
    onChange,
    skipDefaultAssignment,
    hasSetDefault,
  ]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedUnitId = event.target.value as string;
    onChange(selectedUnitId);
  };

  const displayValue = value ?? '';

  return (
    <Select
      MenuProps={{ container: root }}
      value={displayValue}
      onChange={handleChange}
      error={error}
      disabled={disabled}
      displayEmpty
      size="small"
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
    >
      {availableMeasureUnits?.map((unit) => (
        <MenuItem key={unit.id} value={unit.id}>
          {unit.name}
        </MenuItem>
      ))}
    </Select>
  );
};
