import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { ICreateReceivablesForm } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityVatIdList, useMyEntity } from '@/core/queries/useEntities';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
  FormHelperText,
  TextField,
  Collapse,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import type { ISectionGeneralProps } from './Section.types';

const detailsGridItemProps = {
  xs: 12,
  sm: 6,
  md: 3,
  lg: 3,
};

export const EntitySection = ({ disabled }: ISectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control, watch, resetField, setValue } =
    useFormContext<ICreateReceivablesForm>();

  const { root } = useRootElements();

  const { data: entityVatIds, isInitialLoading: isEntityVatIdsLoading } =
    useEntityVatIdList();
  const { data: entity, isInitialLoading: isEntityLoading } = useMyEntity();

  /** Describes if `Same as invoice date` checkbox is checked */
  const [isSameAsInvoiceDateChecked, setIsSameAsInvoiceDateChecked] =
    useState<boolean>(false);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t(i18n)`Details`}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item {...detailsGridItemProps}>
              <Controller
                name="entity_vat_id_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                    disabled={isEntityVatIdsLoading || disabled}
                    error={Boolean(error)}
                  >
                    <InputLabel id={field.name}>{t(
                      i18n
                    )`Your VAT ID`}</InputLabel>
                    <Select
                      labelId={field.name}
                      label={t(i18n)`Your VAT ID`}
                      MenuProps={{ container: root }}
                      startAdornment={
                        isEntityVatIdsLoading ? (
                          <CircularProgress size={20} />
                        ) : entity?.address.country ? (
                          <CountryInvoiceOption code={entity.address.country} />
                        ) : null
                      }
                      {...field}
                    >
                      {entityVatIds?.data.map((vatId) => (
                        <MenuItem key={vatId.id} value={vatId.id}>
                          {vatId.value}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item {...detailsGridItemProps}>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                label={t(i18n)`Your TAX ID`}
                value={entity?.tax_id ?? ''}
                InputProps={{
                  startAdornment: isEntityLoading ? (
                    <CircularProgress size={20} />
                  ) : entity?.address.country ? (
                    <CountryInvoiceOption code={entity.address.country} />
                  ) : null,
                }}
              />
              <Collapse in={Boolean(!entity?.tax_id) && !isEntityLoading}>
                <FormHelperText>{t(i18n)`No TAX ID available`}</FormHelperText>
              </Collapse>
            </Grid>
            <Grid item {...detailsGridItemProps}>
              <Controller
                name="fulfillment_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      minDate={new Date()}
                      disabled={disabled}
                      onChange={(date) => {
                        const today = new Date();

                        if (today.toDateString() === date?.toDateString()) {
                          setIsSameAsInvoiceDateChecked(true);
                        } else {
                          setIsSameAsInvoiceDateChecked(false);
                        }

                        field.onChange(date);
                      }}
                      label={t(i18n)`Fulfillment date`}
                      slotProps={{
                        popper: {
                          container: root,
                        },
                        actionBar: {
                          actions: ['today'],
                        },
                        textField: {
                          fullWidth: true,
                          helperText: error?.message,
                        },
                        field: {
                          clearable: true,
                          onClear: () => {
                            resetField(field.name);
                            setIsSameAsInvoiceDateChecked(false);
                          },
                        },
                      }}
                      views={['year', 'month', 'day']}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={isSameAsInvoiceDateChecked}
                          onChange={(event) => {
                            const checked = event.target.checked;

                            if (checked) {
                              setValue(field.name, new Date(), {
                                shouldValidate: true,
                              });
                            } else {
                              resetField(field.name);
                            }

                            setIsSameAsInvoiceDateChecked(checked);
                          }}
                        />
                      }
                      label={t(i18n)`Same as invoice date`}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item {...detailsGridItemProps}>
              <Controller
                name="purchase_order"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={t(i18n)`Purchase order`}
                    error={Boolean(error)}
                    helperText={error?.message}
                    disabled={disabled}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
