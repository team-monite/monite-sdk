import {
  Controller,
  FieldError,
  ControllerRenderProps,
  Path,
} from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  SelectProps as MUISelectProps,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface CustomSelectProps<T extends FieldValues> {
  label: string;
  options: Array<{ id: string | number; name: string }>;
  createFnOption?: () => void;
  noOptionsText: string;
  handleSelectChange: (
    field: ControllerRenderProps<T, Path<T>>
  ) => (event: SelectChangeEvent<string | number>) => void;
}

type RHFSelectFieldProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<MUISelectProps, 'name' | 'defaultValue'> &
  CustomSelectProps<T>;

export const RHFSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  noOptionsText,
  createFnOption,
  handleSelectChange,
  ...other
}: RHFSelectFieldProps<T>) => {
  const isErrorCustom = (error: FieldError | undefined) =>
    error?.type === 'custom';

  const { root } = useRootElements();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field,
        fieldState: { error, isTouched },
        formState: { isValid },
      }) => {
        const isInvalid = (isTouched || !isValid) && !isErrorCustom(error);

        return (
          <>
            <FormControl
              variant="outlined"
              fullWidth
              error={isInvalid && !!error?.message}
            >
              <InputLabel htmlFor={name}>{label}</InputLabel>
              <Select
                {...field}
                {...other}
                id={name}
                value={field.value ?? ''}
                label={label}
                MenuProps={{ container: root }}
                onChange={handleSelectChange(field)}
              >
                {options.length > 0 ? (
                  options.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    {noOptionsText}
                  </MenuItem>
                )}
                <MenuItem
                  value="create"
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    color: 'primary.main',
                  }}
                >
                  <AddIcon sx={{ marginRight: 1 }} />
                  Create a reminder preset
                </MenuItem>
              </Select>
              {isInvalid && <FormHelperText>{error?.message}</FormHelperText>}
            </FormControl>

            {isErrorCustom(error) && (
              <Alert
                severity="error"
                icon={false}
                sx={{
                  marginTop: -2,
                }}
              >
                {error?.message}
              </Alert>
            )}
          </>
        );
      }}
    />
  );
};
