import { useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { NO_ROUTING_NUMBER, NO_SORT_CODE } from '../consts';
import type { EntityBankAccountFields } from '../types';

type Props = {
  currency: components['schemas']['CurrencyEnum'];
  control?: Control<EntityBankAccountFields>;
  disabled?: boolean;
  setValue: UseFormSetValue<EntityBankAccountFields>;
  defaultTypeOfCode: CodeType;
};

type CodeType = 'routing_number' | 'sort_code';

export const BankAccountCustomFields = ({
  currency,
  control,
  disabled,
  setValue,
  defaultTypeOfCode,
}: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const [typeOfCode, setTypeOfCode] = useState<CodeType>(defaultTypeOfCode);

  // TODO: This is a workaround to the validation issue we have right now
  // The issue is that when currency is not EUR, USD and GBP, sort_code and routing_number are required,
  // however, once one has a value, the other should be optional
  // It sounds easy but it gets very tricky with the validation schema
  // One way to approach is inside when, but the issue is that both values are not present at the same time
  // So the validation schema breaks and throws a "cyclic" error that happens when you try to read a field that doesn't exist.
  // I will do some research and once I find something good, I will update it
  useEffect(() => {
    const isConventionalCurrency =
      currency === 'USD' || currency === 'EUR' || currency === 'GBP';

    if (typeOfCode === 'routing_number') {
      if (isConventionalCurrency) {
        setValue('sort_code', '');
      } else {
        setValue('sort_code', NO_SORT_CODE);
      }
    } else {
      if (isConventionalCurrency) {
        setValue('routing_number', '');
      } else {
        setValue('routing_number', NO_ROUTING_NUMBER);
      }
    }
  }, [typeOfCode, setValue, currency]);

  function renderCustomFields() {
    switch (currency) {
      case 'USD':
        return (
          <>
            <Controller
              name="account_number"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account number`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={t(
                    i18n
                  )`Your bank account must be a checking account.`}
                  {...field}
                />
              )}
            />

            <Controller
              name="routing_number"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Routing number`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="account_holder_name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account holder name`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={t(
                    i18n
                  )`Must match the name on your bank account exactly.`}
                  {...field}
                />
              )}
            />
          </>
        );
      case 'GBP':
        return (
          <>
            <Controller
              name="account_number"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account number`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={t(
                    i18n
                  )`Your bank account must be a checking account.`}
                  {...field}
                />
              )}
            />

            <Controller
              name="sort_code"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Sort code`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="account_holder_name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account holder name`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={t(
                    i18n
                  )`Must match the name on your bank account exactly.`}
                  {...field}
                />
              )}
            />
          </>
        );
      case 'EUR':
        return (
          <>
            <Controller
              name="iban"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`IBAN`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="bic"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`SWIFT / BIC`}
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
          </>
        );
      default:
        return (
          <>
            <Controller
              name="account_number"
              control={control}
              disabled={disabled}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account number`}
                  variant="standard"
                  fullWidth
                  required
                  error={Boolean(error)}
                  helperText={t(
                    i18n
                  )`Your bank account must be a checking account.`}
                  {...field}
                />
              )}
            />

            <Box display="flex" gap={2}>
              <FormControl
                variant="standard"
                fullWidth
                required
                disabled={disabled}
              >
                <InputLabel id="type_of_code">{t(
                  i18n
                )`Type of code`}</InputLabel>
                <Select
                  labelId="type_of_code"
                  fullWidth
                  label={t(i18n)`Type of code`}
                  MenuProps={{ container: root }}
                  onChange={(e) => {
                    if (e.target.value === 'routing_number') {
                      setValue('routing_number', '');
                    } else {
                      setValue('sort_code', '');
                    }
                    setTypeOfCode(e.target.value as CodeType);
                  }}
                  value={typeOfCode}
                >
                  <MenuItem value="routing_number">
                    {t(i18n)`Routing number`}
                  </MenuItem>
                  <MenuItem value="sort_code">{t(i18n)`Sort code`}</MenuItem>
                </Select>
              </FormControl>

              {typeOfCode === 'routing_number' ? (
                <Controller
                  name="routing_number"
                  control={control}
                  disabled={disabled}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Routing number`}
                      variant="standard"
                      fullWidth
                      required
                      error={Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="sort_code"
                  control={control}
                  disabled={disabled}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id={field.name}
                      label={t(i18n)`Sort code`}
                      variant="standard"
                      fullWidth
                      required
                      error={Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              )}
            </Box>
          </>
        );
    }
  }

  return renderCustomFields();
};
