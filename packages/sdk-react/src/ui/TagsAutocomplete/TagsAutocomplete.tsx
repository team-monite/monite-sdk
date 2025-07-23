import { useTags } from './useTags';
import { components } from '@/api';
import { TagFormModal } from '@/components/tags/TagFormModal';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, TextField, Button } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useMemo, useState } from 'react';

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

const TAG_CREATE_NEW_ID = '__create-new__';

function isCreateNewTagOption(tagOption: Option | undefined | null): boolean {
  return tagOption?.value === TAG_CREATE_NEW_ID;
}

const filter = createFilterOptions<Option>();

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
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { tagsQuery } = useTags();
  const [isCreateTagOpened, setIsCreateTagOpened] = useState<boolean>(false);

  const normalizedValue = useMemo(() => {
    if (!value) return [];
    return tagsToSelect(value);
  }, [value]);

  const options = useMemo(() => {
    const availableTags = tagsQuery.data?.data || [];
    const selectedTags = value || [];

    // Combine available tags with selected tags to ensure selected values are always in options
    const allTags = [...availableTags];
    selectedTags.forEach((selectedTag) => {
      if (!allTags.find((tag) => tag.id === selectedTag.id)) {
        allTags.push(selectedTag);
      }
    });

    return tagsToSelect(allTags);
  }, [tagsQuery.data?.data, value]);

  const onAutocompleteChange = (selectedOptions: Option[]) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    const selectedTags =
      tagsQuery.data?.data?.filter((tag) => selectedIds.includes(tag.id)) || [];

    onChange?.(selectedTags);
  };

  const handleCreateNewTag = () => {
    setIsCreateTagOpened(true);
  };

  const handleTagCreated = (newTag: components['schemas']['TagReadSchema']) => {
    // Add the newly created tag to the current selection
    const currentTags = value || [];
    const updatedTags = [...currentTags, newTag];
    onChange?.(updatedTags);
  };

  return (
    <>
      <TagFormModal
        open={isCreateTagOpened}
        onClose={() => setIsCreateTagOpened(false)}
        onCreate={handleTagCreated}
        isDeleteAllowed={false}
      />

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
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          filtered.unshift({
            value: TAG_CREATE_NEW_ID,
            label: t(i18n)`Create new tag`,
          });

          return filtered;
        }}
        renderOption={(props, option) => {
          return isCreateNewTagOption(option) ? (
            <Button
              key={option.value}
              variant="text"
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                px: 2,
              }}
              onClick={handleCreateNewTag}
            >
              {option.label}
            </Button>
          ) : (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          );
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
    </>
  );
};
