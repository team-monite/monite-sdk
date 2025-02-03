import { useEffect, useState } from 'react';

import { components } from '@/api';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Alert, Button, Typography } from '@mui/material';

interface VatAndTaxValidatorProps {
  isEntity?: boolean;
  onClick: () => void;
  requiredFields: string[];
  taxId: string | null | undefined;
  vatIds:
    | {
        data: components['schemas']['EntityVatIDResponse'][];
      }
    | { data: components['schemas']['CounterpartVatIDResponse'][] }
    | null
    | undefined;
}

export const VatAndTaxValidator = ({
  isEntity,
  onClick,
  requiredFields,
  vatIds,
  taxId,
}: VatAndTaxValidatorProps) => {
  const vatValues = vatIds ? vatIds.data.map((vat) => vat.value) : [];
  const [isVatMissing, setIsVatMissing] = useState<boolean>(false);
  const [isTaxMissing, setIsTaxMissing] = useState<boolean>(false);

  useEffect(() => {
    const checkVatMissing =
      requiredFields.includes('vatId') &&
      (!vatValues || vatValues.length === 0);
    const checkTaxMissing = requiredFields.includes('taxId') && !taxId;

    setIsVatMissing(checkVatMissing);
    setIsTaxMissing(checkTaxMissing);
  }, [requiredFields, vatValues, taxId]);

  if (!isVatMissing && !isTaxMissing) {
    return null;
  }

  const getText = () => {
    if (isVatMissing && isTaxMissing) return t(i18n)`VAT ID and Tax ID`;
    if (isVatMissing) return t(i18n)`VAT ID`;
    if (isTaxMissing) return t(i18n)`Tax ID`;

    return t(i18n)`VAT ID or Tax ID`; //currently will never get to here, need to check what the actual compliance fields will return
  };

  return (
    <Alert severity="error" sx={{ mt: 0, mb: 5 }}>
      <Typography variant="inherit">
        {isEntity
          ? t(i18n)`Set your entity's ${getText()} to issue invoice`
          : t(i18n)`Set a ${getText()} for this customer to issue invoice`}
      </Typography>
      <Button
        variant="text"
        onClick={onClick}
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
