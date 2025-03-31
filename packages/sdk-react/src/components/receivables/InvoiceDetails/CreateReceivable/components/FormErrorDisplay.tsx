import { useMemo } from 'react';

import { Alert, Collapse, List, ListItem, ListItemText } from '@mui/material';

import { getLineItemErrorMessage } from '../utils';

type ErrorDisplayProps = {
  generalError?: string;
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

export const useFormErrors = (error: any) => {
  const nameError = useMemo(
    () => getLineItemErrorMessage(error, 'product.name'),
    [error]
  );

  const quantityError = useMemo(
    () => getLineItemErrorMessage(error, 'quantity'),
    [error]
  );

  const priceError = useMemo(() => {
    return (
      getLineItemErrorMessage(error, 'product.price.value') ||
      getLineItemErrorMessage(error, 'product.price.currency')
    );
  }, [error]);

  const taxError = useMemo(() => {
    return (
      getLineItemErrorMessage(error, 'vat_rate_id') ||
      getLineItemErrorMessage(error, 'vat_rate_value') ||
      getLineItemErrorMessage(error, 'tax_rate_value')
    );
  }, [error]);

  const measureUnitError = useMemo(() => {
    return (
      getLineItemErrorMessage(error, 'product.measure_unit_id') ||
      getLineItemErrorMessage(error, 'product.measure_unit_name') ||
      getLineItemErrorMessage(error, 'measure_unit.name')
    );
  }, [error]);

  const productTypeError = useMemo(() => {
    return getLineItemErrorMessage(error, 'product.type');
  }, [error]);

  const generalError = useMemo(() => {
    if (!error) {
      return undefined;
    }

    return error.message;
  }, [error]);

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
