import React, { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { RHFTextField } from '@/components/RHF/RHFTextField';

export interface Props {
  /** Name attribute of the input element. */
  name: string;

  /** The label content. */
  label?: string;
}

/**
 *
 * JSONFormatterInput component
 *
 * This component renders a text area input field for JSON data. It includes a formatter to format the input value as JSON and handles errors.
 *
 */
export const JSONFormatterInput = ({ name, label }: Props) => {
  const { control, setValue, setError, clearErrors } = useFormContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Formats the input value as JSON and handles errors.
   *
   * @function
   * @param {string} value - The input value to be formatted.
   * @returns {void} Nothing.
   */
  const formatJson = useCallback(
    (value: string) => {
      try {
        const formattedJson = JSON.stringify(JSON.parse(value), null, 2);

        setValue(name, formattedJson);
        clearErrors(name);
      } catch (error: unknown) {
        setError(name, {
          type: 'manual',
          message: (error as Error)?.message,
        });
      }
    },
    [clearErrors, name, setError, setValue]
  );

  /**
   * Handles the onBlur event for the input field.
   *
   * @function
   * @param {React.FocusEvent<HTMLTextAreaElement>} e - The onBlur event.
   * @returns {void} Nothing.
   */
  const handleJsonBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      formatJson(value);
    },
    [formatJson]
  );

  return (
    <RHFTextField
      label={label}
      name={name}
      control={control}
      fullWidth
      required
      multiline
      rows={10}
      inputRef={inputRef}
      inputProps={{
        sx: {
          fontFamily: 'monospace',
          fontSize: 12,
        },
      }}
      onBlur={handleJsonBlur}
    />
  );
};
