import { calculateTotalPriceForLineItem } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import type { PayableDetailsFormFields } from '@/components/payables/PayableDetails/PayableDetailsForm/types';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { RHFTextField } from '@/ui/RHF/RHFTextField/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

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
              <RHFTextField
                control={control}
                name={`lineItems.${index}.name`}
                label={t(i18n)`Name`}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                control={control}
                name={`lineItems.${index}.quantity`}
                label={t(i18n)`Quantity`}
                type="number"
                inputProps={{ min: 1 }}
                fullWidth
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
              <RHFTextField
                control={control}
                name={`lineItems.${index}.price`}
                label={t(i18n)`Price`}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                InputProps={{
                  endAdornment: getSymbolFromCurrency(watch('currency')),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                control={control}
                name={`lineItems.${index}.tax`}
                label={t(i18n)`VAT`}
                type="number"
                inputProps={{ min: 0, max: 100 }}
                fullWidth
                InputProps={{
                  endAdornment: '%',
                }}
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
