import { UseFormSetValue } from 'react-hook-form';

import { CreateReceivablesFormBeforeValidationProps } from '../validation';

/**
 * Sets a value in the form with optional validation
 *
 * @param name Field name
 * @param value Field value
 * @param shouldValidate Whether to validate after setting
 * @param shouldDirty Whether to mark field as dirty
 */
export const setValueWithValidation = (
  name: string,
  value: any,
  shouldValidate: boolean = true,
  setValue: UseFormSetValue<CreateReceivablesFormBeforeValidationProps>
) => {
  console.log(`[Form] Setting value for ${name}:`, value);

  // Need to use any due to React Hook Form's typing limitations
  setValue(name as any, value, {
    shouldValidate,
    shouldDirty: true,
  });
};
