import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getBankAccountName } from '@/core/utils/getBankAccountName';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

export const PaymentSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();
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
      <Typography variant="subtitle2">{t(i18n)`Payment`}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="entity_bank_account_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={Boolean(error)}
                    disabled={disabled}
                  >
                    <InputLabel htmlFor={field.name}>{t(
                      i18n
                    )`Bank account`}</InputLabel>
                    <Select
                      {...field}
                      id={field.name}
                      labelId={field.name}
                      label={t(i18n)`Bank account`}
                      MenuProps={{ container: root }}
                      disabled={
                        isBankAccountsLoading || bankAccounts?.data.length === 0
                      }
                    >
                      {bankAccounts?.data.map((bankAccount) => (
                        <MenuItem key={bankAccount.id} value={bankAccount.id}>
                          {getBankAccountName(i18n, bankAccount)}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                    {!isBankAccountsLoading &&
                      bankAccounts?.data.length === 0 && (
                        <FormHelperText>{t(
                          i18n
                        )`No bank accounts available`}</FormHelperText>
                      )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="payment_terms_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                    error={Boolean(error) || noPaymentTerms}
                    disabled={disabled}
                  >
                    <InputLabel id={field.name}>{t(
                      i18n
                    )`Payment term`}</InputLabel>
                    <Select
                      labelId={field.name}
                      MenuProps={{ container: root }}
                      label={t(i18n)`Payment term`}
                      disabled={noPaymentTerms}
                      {...field}
                    >
                      {paymentTerms?.data?.map((paymentTerm) => (
                        <MenuItem key={paymentTerm.id} value={paymentTerm.id}>
                          {paymentTerm.name}
                          {paymentTerm.description &&
                            ` (${paymentTerm.description})`}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                    {noPaymentTerms && (
                      <FormHelperText>
                        {t(
                          i18n
                        )`There is no payment terms available. Please create one in the settings.`}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
