import {
  BaseSyntheticEvent,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';

import { components } from '@/api';
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
  CreateReceivablesProductsFormProps,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { CenteredContentBox } from '@/ui/box';
import { MoniteCurrency } from '@/ui/Currency';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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

export interface ProductsTableProps {
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
   * `true` if CreateReceivables component contains products and
   *  when the user tries to change currency, it will lead to data loss
   */
  hasProducts: boolean;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const VirtuosoTableComponents: TableComponents<ProductServiceResponse> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
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
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
  TableFoot: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <tfoot {...props} ref={ref} />
  )),
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
  onAdd,
  open,
  setOpen,
  defaultCurrency,
  actualCurrency,
}: ProductsTableProps) => {
  const { i18n } = useLingui();
  const tableHeadCells = useMemo(() => getTableHeadCells(i18n), [i18n]);
  const [openChangeCurrencyInfo, setOpenChangeCurrencyInfo] =
    useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});

  const { control, handleSubmit, watch } =
    useForm<CreateReceivablesProductsFormProps>({
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
  const { api } = useMoniteContext();

  const {
    data: productsInfinity,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = api.products.getProducts.useInfiniteQuery(
    {
      query: {
        limit: 20,
        currency,
        type: currentFilter[FILTER_TYPE_TYPE] || undefined,
        name__icontains: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      },
    },
    {
      initialPageParam: {
        query: {
          pagination_token: undefined,
        },
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.next_pagination_token) return;
        return {
          query: {
            pagination_token: lastPage.next_pagination_token,
          },
        };
      },
      enabled: !!currency,
    }
  );

  const flattenProducts = useMemo(
    () =>
      productsInfinity
        ? productsInfinity.pages.flatMap((page) => page.data)
        : [],
    [productsInfinity]
  );

  const { formatCurrencyToDisplay } = useCurrencies();

  const formName = `Monite-Form-productsTable-${useId()}`;

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
   * [See](https://legacy.reactjs.org/docs/portals.html#event-bubbling-through-portals
   */
  const handleSubmitWithoutPropagation = useCallback(
    (e: BaseSyntheticEvent) => {
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(true);
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
    <Dialog
      open={open}
      alignDialog="right"
      onClose={() => {
        setOpen(false);
      }}
      data-testid={ProductsTableDataTestId.DialogTestId}
    >
      <ProductDetails
        onCreated={() => {
          setOpen(false);
        }}
        defaultValues={{
          currency: currency,
        }}
      />
    </Dialog>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
