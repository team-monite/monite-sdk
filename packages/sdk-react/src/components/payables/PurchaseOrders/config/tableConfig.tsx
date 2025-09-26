import {
  TableConfig,
  TableColumnConfig,
} from '../../shared/ConfigurableDataTable';
import { PurchaseOrderStatusChip } from '../PurchaseOrderStatusChip';
import { TABLE_COLUMN_WIDTHS } from '../consts';
import { PURCHASE_ORDER_CONSTANTS } from '../consts';
import { DEFAULT_FIELD_ORDER } from '../consts';
import { components } from '@/api';
import { CounterpartNameCellById } from '@/ui/CounterpartCell';
import { calculatePurchaseOrderTotals } from '../utils/calculations';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { GridRenderCellParams } from '@mui/x-data-grid';

type MoniteDateFormat = Pick<
  Intl.DateTimeFormatOptions,
  | 'weekday'
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'timeZoneName'
  | 'hour12'
  | 'timeZone'
>;

export const createPurchaseOrderTableConfig = (
  i18n: I18n,
  locale: { dateFormat?: MoniteDateFormat },
  formatCurrencyToDisplay: (
    amountInMinorUnits: string | number,
    currency: CurrencyEnum,
    isCurrencyDisplayed?: boolean
  ) => string | null
): TableConfig<components['schemas']['PurchaseOrderResponseSchema']> => {
  const columns: TableColumnConfig<
    components['schemas']['PurchaseOrderResponseSchema']
  >[] = [
    {
      field: '__check__',
      type: 'checkboxSelection',
      headerName: '',
      width: TABLE_COLUMN_WIDTHS.CHECKBOX,
      sortable: false,
    },
    {
      field: 'document_id',
      sortable: false,
      headerName: t(i18n)`Number`,
      width: TABLE_COLUMN_WIDTHS.NUMBER,
      cellClassName: 'Monite-Cell-Highlight',
      renderCell: (
        params: GridRenderCellParams<
          components['schemas']['PurchaseOrderResponseSchema']
        >
      ) => {
        const purchaseOrder = params.row;
        return (
          <span className="Monite-TextOverflowContainer">
            {purchaseOrder.document_id}
          </span>
        );
      },
    },
    {
      field: 'status',
      sortable: false,
      headerName: t(i18n)`Status`,
      width: TABLE_COLUMN_WIDTHS.STATUS,
      renderCell: (
        params: GridRenderCellParams<
          components['schemas']['PurchaseOrderResponseSchema']
        >
      ) => <PurchaseOrderStatusChip status={params.value} />,
    },
    {
      field: 'counterpart_id',
      sortable: false,
      headerName: t(i18n)`Vendor`,
      width: 180,
      renderCell: (
        params: GridRenderCellParams<
          components['schemas']['PurchaseOrderResponseSchema']
        >
      ) => <CounterpartNameCellById counterpartId={params.value} />,
    },
    {
      field: 'created_at',
      type: 'date',
      headerName: t(i18n)`Created`,
      width: TABLE_COLUMN_WIDTHS.CREATED,
      renderCell: ({
        formattedValue,
      }: GridRenderCellParams<
        components['schemas']['PurchaseOrderResponseSchema']
      >) => formattedValue,
      valueFormatter: (value: unknown, _row) => {
        const dateValue =
          value as components['schemas']['PurchaseOrderResponseSchema']['created_at'];
        return i18n.date(dateValue, locale.dateFormat || undefined);
      },
    },
    {
      field: 'issued_at',
      type: 'date',
      headerName: t(i18n)`Issued`,
      width: TABLE_COLUMN_WIDTHS.ISSUED,
      renderCell: ({
        formattedValue,
      }: GridRenderCellParams<
        components['schemas']['PurchaseOrderResponseSchema']
      >) => formattedValue || <span className="mtw:opacity-40">-</span>,
      valueFormatter: (value: unknown, _row) => {
        const dateValue =
          value as components['schemas']['PurchaseOrderResponseSchema']['issued_at'];
        return dateValue
          ? i18n.date(dateValue, locale.dateFormat || undefined)
          : null;
      },
    },
    {
      field: 'amount',
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      headerName: t(i18n)`Total`,
      width: TABLE_COLUMN_WIDTHS.AMOUNT,
      valueGetter: (
        row: components['schemas']['PurchaseOrderResponseSchema']
      ) => {
        const { totalAmountMinor } = calculatePurchaseOrderTotals(row);
        return row.currency
          ? (formatCurrencyToDisplay(totalAmountMinor, row.currency) ?? '')
          : '';
      },
    },
  ];

  return {
    columns,
    defaultSort: {
      field: 'created_at',
      sort: 'desc',
    },
    defaultPageSize: PURCHASE_ORDER_CONSTANTS.DEFAULT_PAGE_SIZE,
    fieldOrder: DEFAULT_FIELD_ORDER,
    checkboxSelection: true,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
