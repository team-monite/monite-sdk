import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Alert, Button } from '@mui/material';

interface VatAndTaxValidatorProps {
  requiredFields: string[];
  availableFields: string[];
  isEntity: boolean;
}

export const VatAndTaxValidator = ({
  requiredFields,
  availableFields,
  isEntity,
}: VatAndTaxValidatorProps) => {
  if (
    // if required fields are present in available fields and with value, no error
    availableFields
      .map((field) => requiredFields.includes(field))
      .includes(true)
  ) {
    return null;
  }

  const getText = () => {
    if (requiredFields.includes('vatId') && requiredFields.includes('taxId')) {
      return t(i18n)`VAT ID and Tax ID`;
    } else if (requiredFields.includes('vatId')) {
      return t(i18n)`VAT ID`;
    } else if (requiredFields.includes('taxId')) {
      return t(i18n)`Tax ID`;
    } //how to target "or" case?
    else {
      return t(i18n)`VAT ID or Tax ID`;
    }
  };

  return (
    <Alert severity="error">
      {isEntity
        ? t(i18n)`Set a ${getText()} for this customer to issue an invoice`
        : t(i18n)`Set a ${getText()} for this customer to issue an invoice`}
      <Button
        variant="text"
        sx={{
          color: ' rgba(204, 57, 75, 1)',
          textDecoration: 'underline',
          padding: '8px 0 0',
        }}
      >
        {t(i18n)`Edit ${isEntity ? "my entity's" : 'customer’s'} profile`}
      </Button>
    </Alert>
  );
};
