import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  useFieldArray,
  useFormContext,
  useWatch,
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
  CircularProgress,
  InputAdornment,
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

  const [tooManyEmptyRows, setTooManyEmptyRows] = useState(false);

  const handleAddLocalRow = () => {
    const areFieldsEmpty = watchedLineItems.filter(
      (field) => field.name === ''
    );
    if (areFieldsEmpty.length > 4) {
      setTooManyEmptyRows(true);
    } else {
      setTooManyEmptyRows(false);
      append(createEmptyRow());
    }
  };

  const { data: measureUnits } = api.measureUnits.getMeasureUnits.useQuery();

  useEffect(() => {
    if (!mounted.current) {
      append(createEmptyRow());
      mounted.current = true;
    }
  }, [append, createEmptyRow]);

  const handleUpdate = useCallback(
    (index: number, item: any) => {
      if (item) {
        setValue(`line_items.${index}.name`, item.label);
        setValue(`line_items.${index}.product_id`, item.id);
        setValue(`line_items.${index}.price.value`, item.price?.value || 0);
        setValue(`line_items.${index}.measure_unit_id`, item.measureUnit?.id);
        setValue(`line_items.${index}.vat_rate_id`, item.vat_rate_id);
        setValue(`line_items.${index}.vat_rate_value`, item.vat_rate_value);
        setValue(`line_items.${index}.quantity`, item.smallestAmount || 1);
      }
    },
    [setValue]
  );

  const { root } = useRootElements();

  const VatRateController = ({ index }: { index: number }) => {
    useEffect(() => {
      const currentVatId = getValues(`line_items.${index}.vat_rate_id`);
      if (!currentVatId && highestVatRate) {
        setValue(`line_items.${index}.vat_rate_id`, highestVatRate.id);
        setValue(`line_items.${index}.vat_rate_value`, highestVatRate.value);
      }
    }, []);

    console.log({ watchedLineItems, error });

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
              onChange={(e) => {
                field.onChange(e);
                const selectedVatRate = vatRates?.data.find(
                  (vatRate) => vatRate.id === e.target.value
                );
                if (selectedVatRate) {
                  setValue(
                    `line_items.${index}.vat_rate_value`,
                    selectedVatRate.value
                  );
                }
              }}
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
                <TableCell>{t(i18n)`Item name`}</TableCell>
                <TableCell>{t(i18n)`Quantity`}</TableCell>
                <TableCell>{t(i18n)`Price`}</TableCell>
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
                    <TableCell sx={{ width: '40%' }}>
                      {isLocal ? (
                        <ItemSelector
                          setIsCreateItemOpened={setProductsTableOpen}
                          onUpdate={(item: any) => handleUpdate(index, item)}
                          index={index}
                          actualCurrency={actualCurrency}
                          defaultCurrency={defaultCurrency}
                          measureUnits={measureUnits}
                        />
                      ) : (
                        field.name
                      )}
                    </TableCell>

                    <TableCell sx={{ width: '20%' }}>
                      <Controller
                        name={`line_items.${index}.quantity`}
                        render={({ field }) => {
                          const measureUnitId = useWatch({
                            control,
                            name: `line_items.${index}.measure_unit_id`,
                          });

                          return (
                            <FormControl
                              variant="standard"
                              fullWidth
                              required
                              error={Boolean(error)}
                            >
                              <TextField
                                {...field}
                                InputProps={{
                                  endAdornment:
                                    measureUnitId && !isLocal ? (
                                      <MeasureUnit unitId={measureUnitId} />
                                    ) : measureUnits?.data?.length ? (
                                      <InputAdornment position="end">
                                        <Controller
                                          name={`line_items.${index}.measure_unit_id`}
                                          control={control}
                                          defaultValue={
                                            measureUnits.data[0]?.id
                                          }
                                          render={({ field }) => (
                                            <Select
                                              {...field}
                                              onChange={(e) => {
                                                const selectedUnitId =
                                                  e.target.value;
                                                setValue(
                                                  `line_items.${index}.measure_unit_id`,
                                                  selectedUnitId
                                                );
                                              }}
                                              sx={{
                                                background: 'transparent',
                                                minHeight:
                                                  'fit-content !important',
                                                '.MuiSelect-select.MuiSelect-outlined':
                                                  {
                                                    paddingLeft: 0,
                                                  },
                                                '&:hover': {
                                                  boxShadow: 'none !important',
                                                  borderColor:
                                                    'transparent !important',
                                                  background: 'transparent',
                                                },
                                                '&.MuiInputBase-root .MuiInputBase-inputSizeSmall':
                                                  { paddingLeft: 0 },
                                                '&.Mui-focused.MuiInputBase-root':
                                                  {
                                                    boxShadow:
                                                      'none !important',
                                                    background: 'transparent',
                                                  },
                                                '& .MuiOutlinedInput-notchedOutline':
                                                  {
                                                    border: 'none !important',
                                                    background: 'transparent',
                                                  },
                                                '&:hover .MuiOutlinedInput-notchedOutline':
                                                  {
                                                    border: 'none !important',
                                                    background: 'transparent',
                                                  },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                  {
                                                    background: 'transparent',
                                                  },
                                              }}
                                              size="small"
                                            >
                                              {measureUnits.data.map((unit) => (
                                                <MenuItem
                                                  key={unit.id}
                                                  value={unit.id}
                                                >
                                                  {unit.name}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          )}
                                        />
                                      </InputAdornment>
                                    ) : (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          marginRight: '8px',
                                        }}
                                      >
                                        <CircularProgress size={20} />
                                      </Box>
                                    ),
                                }}
                                type="number"
                                inputProps={{ min: 1 }}
                                size="small"
                                disabled={
                                  measureUnits?.data?.length === 0 &&
                                  !measureUnitId
                                }
                                sx={{
                                  '& .MuiInputBase-root': {
                                    paddingRight: '0 !important',
                                    '.MuiInputBase-input': {
                                      paddingRight: 0,
                                    },
                                    '&:hover .MuiInputBase-root:not(.Mui-disabled):not(.Mui-focused)':
                                      {
                                        borderColor: 'transparent',
                                      },
                                  },
                                }}
                              />
                            </FormControl>
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '20%' }} align="right">
                      <Controller
                        name={`line_items.${index}.price.value`}
                        render={({
                          field: controllerField,
                          fieldState: { error },
                        }) => {
                          const [isTyping, setIsTyping] = useState(false);
                          const [rawValue, setRawValue] = useState<
                            string | number
                          >('');

                          const handleBlur = (e) => {
                            const inputValue = String(rawValue).trim();
                            const numericValue = parseFloat(
                              inputValue.replace(/[^0-9.]/g, '')
                            );

                            if (inputValue === '' || isNaN(numericValue)) {
                              controllerField.onChange(0);
                              setRawValue(
                                formatCurrencyToDisplay(
                                  0,
                                  actualCurrency || 'USD',
                                  false
                                )
                              );
                            } else {
                              const isAlreadyInCents =
                                controllerField.value === numericValue * 100;
                              let valueInCents = isAlreadyInCents
                                ? controllerField.value
                                : numericValue * 100;
                              const newValue =
                                formatCurrencyToDisplay(
                                  valueInCents,
                                  actualCurrency || 'USD',
                                  false
                                ) || 0;

                              controllerField.onChange(valueInCents);
                              setRawValue(newValue);
                            }

                            setIsTyping(false);
                            controllerField.onBlur();
                          };

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
                                value={
                                  isTyping
                                    ? rawValue
                                    : formatCurrencyToDisplay(
                                        controllerField.value,
                                        actualCurrency || 'USD',
                                        false
                                      )
                                }
                                sx={{ minWidth: 100 }}
                                placeholder={'0'}
                                onBlur={handleBlur}
                                onFocus={() => {
                                  setIsTyping(true);
                                }}
                                name={controllerField.name}
                                inputRef={controllerField.ref}
                                InputProps={{
                                  startAdornment: getSymbolFromCurrency(
                                    actualCurrency || 'USD'
                                  ),
                                }}
                                onChange={(e) => {
                                  setRawValue(e.target.value);
                                }}
                              />
                            </FormControl>
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '10%' }}>
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
                    disabled={tooManyEmptyRows}
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
