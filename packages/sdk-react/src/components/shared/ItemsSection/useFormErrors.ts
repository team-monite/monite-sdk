import { useMemo, useCallback } from 'react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type ValidationErrorItem = Record<string, unknown> | undefined;
type LineItemPath = string;

/**
 * Extracts error message from a validation error object at a specific path.
 * Handles both direct field errors and nested product field errors.
 */
function getLineItemErrorMessage(
  errorObj: ValidationErrorItem,
  path: LineItemPath
): string | null {
  if (!errorObj || typeof errorObj !== 'object') {
    return null;
  }

  const segments = path.split('.');
  let current: unknown = errorObj;

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return null;
    }
  }

  if (current && typeof current === 'object' && 'message' in current) {
    return (current as { message: string }).message;
  }

  return null;
}

/**
 * Hook to extract and memoize form errors from React Hook Form error objects.
 * Works with line item errors from both receivables and purchase orders.
 *
 * Accepts either a single error object or an array of error objects,
 * and extracts the first error for each field type.
 */
export const useFormErrors = (
  error: ValidationErrorItem | ValidationErrorItem[] | undefined
) => {
  const { i18n } = useLingui();

  const errors = useMemo(() => {
    return Array.isArray(error) ? error : error ? [error] : [];
  }, [error]);

  const getFirstErrorMessage = useCallback(
    (path: LineItemPath) => {
      for (let i = 0; i < errors.length; i++) {
        const errorObj = errors[i];

        if (typeof errorObj === 'object') {
          const errorMsg = getLineItemErrorMessage(errorObj, path);

          if (errorMsg) {
            return errorMsg;
          }
        }
      }

      return null;
    },
    [errors]
  );

  const nameError = useMemo(
    () => getFirstErrorMessage('product.name') ?? getFirstErrorMessage('name'),
    [getFirstErrorMessage]
  );

  const quantityError = useMemo(
    () => getFirstErrorMessage('quantity'),
    [getFirstErrorMessage]
  );

  const priceError = useMemo(
    () =>
      getFirstErrorMessage('price') ??
      getFirstErrorMessage('product.price.value') ??
      getFirstErrorMessage('product.price.currency'),
    [getFirstErrorMessage]
  );

  const taxError = useMemo(
    () =>
      getFirstErrorMessage('vat_rate_id') ??
      getFirstErrorMessage('vat_rate_value') ??
      getFirstErrorMessage('tax_rate_value'),
    [getFirstErrorMessage]
  );

  const measureUnitError = useMemo(
    () =>
      getFirstErrorMessage('product.measure_unit_id') ??
      getFirstErrorMessage('product.measure_unit_name') ??
      getFirstErrorMessage('measure_unit') ??
      getFirstErrorMessage('unit'),
    [getFirstErrorMessage]
  );

  const productTypeError = useMemo(() => {
    return getFirstErrorMessage('product.type');
  }, [getFirstErrorMessage]);

  const generalError = useMemo(() => {
    if (errors.length === 0) {
      return undefined;
    }

    const hasSpecificErrors = Boolean(
      nameError ||
        quantityError ||
        priceError ||
        taxError ||
        measureUnitError ||
        productTypeError
    );

    if (hasSpecificErrors) {
      return undefined;
    }

    const hasActualErrors = errors.some((errorObj) => {
      if (!errorObj || typeof errorObj !== 'object') return false;

      const keys = Object.keys(errorObj);

      return keys.length > 0 && keys.some((key) => errorObj[key] != null);
    });

    return hasActualErrors ? t(i18n)`Please check the form for errors` : undefined;
  }, [
    errors,
    nameError,
    quantityError,
    priceError,
    taxError,
    measureUnitError,
    productTypeError,
    i18n,
  ]);

  return {
    generalError,
    fieldErrors: {
      name: nameError,
      quantity: quantityError,
      price: priceError,
      tax: taxError,
      measureUnit: measureUnitError,
      productType: productTypeError,
    },
    hasErrors: Boolean(
      generalError ||
        nameError ||
        quantityError ||
        priceError ||
        taxError ||
        measureUnitError ||
        productTypeError
    ),
  };
};
