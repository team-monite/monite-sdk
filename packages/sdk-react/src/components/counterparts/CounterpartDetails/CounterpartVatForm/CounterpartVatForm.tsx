'use client';

import React, { useId } from 'react';

import {
  CountryOption,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { getCountriesArray } from '@/core/utils/countries';
import { useVatTypes } from '@/core/utils/useVatTypes';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Typography,
  Stack,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { getCounterpartName } from '../../helpers';
import {
  CounterpartVatFormProps,
  useCounterpartVatForm,
} from './useCounterpartVatForm';

export const CounterpartVatForm = (props: CounterpartVatFormProps) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit, watch },
    counterpart,
    vat,
    saveVat,
    isLoading,
  } = useCounterpartVatForm(props);

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartVat-${useId()}`;

  const vatTypes = useVatTypes();

  if (!counterpart) return null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ padding: 3 }}
      >
        <Typography variant="caption">
          {getCounterpartName(counterpart)}
        </Typography>
        <ArrowForwardIcon fontSize="small" color="disabled" />
        <Typography variant="caption" data-testid="vatId">
          {Boolean(vat) ? watch('value') : t(i18n)`Add VAT ID`}
        </Typography>
      </Stack>
      <Divider />
      <DialogContent>
        <form id={formName} onSubmit={handleSubmit(saveVat)}>
          <Stack spacing={3}>
            <RHFAutocomplete
              name="country"
              disabled={isLoading}
              control={control}
              label={t(i18n)`Country`}
              options={getCountriesArray(i18n)}
              optionKey="code"
              labelKey="label"
              renderOption={(props, option, state) => (
                <CountryOption
                  key={option.code}
                  props={props}
                  option={option}
                  state={state}
                />
              )}
            />

            <RHFAutocomplete
              name="type"
              disabled={isLoading}
              control={control}
              label={t(i18n)`Vat type`}
              options={vatTypes}
              optionKey="code"
              labelKey="label"
            />

            <RHFTextField
              disabled={isLoading}
              label={t(i18n)`Vat value`}
              name="value"
              control={control}
            />
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={props.onCancel}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          form={formName}
          type="submit"
          disabled={isLoading}
        >
          {Boolean(vat) ? t(i18n)`Update Vat Id` : t(i18n)`Create Vat Id`}
        </Button>
      </DialogActions>
    </>
  );
};
