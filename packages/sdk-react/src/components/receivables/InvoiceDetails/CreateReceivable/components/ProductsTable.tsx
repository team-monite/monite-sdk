import React, { useCallback, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';

import { useDialog } from '@/components';
import { Dialog } from '@/components/Dialog';
import { ProductDetails } from '@/components/products';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from '@/components/products/ProductsTable/consts';
import {
  Filters as FilterType,
  FilterValue,
} from '@/components/products/ProductsTable/types';
import { ProductsTableDataTestId } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/ProductsTable.types';
import { ProductsTableFilters } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/ProductsTableFilters';
import {
  getCreateInvoiceProductsValidationSchema,
  ICreateReceivablesProductsForm,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useCurrencies } from '@/core/hooks';
import { useInfiniteProducts } from '@/core/queries';
import { CenteredContentBox } from '@/ui/box';
import { MoniteCurrency } from '@/ui/Currency';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CurrencyEnum, ProductServiceResponse } from '@monite/sdk-api';
import AddIcon from '@mui/icons-material/Add';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Alert,
  Box,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  TableCell,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell/TableCell';

interface OnAddOptions {
  items: Array<ProductServiceResponse>;
  currency: CurrencyEnum;
}

export interface IProductsTableProps {
  /**
   * Default currency of the invoice based on the entity settings
   * The user can choose any currency, but this value can only help to choose it
   */
  defaultCurrency?: CurrencyEnum;

  /**
   * If the user already selected a currency, it will be stored here
   * If the user decides to change the currency, it will lead to data loss
   */
  actualCurrency?: CurrencyEnum;

  /**
   * Callback `onAdd` is called when the user clicks on the `Add` button
   */
  onAdd: (options: OnAddOptions) => void;

  /**
   * `true` if CreateReceivables component contains products and
   *  when the user tries to change currency, it will lead to data loss
   */
  hasProducts: boolean;
}

const VirtuosoTableComponents: TableComponents<ProductServiceResponse> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      stickyHeader
      size="small"
      sx={{ borderCollapse: 'separate' }}
    />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
  TableFoot: ({ children }) => {
    return <React.Fragment>{children}</React.Fragment>;
  },
};

const getTableHeadCells = (i18n: I18n) => [
  {
    id: 'checkbox',
    width: '10%',
  },
  {
    id: 'name',
    label: t(i18n)`Name`,
    width: '60%',
  },
  {
    id: 'price',
    label: t(i18n)`Price`,
    width: '30%',
    align: 'right' as TableCellProps['align'],
  },
];

export const ProductsTable = ({
  hasProducts,
  onAdd,
  defaultCurrency,
  actualCurrency,
}: IProductsTableProps) => {
  const { i18n } = useLingui();
  const tableHeadCells = useMemo(() => getTableHeadCells(i18n), [i18n]);
  const [openChangeCurrencyInfo, setOpenChangeCurrencyInfo] =
    useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});

  const { control, handleSubmit, watch } =
    useForm<ICreateReceivablesProductsForm>({
      resolver: yupResolver(getCreateInvoiceProductsValidationSchema(i18n)),
      defaultValues: useMemo(
        () => ({
          items: [],
          currency: actualCurrency ?? defaultCurrency,
        }),
        [actualCurrency, defaultCurrency]
      ),
    });
  const { replace, fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    /**
     * By default, useFieldArray adds unique `id` into `id` field
     *  which will rewrite our current `id`
     * We don't need to rewrite real `id` into `useFieldArray` implementation
     */
    keyName: '_id',
  });
  const currency = watch('currency');
  const dialogContent = useDialog();
  const {
    data: productsInfinity,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteProducts(
    {
      limit: 20,
      currency,
      type: currentFilter[FILTER_TYPE_TYPE] || undefined,
      nameIcontains: currentFilter[FILTER_TYPE_SEARCH] || undefined,
    },
    {
      enabled: Boolean(currency),
    }
  );

  /**
   * We need to flatten the product array because we use `useInfiniteQuery`
   *  and it returns an array of pages.
   * ### Example
   * ```ts
   * {
   *  pages: [
   *    {
   *      data: [First page data]
   *    },
   *    {
   *      data: [Second page data]
   *    }
   *  ]
   * }
   * ```
   * @see {@link https://react-query.tanstack.com/guides/infinite-queries#using-infinite-queries-with-react-table}
   */
  const flattenProducts = useMemo(
    () =>
      productsInfinity
        ? productsInfinity.pages.flatMap((page) => page.data)
        : [],
    [productsInfinity]
  );

  const { formatCurrencyToDisplay } = useCurrencies();

  /**
   * `ProductsTable` is used in `CreateReceivables` component.
   *
   * `CreateReceivables` contains a form with `onSubmit` handler.
   * `ProductsTable` also contains a form with `onSubmit` handler.
   *
   * When the user clicks on the `Add` button in `ProductsTable`,
   *  the `onSubmit` handler of the `ProductsTable` form is called.
   * But the `onSubmit` handler of the `CreateReceivables` form is also called.
   *
   * `CreateReceivables` (form)
   *  -> `ProductsTable` (form)
   *
   * To prevent this, we need to stop the propagation of the event.
   * @see {@link https://legacy.reactjs.org/docs/portals.html#event-bubbling-through-portals}
   */
  const handleSubmitWithoutPropagation = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit((values) => {
        onAdd(values);
      })(e);
    },
    [handleSubmit, onAdd]
  );

  const onChangeFilter = useCallback(
    (field: keyof FilterType, value: FilterValue) => {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        [field]: value === 'all' ? null : value,
      }));
    },
    []
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const handleCreateNewProduct = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const isSelected = useCallback(
    (item: ProductServiceResponse) => {
      const index = fields.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );

      return {
        selected: index !== -1,
        index: index,
      };
    },
    [fields]
  );
  const handleUpdateProducts = useCallback(
    (newItem: ProductServiceResponse) => {
      if (!flattenProducts) {
        replace([]);

        return;
      }

      const selected = isSelected(newItem);

      if (selected.selected) {
        remove(selected.index);

        return;
      }
      append(newItem);
    },
    [append, flattenProducts, isSelected, remove, replace]
  );

  return (
    <>
      <Dialog
        open={isCreateModalOpen}
        alignDialog="right"
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        data-testid={ProductsTableDataTestId.DialogTestId}
      >
        <ProductDetails
          onCreated={() => {
            setIsCreateModalOpen(false);
          }}
          defaultValues={{
            currency: currency,
          }}
        />
      </Dialog>
      <Grid container alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h3" sx={{ p: 4 }}>{t(
            i18n
          )`Add item`}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleCreateNewProduct}
          >{t(i18n)`Create new`}</Button>
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <form
          id="receivablesAddProducts"
          noValidate
          onSubmit={handleSubmitWithoutPropagation}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t(
            i18n
          )`Select invoice currency`}</Typography>
          <Typography variant="body2">{t(
            i18n
          )`And add items created with it.`}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{t(
            i18n
          )`An invoice can only contain items in the selected currency.`}</Typography>
          <Box sx={{ mb: 4 }}>
            <MoniteCurrency
              size="small"
              name="currency"
              control={control}
              onChange={() => {
                if (fields.length > 0 || hasProducts) {
                  setOpenChangeCurrencyInfo(true);
                  replace([]);
                }
              }}
            />
            <Collapse in={openChangeCurrencyInfo}>
              <Alert severity="warning" sx={{ mt: 2 }}>{t(
                i18n
              )`If you switch the invoice currency and add corresponding items, it will automatically replace the previously added ones.`}</Alert>
            </Collapse>
          </Box>
          {currency && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
                i18n
              )`Available items`}</Typography>
              <Controller
                name="items"
                control={control}
                render={({ fieldState: { error } }) => {
                  if (!error) {
                    return <></>;
                  }

                  return (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error.message}
                    </Alert>
                  );
                }}
              />
              <Box sx={{ mb: 2 }}>
                <ProductsTableFilters onChangeFilter={onChangeFilter} />
              </Box>
              <Paper
                variant="outlined"
                style={{ height: '100%', overflow: 'scroll' }}
                sx={{
                  '& .MuiListItem-root': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  borderRadius: 3,
                }}
              >
                <TableVirtuoso
                  data={flattenProducts}
                  context={{
                    empty:
                      isLoading ||
                      !flattenProducts ||
                      flattenProducts.length === 0,
                  }}
                  components={{
                    ...VirtuosoTableComponents,
                    TableRow: ({ item, ...props }) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={item.id}
                        selected={isSelected(item).selected}
                        onClick={() => {
                          handleUpdateProducts(item);
                        }}
                        sx={{ cursor: 'pointer', height: 0 }}
                        {...props}
                      />
                    ),
                    EmptyPlaceholder: () => {
                      if (isLoading) {
                        return (
                          <TableCell colSpan={3}>
                            <CenteredContentBox>
                              <CircularProgress />
                            </CenteredContentBox>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell colSpan={3}>
                          <CenteredContentBox>
                            <Stack alignItems="center" sx={{ p: 4 }}>
                              <FileIcon color="primary" sx={{ mb: 2 }} />
                              <Typography variant="body1" sx={{ mb: 0.5 }}>{t(
                                i18n
                              )`No items yet`}</Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>{t(
                                i18n
                              )`Create an item with this currency to add it`}</Typography>
                              <Button
                                variant="contained"
                                onClick={handleCreateNewProduct}
                                size="small"
                              >{t(i18n)`Create product or service`}</Button>
                            </Stack>
                          </CenteredContentBox>
                        </TableCell>
                      );
                    },
                  }}
                  fixedHeaderContent={() => {
                    if (isLoading) {
                      return null;
                    }

                    if (!flattenProducts || flattenProducts.length === 0) {
                      return null;
                    }

                    return (
                      <React.Fragment>
                        <TableRow>
                          {tableHeadCells.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              width={headCell.width}
                              align={headCell.align}
                              variant="head"
                              padding="normal"
                            >
                              <Typography
                                variant="body1"
                                color="secondary"
                                sx={{
                                  fontWeight: 500,
                                }}
                              >
                                {headCell.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </React.Fragment>
                    );
                  }}
                  fixedFooterContent={() => {
                    if (isLoading) {
                      return null;
                    }

                    if (!flattenProducts || flattenProducts.length === 0) {
                      return null;
                    }

                    if (!hasNextPage) {
                      return null;
                    }

                    return (
                      <TableCell colSpan={3}>
                        <Box
                          sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <CircularProgress size={30} />
                        </Box>
                      </TableCell>
                    );
                  }}
                  itemContent={(_index, row) => (
                    <React.Fragment>
                      <TableCell>
                        <Checkbox checked={isSelected(row).selected} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">
                        {row.price
                          ? formatCurrencyToDisplay(
                              row.price.value,
                              row.price.currency
                            )
                          : ''}
                      </TableCell>
                    </React.Fragment>
                  )}
                  endReached={() => hasNextPage && fetchNextPage()}
                />
              </Paper>
            </>
          )}
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={dialogContent?.onClose}>
          {t(i18n)`Cancel`}
        </Button>
        <Button variant="contained" type="submit" form="receivablesAddProducts">
          {openChangeCurrencyInfo ? t(i18n)`Replace items` : t(i18n)`Add`}
        </Button>
      </DialogActions>
    </>
  );
};
