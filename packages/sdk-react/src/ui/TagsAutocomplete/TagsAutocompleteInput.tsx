import { TagsAutocomplete } from './TagsAutocomplete';
import { FormControl, FormHelperText } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type TagsAutocompleteInputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  variant?: 'filled' | 'standard';
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
};

export const TagsAutocompleteInput = ({
  control,
  name,
  label,
  variant = 'filled',
  disabled = false,
  required = false,
  helperText,
}: TagsAutocompleteInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl
          variant={variant}
          fullWidth
          required={required}
          error={Boolean(fieldError)}
        >
          <TagsAutocomplete
            disabled={disabled}
            value={field.value || []}
            onChange={(tags) => {
              // Convert TagReadSchema[] to Option[] for the form
              const options = tags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }));
              field.onChange(options);
            }}
            label={label}
            variant={variant}
            error={Boolean(fieldError)}
            helperText={fieldError?.message || helperText}
            required={required}
          />
          {(fieldError || helperText) && (
            <FormHelperText>{fieldError?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
