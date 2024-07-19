import React, { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCountries, getCurrencies } from '@/core/utils';
import { I18n } from '@lingui/core';
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

const getBankAccountName = (
  i18n: I18n,
  bankAccount: components['schemas']['EntityBankAccountResponse']
) => {
  if (bankAccount.display_name) {
    return bankAccount.display_name;
  }

  if (bankAccount.bank_name) {
    return bankAccount.bank_name;
  }

  if (bankAccount.country && bankAccount.currency) {
    return `${getCountries(i18n)[bankAccount.country]} (${
      getCurrencies(i18n)[bankAccount.currency]
    })`;
  }

  return bankAccount.id;
};

export const ReminderSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const { data: bankAccounts, isLoading: isBankAccountsLoading } =
    api.bankAccounts.getBankAccounts.useQuery({});
  const { data: reminderTerms, isLoading: isPaymentTermsLoading } =
    api.reminderTerms.getPaymentTerms.useQuery({});

  const noPaymentTerms = useMemo(() => {
    if (!reminderTerms) {
      return true;
    }

    return !(
      reminderTerms.data &&
      reminderTerms.data.length > 0 &&
      !isPaymentTermsLoading
    );
  }, [isPaymentTermsLoading, reminderTerms]);

  return (
    <Stack spacing={1}>
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
                          {`${getBankAccountName(i18n, bankAccount)} ${
                            bankAccount.is_default_for_currency
                              ? t(i18n)`(Default)`
                              : ''
                          }`}
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
                name="reminder_terms_id"
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
                      label={t(i18n)`Reminder term`}
                      disabled={noPaymentTerms}
                      {...field}
                    >
                      {reminderTerms?.data?.map((reminderTerm) => (
                        <MenuItem key={reminderTerm.id} value={reminderTerm.id}>
                          {reminderTerm.name}
                          {reminderTerm.description &&
                            ` (${reminderTerm.description})`}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                    {noPaymentTerms && (
                      <FormHelperText>
                        {t(
                          i18n
                        )`There is no reminder terms available. Please create one in the settings.`}
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
