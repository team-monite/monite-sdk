import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { Dialog } from '@/components';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { ProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/ProductsTable';
import { useCreateInvoiceProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/useCreateInvoiceProductsTable';
import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  Alert,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  Grid,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  TypographyTypeMap,
  Stack,
  TableContainer,
  Box,
  Collapse,
} from '@mui/material';

interface CardTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  variant?: TypographyTypeMap['props']['variant'];
  sx?: TypographyTypeMap['props']['sx'];
}

/**
 * Prepares line item for the form
 *
 * @param product Product which we want to add to the form
 * @param vatRates List of available VAT rates
 */
function prepareLineItem(
  product: ProductServiceResponse,
  vatRates: VatRateListResponse | undefined
): CreateReceivablesFormBeforeValidationLineItemProps {
  return {
    product_id: product.id,
    /**
     * The quantity can't be less than `smallest_amount`
     *  so we have to set `quantity` accordingly
     */
    quantity: product.smallest_amount ?? 1,
    price: product.price,
    name: product.name,
    measure_unit_id: product.measure_unit_id,
    vat_rate_id: vatRates?.data[0].id,
    vat_rate_value: vatRates?.data[0].value,
    smallest_amount: product.smallest_amount,
  };
}

const CardTableItem = ({
  label,
  value,
  variant = 'body1',
  sx,
}: CardTableItemProps) => (
  <Grid container direction="row" alignItems="center" sx={{ px: 4, py: 2 }}>
    <Grid item xs={4}>
      {typeof label === 'string' ? (
        <Typography variant="body1">{label}</Typography>
      ) : (
        label
      )}
    </Grid>
    {value && (
      <Grid item xs={8} display="flex" justifyContent="end">
        <Typography variant={variant} sx={sx}>
          {value.toString()}
        </Typography>
      </Grid>
    )}
  </Grid>
);

const TotalCell = ({
  item,
  formatCurrencyToDisplay,
}: {
  item: CreateReceivablesFormBeforeValidationLineItemProps;
  formatCurrencyToDisplay: ReturnType<
    typeof useCurrencies
  >['formatCurrencyToDisplay'];
}) => {
  if (!item.price) {
    return null;
  }

  return (
    <>
      {formatCurrencyToDisplay(
        item.price.value * item.quantity,
        item.price.currency
      )}
    </>
  );
};

interface CreateInvoiceProductsTableProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  onCurrencyChanged: (currency: CurrencyEnum) => void;
}

export const ItemsSection = ({
  defaultCurrency,
  actualCurrency,
  onCurrencyChanged,
}: CreateInvoiceProductsTableProps) => {
  const { i18n } = useLingui();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const error = errors?.line_items;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'line_items',
  });
  const watchedLineItems = watch('line_items');
  const { api } = useMoniteContext();
  const { data: vatRates } = api.vatRates.getVatRates.useQuery();
  const { formatCurrencyToDisplay } = useCurrencies();
  const [productsTableOpen, setProductsTableOpen] = useState<boolean>(false);
  const handleSetActualCurrency = useCallback(
    (currency: CurrencyEnum) => {
      onCurrencyChanged(currency);
    },
    [onCurrencyChanged]
  );

  const { root } = useRootElements();

  const handleOpenProductsTable = useCallback(() => {
    setProductsTableOpen(true);
  }, []);
  const handleCloseProductsTable = useCallback(() => {
    setProductsTableOpen(false);
  }, []);

  const {
    subtotalPrice,
    totalPrice,
    totalTaxes,
    shouldShowVatExemptRationale,
  } = useCreateInvoiceProductsTable({
    lineItems: watchedLineItems,
    formatCurrencyToDisplay,
  });

  const generalError = useMemo(() => {
    if (!error || Array.isArray(error)) {
      return;
    }

    return error.message;
  }, [error]);

  const quantityError = useMemo(() => {
    if (!error || !Array.isArray(error)) {
      return;
    }

    const quantityErr = error.find((item) => item?.quantity);

    if (!quantityErr) {
      return;
    }

    return quantityErr.quantity.message;
  }, [error]);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t(i18n)`Items`}</Typography>
      <Collapse in={Boolean(generalError)}>
        <Alert severity="error">{generalError}</Alert>
      </Collapse>
      <Collapse in={Boolean(quantityError)}>
        <Alert severity="error">{quantityError}</Alert>
      </Collapse>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t(i18n)`Item`}</TableCell>
                <TableCell>{t(i18n)`Quantity`}</TableCell>
                <TableCell>{t(i18n)`Units`}</TableCell>
                <TableCell align="right">{t(i18n)`Price`}</TableCell>
                <TableCell align="right">{t(i18n)`Amount`}</TableCell>
                <TableCell>{t(i18n)`VAT`}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    <Controller
                      name={`line_items.${index}.quantity`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            type="number"
                            inputProps={{ min: 1 }}
                            size="small"
                            fullWidth={false}
                            error={Boolean(error)}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    {field.measure_unit_id ? (
                      <MeasureUnit unitId={field.measure_unit_id} />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {field.price &&
                      formatCurrencyToDisplay(
                        field.price.value,
                        field.price.currency
                      )}
                  </TableCell>
                  <TableCell align="right">
                    <TotalCell
                      item={watchedLineItems[index]}
                      formatCurrencyToDisplay={formatCurrencyToDisplay}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`line_items.${index}.vat_rate_id`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl
                          variant="outlined"
                          fullWidth
                          required
                          error={Boolean(error)}
                        >
                          <Select
                            {...field}
                            id={field.name}
                            labelId={field.name}
                            size="small"
                            defaultValue=""
                            MenuProps={{ container: root }}
                            onChange={(e) => {
                              const vatRateId = e.target.value;
                              const vatRate = vatRates?.data.find(
                                (vatRate) => vatRate.id === vatRateId
                              );

                              if (!vatRate) {
                                throw new Error('Vat rate not found');
                              }

                              setValue(
                                `line_items.${index}.vat_rate_value`,
                                vatRate.value
                              );

                              field.onChange(e);
                            }}
                          >
                            {vatRates?.data.map((vatRate) => (
                              <MenuItem key={vatRate.id} value={vatRate.id}>
                                {vatRate.value / 100}%
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleOpenProductsTable}
                  >
                    {t(i18n)`Add item`}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Collapse in={shouldShowVatExemptRationale}>
          <Box sx={{ m: 2 }}>
            <Controller
              name="vat_exemption_rationale"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label={t(i18n)`VAT Exempt Rationale`}
                  multiline
                  rows={4}
                  fullWidth
                  error={Boolean(error)}
                />
              )}
            />
          </Box>
        </Collapse>
      </Card>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <Stack>
          <CardTableItem label={t(i18n)`Subtotal`} value={subtotalPrice} />
          <Divider />
          <CardTableItem label={t(i18n)`Taxes total`} value={totalTaxes} />
          <Divider />
          <CardTableItem
            label={
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{t(
                i18n
              )`Total`}</Typography>
            }
            value={totalPrice}
            variant="subtitle1"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Card>
      <Dialog
        open={productsTableOpen}
        onClose={handleCloseProductsTable}
        alignDialog="right"
      >
        <ProductsTable
          defaultCurrency={defaultCurrency}
          actualCurrency={actualCurrency}
          hasProducts={fields.length > 0}
          onAdd={({ items, currency }) => {
            if (!vatRates) throw new Error('Vat rates not loaded');

            handleCloseProductsTable();
            if (actualCurrency !== currency) {
              replace(
                items.map((product) => {
                  return prepareLineItem(product, vatRates);
                })
              );
              handleSetActualCurrency(currency);

              return;
            }

            const productItemsMapped = items.map((product) => {
              return prepareLineItem(product, vatRates);
            });
            append(productItemsMapped);
            handleSetActualCurrency(currency);
          }}
        />
      </Dialog>
    </Stack>
  );
};

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
type VatRateListResponse = components['schemas']['VatRateListResponse'];
