import { i18n } from "@lingui/core";
import { t } from '@lingui/macro';
import { Alert, Button } from "@mui/material";

export const MissingVatError = ({vatId, taxId}) => {
    
    return (
    <Alert severity="error">
  {t(i18n)`Set a VAT ID or Tax ID for this customer to issue invoice`}
  <br />
  <Button
    variant="text"
    sx={{
      color: ' rgba(204, 57, 75, 1)',
      textDecoration: 'underline',
      padding: '8px 0 0',
    }}
  >{t(i18n)`Edit customer’s profile`}</Button>
</Alert>;
)}