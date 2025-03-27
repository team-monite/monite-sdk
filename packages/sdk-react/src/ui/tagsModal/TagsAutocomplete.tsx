import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Autocomplete, TextField } from '@mui/material';

import { useTags } from './useTags';

export type TagsAutocompleteProps = {
  disabled?: boolean;
  value?: components['schemas']['TagReadSchema'][];
  onChange?: (value: components['schemas']['TagReadSchema'][]) => void;
};

export type Option = { label: string; value: string };

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
}: TagsAutocompleteProps) => {
  const { tagsQuery } = useTags();
  const { root } = useRootElements();

  const onAutocompleteChange = (value: Option[]) => {
    const selectedIds = value.map((option) => option.value);
    const selectedTags =
      tagsQuery.data?.data.filter((tag) => selectedIds.includes(tag.id)) || [];

    onChange?.(selectedTags);
  };

  return (
    <Autocomplete
      disabled={disabled}
      multiple
      filterSelectedOptions
      getOptionLabel={(option) => option.label}
      options={tagsToSelect(tagsQuery.data?.data)}
      slotProps={{
        popper: { container: root },
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      defaultValue={tagsToSelect(value)}
      onChange={(_, value) => onAutocompleteChange(value)}
      renderInput={(params) => (
        <TextField {...params} fullWidth variant="filled" />
      )}
    />
  );
};
