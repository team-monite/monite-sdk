import type { CreatePurchaseOrderFormProps } from '../validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, Collapse, List, ListItem, ListItemText } from '@mui/material';
import { useMemo, memo } from 'react';
import type { FieldErrors } from 'react-hook-form';

type ErrorDisplayProps = {
  generalError?: string | null;
  fieldErrors: {
    name?: string | null;
    quantity?: string | null;
    price?: string | null;
    vat_rate_id?: string | null;
    vat_rate_value?: string | null;
    tax_rate_value?: string | null;
    unit?: string | null;
    [key: string]: string | null | undefined;
  };
};

export const FormErrorDisplay = memo(
  ({ generalError, fieldErrors }: ErrorDisplayProps) => {
    const hasFieldErrors = useMemo(
      () => Object.values(fieldErrors).some((error) => error),
      [fieldErrors]
    );

    const hasErrors = useMemo(
      () => Boolean(generalError) || hasFieldErrors,
      [generalError, hasFieldErrors]
    );

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
  }
);

export const useFormErrors = (
  errors: FieldErrors<CreatePurchaseOrderFormProps>,
  index: number
) => {
  const { i18n } = useLingui();

  const lineItemErrors = useMemo(
    () => errors.line_items?.[index],
    [errors.line_items, index]
  );

  const fieldErrors = useMemo(
    () => ({
      name: lineItemErrors?.name?.message || null,
      quantity: lineItemErrors?.quantity?.message || null,
      price: lineItemErrors?.price?.message || null,
      vat_rate_id: lineItemErrors?.vat_rate_id?.message || null,
      vat_rate_value: lineItemErrors?.vat_rate_value?.message || null,
      tax_rate_value: lineItemErrors?.tax_rate_value?.message || null,
      unit: lineItemErrors?.unit?.message || null,
    }),
    [lineItemErrors]
  );

  const hasSpecificErrors = useMemo(
    () => Object.values(fieldErrors).some(Boolean),
    [fieldErrors]
  );

  const generalError = useMemo(
    () =>
      lineItemErrors &&
      !hasSpecificErrors &&
      Object.keys(lineItemErrors).length > 0
        ? t(i18n)`Please check the form for errors`
        : undefined,
    [lineItemErrors, hasSpecificErrors, i18n]
  );

  const hasErrors = useMemo(
    () => Boolean(generalError || hasSpecificErrors),
    [generalError, hasSpecificErrors]
  );

  return {
    generalError,
    fieldErrors,
    hasErrors,
  };
};
