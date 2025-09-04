import { TransactionDetails } from '../TransactionDetails';
import { useGetTransactions } from '../hooks/useTransactions';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STARTED_AT,
  FILTER_TYPE_USER,
} from './consts';
import type { FilterTypes } from './types';
import { components } from '@/api';
import { UserDisplayCell } from '@/components/UserDisplayCell/UserDisplayCell';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies, useDataTableState } from '@/core/hooks';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { AccessRestriction } from '@/ui/accessRestriction';
import { DataTable } from '@/ui/components/data-table';
import { Input } from '@/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import { LoadingPage } from '@/ui/loadingPage';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DatePicker } from '@mui/x-date-pickers';
import { ColumnDef } from '@tanstack/react-table';
import { formatISO, addDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const ManagerTransactionsTable = () => {
  const { api, componentSettings, locale } = useMoniteContext();
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { formatCurrencyToDisplay } = useCurrencies();

  const [selectedTransaction, setSelectedTransaction] = useState<
    components['schemas']['TransactionResponse'] | undefined
  >(undefined);
  const [detailsModalOpened, setDetailsModalOpened] = useState<boolean>(false);

  const { data: user } = useEntityUserByAuthToken();

  const {
    data: isTransactionReadSupported,
    isLoading: isTransaxtionReadSupportedLoading,
  } = useIsActionAllowed({
    method: 'transaction',
    action: 'read',
    entityUserId: user?.id,
  });

  // TODO: refactor to use proper check of Expense Management manager
  const { data: isUserReadSupported, isLoading: isUserReadSupportedLoading } =
    useIsActionAllowed({
      method: 'entity_user',
      action: 'read',
      entityUserId: user?.id,
    });

  const {
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
    sortModel,
    filters,
    onFilterChange,
    currentPaginationToken,
    updateApiResponse,
    pageCount,
  } = useDataTableState<
    components['schemas']['TransactionCursorFields'],
    FilterTypes
  >({
    initialPageSize: componentSettings.expenses.pageSizeOptions[0] ?? 20,
    initialSort: {
      field: 'started_at',
      direction: 'desc',
    },
    filters: {
      initialValue: {
        [FILTER_TYPE_SEARCH]: '',
        [FILTER_TYPE_STARTED_AT]: null,
        [FILTER_TYPE_USER]: null,
      },
    },
  });

  // Local state for search input (immediate UI update)
  const [searchInputValue, setSearchInputValue] = useState(
    filters[FILTER_TYPE_SEARCH] || ''
  );

  // Debounced search value (delayed API call)
  const debouncedSearchValue = useDebounce(searchInputValue, 300);

  // Update the actual filter when debounced value changes
  useEffect(() => {
    onFilterChange(FILTER_TYPE_SEARCH, debouncedSearchValue);
  }, [debouncedSearchValue, onFilterChange]);

  // Sync local input value with filter value when filter changes externally
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSearchInputValue(filters[FILTER_TYPE_SEARCH] || '');
  }, [filters[FILTER_TYPE_SEARCH]]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const {
    transactions,
    response: transactionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetTransactions(
    {
      sort: sortModel.field,
      order: sortModel.sort,
      limit: pagination.pageSize,
      // Don't use pagination token when we have a search term and we're on the first page
      pagination_token:
        filters[FILTER_TYPE_SEARCH] && pagination.pageIndex === 0
          ? undefined
          : currentPaginationToken || undefined,
      merchant_name__icontains: filters[FILTER_TYPE_SEARCH] || undefined,
      started_at__gt: filters[FILTER_TYPE_STARTED_AT]
        ? formatISO(filters[FILTER_TYPE_STARTED_AT] as Date)
        : undefined,
      started_at__lt: filters[FILTER_TYPE_STARTED_AT]
        ? formatISO(addDays(filters[FILTER_TYPE_STARTED_AT] as Date, 1))
        : undefined,
      entity_user_id__in: filters[FILTER_TYPE_USER]
        ? [filters[FILTER_TYPE_USER]]
        : undefined,
    },
    isTransactionReadSupported === true && isUserReadSupported === true
  );

  // Update the pagination hook with the latest API response
  useEffect(() => {
    updateApiResponse(transactionsResponse);
  }, [transactionsResponse, updateApiResponse]);

  // Extract unique user IDs from transactions data
  const uniqueUserIds = useMemo(() => {
    if (!transactions) return [];

    const userIds = new Set<string>();

    transactions.forEach((transaction) => {
      if (transaction.entity_user_id) {
        userIds.add(transaction.entity_user_id);
      }
    });

    return Array.from(userIds);
  }, [transactions]);

  // Fetch user details for the unique user IDs
  const { data: usersData } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: {
        id__in: uniqueUserIds.length > 0 ? uniqueUserIds : undefined,
        limit: 100,
      },
    },
    {
      enabled: uniqueUserIds.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Create user data map and filter array
  const { userDataMap, users } = useMemo(() => {
    if (!usersData?.data) return { userDataMap: new Map(), users: [] };

    const userMap = new Map();
    const usersArray = usersData.data.map((user) => {
      userMap.set(user.id, user);
      return {
        id: user.id,
        name:
          `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
          user.email ||
          // eslint-disable-next-line lingui/no-unlocalized-strings
          `User ${user.id.slice(0, 8)}...`,
      };
    });

    return { userDataMap: userMap, users: usersArray };
  }, [usersData?.data]);

  const UserCell = useMemo(() => {
    return ({ userId }: { userId: string | null }) => {
      if (!userId) return <span>-</span>;

      const userData = userDataMap.get(userId);
      if (!userData) return <span>-</span>;

      return (
        <UserDisplayCell
          user={userData}
          showAvatar={false}
          variant="inline"
          typographyVariant="inherit"
        />
      );
    };
  }, [userDataMap]);

  const columns: ColumnDef<components['schemas']['TransactionResponse']>[] =
    useMemo(
      () => [
        {
          header: t(i18n)`Employee`,
          accessorKey: 'employee',
          cell: ({ row }) => (
            <UserCell userId={row.original.entity_user_id ?? null} />
          ),
          enableSorting: false,
        },
        {
          header: t(i18n)`Merchant`,
          accessorKey: 'merchant_name',
          cell: ({ row }) => row.getValue('merchant_name'),
        },
        {
          header: t(i18n)`Date`,
          accessorKey: 'started_at',
          cell: ({ row }) => {
            const date = row.original.started_at;
            if (!date) {
              return '-';
            }
            return i18n.date(date, locale.dateTimeFormat);
          },
        },
        {
          header: t(i18n)`Payment Method`,
          id: 'payment_method',
          accessorFn: (row) => {
            const paymentMethod = row.payment_method;
            if (!paymentMethod) {
              return '-';
            }
            if (paymentMethod?.type === 'card') {
              const last4 = paymentMethod.details?.last4 ?? '••••';
              return t(i18n)`Card ••••${last4}`;
            }
            if (paymentMethod.type === 'bank_account') {
              const iban = paymentMethod.details?.iban;
              const maskedIban =
                typeof iban === 'string' && iban.length > 4
                  ? `••••${iban.slice(-4)}`
                  : '—';
              return t(i18n)`Bank ${maskedIban}`;
            }
            return '—';
          },
          cell: ({ row }) => row.getValue('payment_method'),
          enableSorting: false,
        },
        {
          header: t(i18n)`Amount`,
          accessorKey: 'amount',
          cell: ({ row }) => {
            return (
              formatCurrencyToDisplay(
                row.original.merchant_amount,
                row.original.merchant_currency
              ) || '-'
            );
          },
        },
      ],
      [UserCell, formatCurrencyToDisplay, i18n, locale.dateTimeFormat]
    );

  const openDetailsModal = useCallback(
    (transaction: components['schemas']['TransactionResponse']) => {
      if (hasSelectedText()) {
        return;
      }
      setSelectedTransaction(transaction);
      setDetailsModalOpened(true);
    },
    []
  );

  const closeDetailsModal = useCallback(() => {
    setSelectedTransaction(undefined);
    setDetailsModalOpened(false);
  }, []);

  if (isTransaxtionReadSupportedLoading || isUserReadSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isTransactionReadSupported || !isUserReadSupported) {
    return <AccessRestriction />;
  }

  return (
    <div className="mtw:flex mtw:flex-col mtw:h-full mtw:gap-4">
      <div className="mtw:flex mtw:items-center mtw:flex-shrink-0 mtw:gap-4 mtw:justify-between">
        <Input
          placeholder={t(i18n)`Search by merchant`}
          value={searchInputValue}
          onChange={(event) => setSearchInputValue(event.target.value)}
          className="mtw:max-w-sm"
        />
        <div className="mtw:flex mtw:items-center mtw:gap-4">
          <Select
            value={filters[FILTER_TYPE_USER] || 'all'}
            onValueChange={(value) =>
              onFilterChange(FILTER_TYPE_USER, value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="mtw:w-[200px]">
              <SelectValue placeholder={t(i18n)`Filter by employee`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(i18n)`All employees`}</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            className="Monite-ExpensesStartedAtFilter Monite-FilterControl Monite-DateFilterControl"
            onChange={(value, error) => {
              if (error.validationError) {
                return;
              }
              onFilterChange(FILTER_TYPE_STARTED_AT, value as Date | null);
            }}
            slotProps={{
              textField: {
                variant: 'standard',
                placeholder: t(i18n)`Filter by date`,
                InputProps: {
                  sx: {
                    '&::placeholder': {
                      opacity: 1,
                      color: 'text.primary',
                    },
                    '& input::placeholder': {
                      opacity: 1,
                      color: 'text.primary',
                    },
                  },
                },
              },
              popper: {
                container: root,
              },
              dialog: {
                container: root,
              },
              actionBar: {
                actions: ['clear', 'today'],
              },
            }}
            views={['year', 'month', 'day']}
          />
        </div>
      </div>

      <div className="mtw:flex-1 mtw:min-h-0">
        <DataTable
          columns={columns}
          data={transactions || []}
          loading={isLoading}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          sorting={sorting}
          onSortingChange={onSortingChange}
          pageCount={pageCount}
          onRowClick={openDetailsModal}
          noRowsOverlay={() => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={transactions?.length || 0}
              isFiltering={
                !!filters[FILTER_TYPE_STARTED_AT] || !!filters[FILTER_TYPE_USER]
              }
              isSearching={!!filters[FILTER_TYPE_SEARCH]}
              isError={!!error}
              refetch={refetch}
              entityName={t(i18n)`Expenses`}
              noDataTitle={t(i18n)`No expenses yet`}
              noDataDescription1={t(i18n)`You don’t have any expenses yet`}
              noDataDescription2={t(i18n)`Your expenses will appear here`}
              filterTitle={t(i18n)`No expenses found`}
              filterDescription1={t(
                i18n
              )`Try adjusting your search or filter criteria`}
              type="no-data"
            />
          )}
        />
      </div>
      <TransactionDetails
        isManagerView={true}
        transaction={selectedTransaction}
        open={detailsModalOpened}
        onClose={closeDetailsModal}
      />
    </div>
  );
};
