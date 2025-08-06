import { useMemo, useCallback } from 'react';

import { getLineItemErrorMessage } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Collapse, List, ListItem, ListItemText } from '@mui/material';

import type { ValidationErrorItem, LineItemPath } from '../../types';

type ErrorDisplayProps = {
  generalError?: string | null;
  fieldErrors: {
    name?: string | null;
    quantity?: string | null;
    price?: string | null;
    tax?: string | null;
    measureUnit?: string | null;
    productType?: string | null;
    [key: string]: string | null | undefined;
  };
};

export const FormErrorDisplay = ({
  generalError,
  fieldErrors,
}: ErrorDisplayProps) => {
  const hasFieldErrors = useMemo(() => {
    for (const error of Object.values(fieldErrors)) {
      if (error) return true;
    }
    return false;
  }, [fieldErrors]);

  const hasErrors = Boolean(generalError) || hasFieldErrors;

  if (!hasErrors) return null;

  return (
    <Collapse
      in={true}
      sx={{
        ':not(.MuiCollapse-hidden)': {
          marginBottom: 1,
        },
      }}
    >
      <Alert
        severity="error"
        sx={{
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        }}
      >
        {generalError && <div>{generalError}</div>}

        {hasFieldErrors && (
          <List dense disablePadding sx={{ mt: generalError ? 1 : 0 }}>
            {Object.entries(fieldErrors).map(([key, error]) =>
              error ? (
                <ListItem key={key} disablePadding>
                  <ListItemText
                    primary={error}
                    primaryTypographyProps={{
                      sx: { color: 'inherit' },
                    }}
                  />
                </ListItem>
              ) : null
            )}
          </List>
        )}
      </Alert>
    </Collapse>
  );
};

/**
 * Hook to extract and memoize form errors from React Hook Form error objects.
 */
const GENERAL_ERROR_MESSAGE = 'Please check the form for errors';

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
      getFirstErrorMessage('measure_unit'),
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

    return hasActualErrors ? t(i18n)`${GENERAL_ERROR_MESSAGE}` : undefined;
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
