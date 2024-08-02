import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import {
  calculateTotalPriceForLineItem,
  PayableDetailsFormFields,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { DeleteIcon } from '@/ui/icons';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';

export const PayableLineItemsForm = () => {
  const { i18n } = useLingui();
  const { getSymbolFromCurrency, formatCurrencyToDisplay, formatToMinorUnits } =
    useCurrencies();
  const { control, watch } = useFormContext<PayableDetailsFormFields>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });
  const currentCurrency = watch('currency');
  const currentLineItems = watch('lineItems');

  return (
    <Grid container direction="column" spacing={4}>
      {fields.map((item, index) => (
        <Grid
          item
          container
          gap={2}
          key={item.id}
          className="Monite-PayableDetailsForm-Item"
        >
          <Grid item xs={12} gap={2} container flexWrap="nowrap">
            <Grid item xs={8}>
              <Controller
                name={`lineItems.${index}.name`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id={field.name}
                    label={t(i18n)`Name`}
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                name={`lineItems.${index}.quantity`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id={field.name}
                    label={t(i18n)`Quantity`}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 1 }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={1}
              container
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="delete"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            gap={2}
            container
            flexWrap="nowrap"
            justifyContent="flex-end"
          >
            <Grid item xs={8}>
              <Controller
                name={`lineItems.${index}.price`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id={field.name}
                    label={t(i18n)`Price`}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0 }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    fullWidth
                    InputProps={{
                      endAdornment: getSymbolFromCurrency(watch('currency')),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                name={`lineItems.${index}.tax`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id={field.name}
                    label={t(i18n)`TAX`}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    fullWidth
                    InputProps={{
                      endAdornment: '%',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1} />
          </Grid>
          {currentLineItems?.[index] && currentCurrency && (
            <Grid
              item
              xs={12}
              gap={2}
              className="Monite-PayableDetailsForm-Item-Total"
            >
              <Typography fontWeight="bold" align="right">
                {formatCurrencyToDisplay(
                  formatToMinorUnits(
                    calculateTotalPriceForLineItem(currentLineItems?.[index]),
                    currentCurrency
                  ) || 0,
                  currentCurrency
                )}
              </Typography>
            </Grid>
          )}
        </Grid>
      ))}
      <Grid item xs={12} gap={2}>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            append({ id: '', name: '', quantity: 1, price: 0, tax: 19 })
          }
        >
          {t(i18n)`Add item`}
        </Button>
      </Grid>
    </Grid>
  );
};
