'use client';

import { useCallback } from 'react';
import type { FieldErrors, FieldValues } from 'react-hook-form';

const generateErrors = <T extends FieldValues>(
  fields: FieldErrors<T>,
  parentKey: string = ''
): HTMLElement[] =>
  Object.entries(fields)
    .reduce<HTMLElement[]>((acc, [key, field]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const element = document.getElementById(fullKey);

      if (!field || !element) return acc;
      if (field?.message && element) return [...acc, element];

      return generateErrors(field as FieldErrors<T>, fullKey);
    }, [])
    .sort((a, b) => {
      const { top: topA } = a.getBoundingClientRect();
      const { top: topB } = b.getBoundingClientRect();

      if (topA < topB) return -1;
      if (topA > topB) return 1;
      return 0;
    });

/**
 * Scrolls to the first error in a form.
 * @param errors - An object containing information about form validation errors.
 */
export function useScrollToError<T extends FieldValues>(
  errors: FieldErrors<T>
) {
  return useCallback((): boolean => {
    const errorList = generateErrors(errors);

    if (!errorList.length) return true;

    const firstError = errorList[0];

    firstError.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    firstError.focus();

    return false;
  }, [errors]);
}
