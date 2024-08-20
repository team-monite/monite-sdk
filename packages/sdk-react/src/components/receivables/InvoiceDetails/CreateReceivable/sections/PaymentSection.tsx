import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getBankAccountName } from '@/core/utils/getBankAccountName';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

export const PaymentSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { api } = useMoniteContext();

  const { data: bankAccounts, isLoading: isBankAccountsLoading } =
    api.bankAccounts.getBankAccounts.useQuery();
  const { data: paymentTerms, isLoading: isPaymentTermsLoading } =
    api.paymentTerms.getPaymentTerms.useQuery();

  const noPaymentTerms = useMemo(() => {
    if (!paymentTerms) {
      return true;
    }

    return !(
      paymentTerms.data &&
      paymentTerms.data.length > 0 &&
      !isPaymentTermsLoading
    );
  }, [isPaymentTermsLoading, paymentTerms]);

  const className = 'Monite-CreateReceivable-PaymentSection';

  return (
    <Stack spacing={1} className={className}>
      <Typography variant="h3">{t(i18n)`Payment`}</Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                fullWidth
                select
                name="entity_bank_account_id"
                control={control}
                label={t(i18n)`Bank account`}
                disabled={
                  isBankAccountsLoading || bankAccounts?.data.length === 0
                }
              >
                {bankAccounts?.data.map((bankAccount) => (
                  <MenuItem key={bankAccount.id} value={bankAccount.id}>
                    {getBankAccountName(i18n, bankAccount)}
                  </MenuItem>
                ))}
              </RHFTextField>

              {!isBankAccountsLoading && bankAccounts?.data.length === 0 && (
                <FormHelperText>{t(
                  i18n
                )`No bank accounts available`}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <RHFTextField
                fullWidth
                select
                name="payment_terms_id"
                control={control}
                label={t(i18n)`Payment terms`}
                disabled={disabled}
              >
                {paymentTerms?.data?.map(({ id, name, description }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                    {description && ` (${description})`}
                  </MenuItem>
                ))}
              </RHFTextField>

              {noPaymentTerms && (
                <FormHelperText>
                  {t(
                    i18n
                  )`There is no payment terms available. Please create one in the settings.`}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
