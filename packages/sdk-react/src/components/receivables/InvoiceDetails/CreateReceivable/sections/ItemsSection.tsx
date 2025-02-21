import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { Dialog } from '@/components';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { ProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/ProductsTable';
import { useCreateInvoiceProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/useCreateInvoiceProductsTable';
import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
  CreateReceivablesFormProps,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { classNames } from '@/utils/css-utils';
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
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material';

import { ItemSelector } from './ItemSelector';

interface VatRateControllerProps {
  index: number;
  vatRates?: VatRateListResponse;
  highestVatRate: VatRateListResponse['data'][number] | undefined;
}

const VatRateController = ({
  index,
  vatRates,
  highestVatRate,
}: VatRateControllerProps) => {
  const { control, setValue } = useFormContext<CreateReceivablesFormProps>();
  const { root } = useRootElements();

  useEffect(() => {
    if (highestVatRate) {
      setValue(`line_items.${index}.vat_rate_value`, highestVatRate.value);
      setValue(`line_items.${index}.vat_rate_id`, highestVatRate.id);
    }
  }, [highestVatRate, index, setValue]);

  return (
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
            MenuProps={{ container: root }}
            size="small"
            onChange={(e) => {
              const vatRate = vatRates?.data.find(
                (rate) => rate.id === e.target.value
              );
              if (!vatRate) {
                throw new Error('Vat rate not found');
              }
              setValue(`line_items.${index}.vat_rate_value`, vatRate.value);
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
  );
};

interface CardTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  variant?: TypographyTypeMap['props']['variant'];
  sx?: TypographyTypeMap['props']['sx'];
  className?: string;
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
    tax_rate_value: 0,
    smallest_amount: product.smallest_amount,
  };
}

const CardTableItem = ({
  label,
  value,
  variant = 'body1',
  sx,
  className,
}: CardTableItemProps) => {
  const componentClassName = 'Monite-CreateReceivable-CardTableItem';
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={classNames(componentClassName, className)}
    >
      <Grid item xs={4}>
        {typeof label === 'string' ? (
          <Typography variant="body1">{label}</Typography>
        ) : (
          label
        )}
      </Grid>
      {value && (
        <Grid item xs={8} display="flex" justifyContent="end">
          <Typography
            variant={variant}
            sx={sx}
            className={componentClassName + '-Value'}
          >
            {value.toString()}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

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
  isNonVatSupported: boolean;
}

export const ItemsSection = ({
  defaultCurrency,
  actualCurrency,
  onCurrencyChanged,
  isNonVatSupported,
}: CreateInvoiceProductsTableProps) => {
  const { i18n } = useLingui();
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const error = errors?.line_items;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'line_items',
  });
  const rows = 2;
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

  const handleOpenProductsTable = useCallback(() => {
    setProductsTableOpen(true);
  }, []);
  const handleCloseProductsTable = useCallback(() => {
    setProductsTableOpen(false);
  }, []);
  console.log({ watchedLineItems });

  const {
    subtotalPrice,
    totalPrice,
    totalTaxes,
    shouldShowVatExemptRationale,
  } = useCreateInvoiceProductsTable({
    lineItems: [...watchedLineItems],
    formatCurrencyToDisplay,
    isNonVatSupported: isNonVatSupported,
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

  const className = 'Monite-CreateReceivable-ItemsSection';
  const tableRowClassName = 'Monite-CreateReceivable-ItemsSection-Table';
  const highestVatRate = vatRates?.data?.reduce(
    (max, vatRate) => (vatRate.value > max.value ? vatRate : max),
    vatRates?.data[0]
  );

  const { getSymbolFromCurrency } = useCurrencies();

  const StyledTableCell = styled(TableCell)`
    max-width: 100px;
  `;

  return (
    <Stack spacing={0} className={className}>
      <Typography
        variant="h3"
        fontSize={'1.25em'}
        fontWeight={500}
        sx={{ marginBottom: 2 }}
      >{t(i18n)`Items`}</Typography>
      <Collapse
        in={Boolean(generalError)}
        sx={{
          ':not(.MuiCollapse-hidden)': {
            marginBottom: 1,
          },
        }}
      >
        <Alert severity="error">{generalError}</Alert>
      </Collapse>
      <Collapse
        in={Boolean(quantityError)}
        sx={{
          ':not(.MuiCollapse-hidden)': {
            marginBottom: 1,
          },
        }}
      >
        <Alert severity="error">{quantityError}</Alert>
      </Collapse>
      <Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className={tableRowClassName}>
                <TableCell sx={{ paddingLeft: 0 }}>{t(
                  i18n
                )`Item name`}</TableCell>
                <TableCell>{t(i18n)`Quantity`}</TableCell>
                <TableCell align="right">{t(i18n)`Price`}</TableCell>
                <TableCell>
                  {isNonVatSupported ? t(i18n)`Tax` : t(i18n)`VAT`}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow className={tableRowClassName}>
                  <TableCell sx={{ minWidth: '200px' }}>
                    <ItemSelector />
                  </TableCell>
                  <StyledTableCell>
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
                          {`line_items.${index}.measure_unit_id` ? (
                            <MeasureUnit
                              unitId={`line_items.${index}.measure_unit_id`}
                            />
                          ) : (
                            'notloaded'
                          )}
                        </FormControl>
                      )}
                    />
                  </StyledTableCell>
                  <TableCell align="right">
                    <Controller
                      name={`line_items.${index}.price`}
                      control={control}
                      render={({
                        field: controllerField,
                        fieldState: { error },
                      }) => {
                        const formattedValue = formatCurrencyToDisplay(
                          controllerField.value?.value || 0,
                          controllerField.value?.currency || 'USD',
                          false
                        );
                        return (
                          <FormControl
                            variant="standard"
                            fullWidth
                            required
                            error={Boolean(error)}
                          >
                            <TextField
                              {...controllerField}
                              id={controllerField.name}
                              type="text"
                              size="small"
                              fullWidth={false}
                              error={Boolean(error)}
                              helperText={error?.message}
                              InputProps={{
                                startAdornment: getSymbolFromCurrency(
                                  controllerField.value?.currency || 'USD'
                                ),
                                readOnly: true,
                              }}
                              sx={{ minWidth: 100 }}
                              value={formattedValue || ''}
                              onChange={(e) => {
                                const newValue = parseFloat(
                                  e.target.value.replace(/[^0-9.]/g, '')
                                );
                                if (!isNaN(newValue)) {
                                  controllerField.onChange({
                                    ...controllerField.value,
                                    value: newValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {isNonVatSupported ? (
                      <Controller
                        name={`line_items.${index}.tax_rate_value`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl
                            variant="standard"
                            fullWidth
                            required
                            error={Boolean(error)}
                          >
                            <TextField
                              {...field}
                              id={field.name}
                              type="number"
                              inputProps={{ min: 1, max: 100 }}
                              size="small"
                              fullWidth={false}
                              error={Boolean(error)}
                              helperText={error?.message}
                              InputProps={{ endAdornment: '%' }}
                              sx={{ minWidth: 100 }}
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <VatRateController
                        index={index}
                        vatRates={vatRates}
                        highestVatRate={highestVatRate}
                      />
                    )}
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
              {fields.map((field, index) => (
                <TableRow className={tableRowClassName} key={field.id}>
                  <TableCell>{field.name}</TableCell>
                  <StyledTableCell>
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
                    {field.measure_unit_id ? (
                      <MeasureUnit unitId={field.measure_unit_id} />
                    ) : (
                      '—'
                    )}
                  </StyledTableCell>
                  <TableCell align="right">
                    <Controller
                      name={`line_items.${index}.price`}
                      control={control}
                      defaultValue={field.price}
                      render={({
                        field: controllerField,
                        fieldState: { error },
                      }) => {
                        const formattedValue = formatCurrencyToDisplay(
                          controllerField.value?.value || 0,
                          controllerField.value?.currency || 'USD',
                          false
                        );
                        return (
                          <FormControl
                            variant="standard"
                            fullWidth
                            required
                            error={Boolean(error)}
                          >
                            <TextField
                              {...controllerField}
                              id={controllerField.name}
                              type="text"
                              size="small"
                              fullWidth={false}
                              error={Boolean(error)}
                              helperText={error?.message}
                              InputProps={{
                                startAdornment: getSymbolFromCurrency(
                                  controllerField.value?.currency || 'USD'
                                ),
                                readOnly: true,
                              }}
                              sx={{ minWidth: 100 }}
                              value={formattedValue || ''}
                              onChange={(e) => {
                                const newValue = parseFloat(
                                  e.target.value.replace(/[^0-9.]/g, '')
                                );
                                if (!isNaN(newValue)) {
                                  controllerField.onChange({
                                    ...controllerField.value,
                                    value: newValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {isNonVatSupported ? (
                      <Controller
                        name={`line_items.${index}.tax_rate_value`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl
                            variant="standard"
                            fullWidth
                            required
                            error={Boolean(error)}
                          >
                            <TextField
                              {...field}
                              id={field.name}
                              type="number"
                              inputProps={{ min: 1, max: 100 }}
                              size="small"
                              fullWidth={false}
                              error={Boolean(error)}
                              helperText={error?.message}
                              InputProps={{ endAdornment: '%' }}
                              sx={{ minWidth: 100 }}
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <VatRateController
                        index={index}
                        vatRates={vatRates}
                        highestVatRate={highestVatRate}
                      />
                    )}
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
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    onClick={handleOpenProductsTable}
                  >
                    {t(i18n)`Row`}
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
      </Box>

      <Card
        className={className + '-Totals'}
        variant="outlined"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          borderRadius: 0,
          border: 0,
          paddingBottom: 4,
        }}
      >
        <CardContent sx={{ maxWidth: '560px', width: '100%' }}>
          <Stack>
            <CardTableItem
              label={t(i18n)`Subtotal`}
              value={subtotalPrice}
              className="Monite-Subtotal"
            />
            <Divider sx={{ my: 1.5 }} />
            <CardTableItem
              label={t(i18n)`Taxes total`}
              value={totalTaxes}
              className="Monite-TaxesTotal"
            />
            <Divider sx={{ my: 1.5 }} />
            <CardTableItem
              label={
                <Typography variant="subtitle1">{t(i18n)`Total`}</Typography>
              }
              value={totalPrice}
              variant="subtitle1"
              className="Monite-Total"
            />
          </Stack>
        </CardContent>
      </Card>
      <Dialog
        className={className + '-Dialog-ProductsTable'}
        open={productsTableOpen}
        onClose={handleCloseProductsTable}
        alignDialog="right"
      >
        <ProductsTable
          defaultCurrency={defaultCurrency}
          actualCurrency={actualCurrency}
          hasProducts={fields.length > 0}
          onAdd={({ items, currency }) => {
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
