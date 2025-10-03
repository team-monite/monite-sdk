import type { CreatePurchaseOrderFormProps } from '../validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FormErrorDisplay as SharedFormErrorDisplay } from '@/ui/FormErrorDisplay';
import { useMemo, memo } from 'react';
import type { FieldErrors } from 'react-hook-form';

export type ErrorDisplayProps = {
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
    return (
      <SharedFormErrorDisplay
        generalError={generalError}
        fieldErrors={fieldErrors}
      />
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
