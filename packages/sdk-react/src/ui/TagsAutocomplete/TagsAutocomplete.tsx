import { useTags } from './useTags';
import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Autocomplete, TextField } from '@mui/material';
import { useMemo } from 'react';

type TagsAutocompleteProps = {
  disabled?: boolean;
  value?: components['schemas']['TagReadSchema'][];
  onChange?: (value: components['schemas']['TagReadSchema'][]) => void;
  label?: string;
  variant?: 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  required?: boolean;
};

type Option = { label: string; value: string };

export const tagsToSelect = (
  tags: components['schemas']['TagReadSchema'][] | undefined
): Option[] => {
  if (!tags) return [];

  return tags.map(({ id: value, name: label }) => ({
    value,
    label,
  }));
};

export const TagsAutocomplete = ({
  disabled,
  value,
  onChange,
  label,
  variant = 'filled',
  error = false,
  helperText,
  required = false,
}: TagsAutocompleteProps) => {
  const { root } = useRootElements();
  const { tagsQuery } = useTags();

  const normalizedValue = useMemo(() => {
    if (!value) return [];
    return tagsToSelect(value);
  }, [value]);

  const options = useMemo(() => {
    return tagsToSelect(tagsQuery.data?.data || []);
  }, [tagsQuery.data?.data]);

  const onAutocompleteChange = (selectedOptions: Option[]) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    const selectedTags =
      tagsQuery.data?.data?.filter((tag) => selectedIds.includes(tag.id)) || [];

    onChange?.(selectedTags);
  };

  return (
    <Autocomplete
      disabled={disabled}
      multiple
      filterSelectedOptions
      getOptionLabel={(option: Option) => option.label}
      options={options}
      slotProps={{
        popper: { container: root },
      }}
      isOptionEqualToValue={(option: Option, value: Option) =>
        option.value === value.value
      }
      value={normalizedValue}
      onChange={(_, newValue) => {
        const valueArray = newValue || [];
        onAutocompleteChange(valueArray);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant={variant}
          fullWidth
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
    />
  );
};
