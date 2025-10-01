import { Controller } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { Checkbox } from '@/ui/components/checkbox';
import { Label } from '@/ui/components/label';

interface RHFCheckboxProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label?: string;
  disabled?: boolean;
}

export const RHFCheckbox = <F extends FieldValues>({
  control,
  name,
  label,
  disabled,
  ...other
}: RHFCheckboxProps<F>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, ...field }, fieldState: { error } }) => {
      return (
        <div className="mtw:space-y-2">
          <div className="mtw:flex mtw:items-center mtw:space-x-2">
            <Checkbox
              {...other}
              {...field}
              id={name}
              checked={value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            <Label
              htmlFor={name}
              className="mtw:text-sm mtw:font-medium mtw:leading-none mtw:peer-disabled:cursor-not-allowed mtw:peer-disabled:opacity-70"
            >
              {label}
            </Label>
          </div>
          {error?.message && (
            <div className="mtw:rounded-md mtw:bg-red-50 mtw:p-3 mtw:text-red-800 mtw:text-sm">
              {error.message}
            </div>
          )}
        </div>
      );
    }}
  />
);
