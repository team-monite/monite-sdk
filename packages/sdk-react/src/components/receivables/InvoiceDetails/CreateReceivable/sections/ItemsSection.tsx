import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

import { components } from '@/api';
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

import { v4 as uuidv4 } from 'uuid';

import { ItemSelector } from './ItemSelector';

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

interface RowItem {
  quantity: number;
  price: { value: undefined | number; currency: string };
  measure_unit_id?: string;
  name?: string;
  vat_rate_id?: string;
  vat_rate_value?: number;
  tax_rate_value?: number;
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
    setValue,
    getValues,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const error = errors?.line_items;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'line_items',
    keyName: 'tempId',
  });
  const mounted = useRef(false);
  const [rows, setRows] = useState<RowItem[]>([
    {
      quantity: 1,
      price: { value: undefined, currency: 'USD' },
      measure_unit_id: undefined,
      name: '',
      vat_rate_id: undefined,
      vat_rate_value: undefined,
      tax_rate_value: undefined,
    },
  ]);
  const watchedLineItems = watch('line_items');
  const { api } = useMoniteContext();
  const { data: vatRates } = api.vatRates.getVatRates.useQuery();
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();
  const [productsTableOpen, setProductsTableOpen] = useState<boolean>(false);
  const handleSetActualCurrency = useCallback(
    (currency: CurrencyEnum) => {
      onCurrencyChanged(currency);
    },
    [onCurrencyChanged]
  );
  const handleAddRow = () => {
    if (rows.length < 5) {
      setRows((prevRows) => [
        ...prevRows,
        {
          quantity: 1,
          price: { value: undefined, currency: 'USD' },
          measure_unit_id: undefined,
          name: '',
          vat_rate_id: undefined,
          vat_rate_value: undefined,
          tax_rate_value: undefined,
        },
      ]);
    }
  };

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
  const highestVatRate = useMemo(
    () =>
      vatRates?.data?.reduce(
        (max, rate) => (rate.value > max.value ? rate : max),
        vatRates.data[0]
      ),
    [vatRates]
  );

  const createEmptyRow = useCallback(
    () => ({
      tempId: uuidv4(),
      isLocal: true,
      product_id: '',
      quantity: 1,
      price: { value: 0, currency: actualCurrency || 'USD' },
      name: '',
      vat_rate_id: highestVatRate?.id,
      vat_rate_value: highestVatRate?.value,
    }),
    [actualCurrency, highestVatRate?.id, highestVatRate?.value]
  );

  const handleAddLocalRow = () => {
    append(createEmptyRow());
  };

  useEffect(() => {
    if (!mounted.current) {
      append(createEmptyRow());
      mounted.current = true;
    }
  }, [append, createEmptyRow]);

  const StyledTableCell = styled(TableCell)`
    max-width: 100px;
  `;

  const { root } = useRootElements();

  const VatRateController = ({ index }: { index: number }) => {
    useEffect(() => {
      const currentVatId = getValues(`line_items.${index}.vat_rate_id`);
      if (!currentVatId && highestVatRate) {
        setValue(`line_items.${index}.vat_rate_id`, highestVatRate.id);
        setValue(`line_items.${index}.vat_rate_value`, highestVatRate.value);
      }
    }, [highestVatRate, index, setValue, getValues]);

    return (
      <Controller
        name={`line_items.${index}.vat_rate_id`}
        render={({ field }) => (
          <FormControl
            variant="standard"
            fullWidth
            required
            error={Boolean(error)}
          >
            <Select
              {...field}
              MenuProps={{ container: root }}
              sx={{
                borderColor: 'divider',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              size="small"
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

  return (
    <Stack spacing={0} className={className}>
      <Typography
        variant="h3"
        fontSize={'1.25em'}
        fontWeight={500}
        sx={{ marginBottom: 2 }}
      >
        {t(i18n)`Items`}
      </Typography>

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
              {fields.map((field, index) => {
                const isLocal = !!field.isLocal;
                return (
                  <TableRow
                    key={field.tempId || field.id}
                    className={tableRowClassName}
                  >
                    <TableCell sx={{ minWidth: 160 }}>
                      {isLocal ? (
                        <ItemSelector
                          setIsCreateItemOpened={setProductsTableOpen}
                        />
                      ) : (
                        field.name
                      )}
                    </TableCell>

                    <TableCell>
                      <Controller
                        name={`line_items.${index}.quantity`}
                        render={({ field }) => (
                          <FormControl
                            variant="standard"
                            fullWidth
                            required
                            error={Boolean(error)}
                          >
                            <TextField
                              {...field}
                              type="number"
                              inputProps={{ min: 1 }}
                              size="small"
                              disabled={!isLocal}
                            />
                          </FormControl>
                        )}
                      />
                      {field.measure_unit_id && (
                        <MeasureUnit unitId={field.measure_unit_id} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Controller
                        name={`line_items.${index}.price.value`}
                        render={({
                          field: controllerField,
                          fieldState: { error },
                        }) => {
                          const rawValue = controllerField.value ?? 0;
                          return (
                            <FormControl
                              variant="standard"
                              fullWidth
                              required
                              error={Boolean(error)}
                            >
                              <TextField
                                size="small"
                                type="text"
                                sx={{ minWidth: 100 }}
                                placeholder={'0'}
                                onBlur={controllerField.onBlur}
                                name={controllerField.name}
                                inputRef={controllerField.ref}
                                InputProps={{
                                  startAdornment: getSymbolFromCurrency(
                                    actualCurrency || 'USD'
                                  ),
                                }}
                                onChange={(e) => {
                                  const formatted = formatCurrencyToDisplay(
                                    rawValue * 1000,
                                    actualCurrency || 'USD',
                                    false
                                  );
                                  const newValue = parseFloat(
                                    e.target.value.replace(/[^0-9.]/g, '')
                                  );
                                  if (!isNaN(newValue)) {
                                    controllerField.onChange(newValue);
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
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              InputProps={{ endAdornment: '%' }}
                              disabled={!isLocal}
                            />
                          )}
                        />
                      ) : (
                        <VatRateController index={index} />
                      )}
                    </TableCell>

                    {/* Delete Button */}
                    <TableCell>
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    onClick={handleAddLocalRow}
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

      <ProductsTable
        defaultCurrency={defaultCurrency}
        actualCurrency={actualCurrency}
        open={productsTableOpen}
        setOpen={setProductsTableOpen}
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
    </Stack>
  );
};

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
type VatRateListResponse = components['schemas']['VatRateListResponse'];
