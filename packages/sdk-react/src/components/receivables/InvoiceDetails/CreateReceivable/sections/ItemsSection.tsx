import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { useCreateInvoiceProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/useCreateInvoiceProductsTable';
import { CreateReceivablesFormBeforeValidationProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { classNames } from '@/utils/css-utils';
import { faker } from '@faker-js/faker';
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

import { CreateProductDialog } from '../components/CreateProductDialog';
import { ItemSelector } from './ItemSelector';
import { PriceField } from './PriceField';

interface CardTableItemProps {
  label: string | ReactNode;
  value?: string | Price;
  variant?: TypographyTypeMap['props']['variant'];
  sx?: TypographyTypeMap['props']['sx'];
  className?: string;
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

interface CreateInvoiceProductsTableProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
}

export const ItemsSection = ({
  defaultCurrency,
  actualCurrency,
  isNonVatSupported,
}: CreateInvoiceProductsTableProps) => {
  const { i18n } = useLingui();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();
  const error = errors?.line_items;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
  });
  const mounted = useRef(false);
  const { api } = useMoniteContext();
  const { data: vatRates } = api.vatRates.getVatRates.useQuery();
  const { formatCurrencyToDisplay } = useCurrencies();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const {
    subtotalPrice,
    totalPrice,
    totalTaxes,
    shouldShowVatExemptRationale,
  } = useCreateInvoiceProductsTable({
    lineItems: [...fields],
    formatCurrencyToDisplay,
    isNonVatSupported: isNonVatSupported,
    actualCurrency,
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
      product: {
        price: {
          value: 0,
          currency: actualCurrency || defaultCurrency || 'USD',
        },
        name: '',
        type: 'product',
      },
      quantity: 1,
      vat_rate_id: highestVatRate?.id,
      vat_rate_value: highestVatRate?.value,
    }),
    [actualCurrency, defaultCurrency, highestVatRate?.id, highestVatRate?.value]
  );

  const [tooManyEmptyRows, setTooManyEmptyRows] = useState(false);

  const countEmptyRows = (fields: any[]) => {
    return fields.reduce(
      (count, field) => (field.product?.name === '' ? count + 1 : count),
      0
    );
  };

  const handleAddRow = useCallback(() => {
    const emptyRowCount = countEmptyRows(fields);

    if (emptyRowCount > 4) {
      setTooManyEmptyRows(true);
      return;
    }

    setTooManyEmptyRows(false);
    append(createEmptyRow());
  }, [fields, append, createEmptyRow]);

  console.log(fields);

  const handleAutoAddRow = useCallback(() => {
    const emptyRowCount = countEmptyRows(fields);

    if (emptyRowCount > 1) {
      return;
    }

    append(createEmptyRow());
  }, [fields, append, createEmptyRow]);

  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  useEffect(() => {
    if (!mounted.current) {
      append(createEmptyRow());
      mounted.current = true;
    }
  }, [append, createEmptyRow]);

  const handleUpdate = useCallback(
    (index: number, item: any) => {
      if (item) {
        setValue(`line_items.${index}.product.name`, item.label);
        const currentPrice = getValues(
          //if user manually typed a price it is unlikely they want the price of the catalogue to overwrite it
          `line_items.${index}.product.price.value`
        );
        if (!currentPrice || currentPrice === 0) {
          setValue(
            `line_items.${index}.product.price.value`,
            item.price?.value || 0
          );
        }
        setValue(
          `line_items.${index}.product.price.currency`,
          actualCurrency || defaultCurrency || 'USD'
        );
        setValue(
          `line_items.${index}.product.measure_unit_id`,
          item.measureUnit?.id || measureUnits?.data[0].id
        );
        setValue(`line_items.${index}.vat_rate_id`, item.vat_rate_id);
        setValue(`line_items.${index}.vat_rate_value`, item.vat_rate_value);
        setValue(`line_items.${index}.quantity`, item.smallestAmount || 1);
        setValue(`line_items.${index}.product.type`, 'product');
        handleAutoAddRow();
      }
    },
    [
      actualCurrency,
      defaultCurrency,
      setValue,
      getValues,
      measureUnits,
      handleAutoAddRow,
    ]
  );

  const { root } = useRootElements();

  const VatRateController = ({ index }: { index: number }) => {
    useEffect(() => {
      const currentVatId = getValues(`line_items.${index}.vat_rate_id`);
      if (!currentVatId && highestVatRate) {
        setValue(`line_items.${index}.vat_rate_id`, highestVatRate.id);
        setValue(`line_items.${index}.vat_rate_value`, highestVatRate.value);
      }
    }, [index]);

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
        <TableContainer
          sx={{
            maxHeight: 400,
            overflow: 'visible',
            overflowY: 'auto',
          }}
        >
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
              {isMeasureUnitsLoading ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '8px',
                  }}
                >
                  <CircularProgress size={20} />
                </Box>
              ) : (
                fields.map((field, index) => {
                  return (
                    <TableRow
                      key={faker.string.uuid()}
                      className={tableRowClassName}
                    >
                      <TableCell sx={{ width: { xs: '30%', xl: '40%' } }}>
                        <ItemSelector
                          setIsCreateItemOpened={setIsCreateDialogOpen}
                          onUpdate={(item) => handleUpdate(index, item)}
                          fieldName={field.product?.name}
                          index={index}
                          actualCurrency={actualCurrency}
                          defaultCurrency={defaultCurrency}
                          measureUnits={measureUnits}
                        />
                      </TableCell>

                      <TableCell sx={{ width: { xs: '30%', xl: '20%' } }}>
                        <Controller
                          name={`line_items.${index}.quantity`}
                          render={({ field }) => {
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
                                    endAdornment: measureUnits?.data
                                      ?.length && (
                                      <InputAdornment position="end">
                                        <Controller
                                          name={`line_items.${index}.product.measure_unit_id`}
                                          control={control}
                                          defaultValue={
                                            measureUnits.data[0]?.id
                                          }
                                          render={({ field }) => (
                                            <Select
                                              MenuProps={{ container: root }}
                                              {...field}
                                              onChange={(e) => {
                                                const selectedUnitId =
                                                  e.target.value;
                                                setValue(
                                                  `line_items.${index}.product.measure_unit_id`,
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
                                    ),
                                  }}
                                  type="number"
                                  inputProps={{ min: 1 }}
                                  size="small"
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
                        <PriceField
                          index={index}
                          error={Boolean(error)}
                          currency={actualCurrency || defaultCurrency || 'USD'}
                        />
                      </TableCell>

                      <TableCell sx={{ width: 'fit-content' }}>
                        {isNonVatSupported ? (
                          <Controller
                            name={`line_items.${index}.tax_rate_value`}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                error={Boolean(error)}
                                type="number"
                                size="small"
                                InputProps={{ endAdornment: '%' }}
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
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddRow}
            disabled={tooManyEmptyRows}
          >
            {t(i18n)`Row`}
          </Button>
          {tooManyEmptyRows && (
            <Typography mt={2} variant="body2" color="warning">{t(
              i18n
            )`Please use some of the rows before adding new ones.`}</Typography>
          )}
        </Box>

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

      <CreateProductDialog
        actualCurrency={actualCurrency}
        defaultCurrency={defaultCurrency}
        open={isCreateDialogOpen}
        handleClose={() => setIsCreateDialogOpen(false)}
      />
    </Stack>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
