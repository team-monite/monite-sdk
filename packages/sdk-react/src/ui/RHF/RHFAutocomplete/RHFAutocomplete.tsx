import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  Autocomplete,
  AutocompleteValue,
  TextField,
  TextFieldProps,
} from '@mui/material';
import type {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material';
import { Controller, FieldPath } from 'react-hook-form';
import type {
  FieldValues,
  FieldError,
  UseControllerProps,
} from 'react-hook-form';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface RHFAutocompleteBaseProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
}

export interface RenderInputParams {
  error?: FieldError;
  label: string;
  required?: boolean;
}

type RenderInputFunction = ((
  params: AutocompleteRenderInputParams,
  renderParams: RenderInputParams
) => React.ReactNode) &
  ((params: AutocompleteRenderInputParams) => React.ReactNode);

type AutocompleteOnChangeHandler<TOption> = NonNullable<
  AutocompleteProps<
    TOption,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >['onChange']
>;

export type RHFAutocompleteProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption,
> = RHFAutocompleteBaseProps<TFieldValues, TName> &
  Optional<CustomAutocompleteProps<TOption>, 'renderInput'> & {
    readOnly?: boolean;
    renderInput?: RenderInputFunction;
    onChange?: AutocompleteOnChangeHandler<TOption>;
  } & Omit<TextFieldProps, 'onChange'>;

interface CustomAutocompleteProps<TOption>
  extends AutocompleteProps<
    TOption,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  > {
  optionKey?: keyof TOption;
  labelKey?: keyof TOption;
}

type CustomAutocompleteValue<TOption> = AutocompleteValue<
  TOption,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
>;

export const RHFAutocomplete = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption,
>({
  control,
  name,
  label,
  renderInput,
  optionKey,
  labelKey,
  options,
  required,
  slotProps,
  rules,
  shouldUnregister,
  disabled,
  defaultValue,
  readOnly,
  onChange,
  ...other
}: RHFAutocompleteProps<TFieldValues, TName, TOption>) => {
  const getRenderInput = (error?: FieldError) => {
    if (renderInput) {
      return (params: AutocompleteRenderInputParams) =>
        renderInput(params, {
          error,
          label,
          required,
        });
    }

    return (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        variant="standard"
        required={required}
        label={label}
        error={!!error?.message}
        helperText={error?.message}
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password',
        }}
      />
    );
  };

  const getChangedValue = (
    value: CustomAutocompleteValue<TOption>
  ): CustomAutocompleteValue<TOption> => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value;
    if (optionKey) return String(value[optionKey]);
    return value;
  };

  /**
   * getValue is used to get value from options
   * !!! Note !!! now we support only single value, but we should support multiple values
   */
  const getValue = (
    value: CustomAutocompleteValue<TOption>
  ): TOption | TOption[] | null => {
    if (!value) return null;

    if (optionKey)
      return (
        options.find((option) => String(option[optionKey]) === String(value)) ??
        null
      );

    return options.find((option) => String(option) === String(value)) ?? null;
  };

  const getOptionLabel = (option: TOption | string): string => {
    if (typeof option === 'string') return option;
    if (!labelKey) return '';
    return `${option[labelKey]}`;
  };

  const { root } = useRootElements();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({
        field,
        fieldState: { error, isTouched },
        formState: { isValid },
      }) => (
        <Autocomplete
          {...field}
          {...other}
          slotProps={{
            ...slotProps,
            popper: {
              ...slotProps?.popper,
              container: root,
            },
          }}
          options={options}
          blurOnSelect
          onChange={(event, value, reason, details) => {
            field.onChange(getChangedValue(value));
            onChange?.(event, value, reason, details);
          }}
          value={getValue(field.value)}
          id={name}
          getOptionLabel={getOptionLabel}
          renderInput={getRenderInput(
            isTouched || !isValid ? error : undefined
          )}
          readOnly={readOnly}
        />
      )}
    />
  );
};
