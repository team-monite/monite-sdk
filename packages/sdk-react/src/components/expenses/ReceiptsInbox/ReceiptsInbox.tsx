import { useMailboxes } from '../hooks/useMailboxes';
import { useInfiniteGetReceipts } from '../hooks/useReceipts';
import { ReceiptCard, ReceiptCardSkeleton } from './ReceiptCard';
import { FILTER_TYPE_HAS_TRANSACTION, FILTER_TYPE_SEARCH } from './consts';
import { ReceiptsFilters } from './types';
import { components } from '@/api/schema';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useDebounce } from '@/core/hooks';
import { PageHeader } from '@/ui/PageHeader';
import { ResponsiveGrid, useResponsiveGridState } from '@/ui/ResponsiveGrid';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Separator } from '@/ui/components/separator';
import { TabBar, TabBarList, TabBarTrigger } from '@/ui/components/tab-bar';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CopyIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const ReceiptsInbox = () => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { filters, onFilterChange } = useResponsiveGridState<ReceiptsFilters>({
    filters: {
      initialValue: {
        [FILTER_TYPE_SEARCH]: '',
        [FILTER_TYPE_HAS_TRANSACTION]: 'all',
      },
    },
  });

  // Local state for search input (immediate UI update)
  const [searchInputValue, setSearchInputValue] = useState(
    filters[FILTER_TYPE_SEARCH] || ''
  );

  // Debounced search value (delayed API call)
  const debouncedSearchValue = useDebounce(searchInputValue, 500);

  // Update the actual filter when debounced value changes
  useEffect(() => {
    onFilterChange(FILTER_TYPE_SEARCH, debouncedSearchValue);
  }, [debouncedSearchValue, onFilterChange]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(event.target.value);
    },
    []
  );

  const {
    receipts,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
  } = useInfiniteGetReceipts({
    limit: 12,
    sort: 'created_at',
    order: 'desc',
    document_id__icontains: filters[FILTER_TYPE_SEARCH] || undefined, // TODO: placeholder search on document_id. replace with search on merchant_name, once API query param is ready
    has_transaction:
      filters[FILTER_TYPE_HAS_TRANSACTION] === 'matched'
        ? true
        : filters[FILTER_TYPE_HAS_TRANSACTION] === 'unmatched'
          ? false
          : undefined,
  });

  const errorState = useMemo(() => {
    if (!error) return null;
    return new Error('Failed to load receipts');
  }, [error]);

  // Extract unique user IDs from transactions data
  const uniqueUserIds = useMemo(() => {
    if (!receipts || receipts.length === 0) return [];

    const userIds = new Set<string>();

    receipts.forEach((receipt) => {
      if (receipt.created_by_entity_user_id) {
        userIds.add(receipt.created_by_entity_user_id);
      }
    });

    return Array.from(userIds);
  }, [receipts]);

  // Fetch user details for the unique user IDs
  const { data: usersData } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: {
        id__in: uniqueUserIds.length > 0 ? uniqueUserIds : undefined,
      },
    },
    {
      enabled: uniqueUserIds.length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes - user data rarely changes
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch if data is fresh
    }
  );
  const userDataMap = useMemo(() => {
    if (!usersData?.data) return new Map();

    const userMap = new Map();
    usersData.data.forEach((user) => {
      userMap.set(user.id, user);
    });

    return userMap;
  }, [usersData?.data]);

  const { data: mailboxexData } = useMailboxes();
  const receiptsEmailAddress = mailboxexData?.data?.find(
    (mailbox) => mailbox.related_object_type === 'receipt'
  )?.mailbox_full_address;

  const handleReceiptClick = useCallback(
    (
      receipt: components['schemas']['ReceiptResponseSchema'],
      index: number
    ) => {
      console.log('Clicked receipt:', receipt, 'at index:', index);
      // TODO: Handle receipt click - open details modal
    },
    []
  );

  // TODO: make this component be a full screen modal

  return (
    <div
      className="mtw:flex mtw:flex-col mtw:gap-6 mtw:h-full Monite-ExpensesPage"
      data-testid="Monite-ExpensesPage"
    >
      <div className="mtw:flex-shrink-0">
        <PageHeader title={t(i18n)`Receipt inbox`} />
      </div>

      <div className="mtw:pt-5 mtw:md:pt-0 mtw:flex mtw:w-full mtw:relative">
        <TabBar
          defaultValue="all"
          onValueChange={useCallback(
            (value: string) => {
              setSearchInputValue('');
              onFilterChange(FILTER_TYPE_HAS_TRANSACTION, value);
            },
            [onFilterChange]
          )}
          className="mtw:flex-1"
        >
          <TabBarList>
            <TabBarTrigger value="all">{t(i18n)`All`}</TabBarTrigger>
            <TabBarTrigger value="matched">{t(i18n)`Matched`}</TabBarTrigger>
            <TabBarTrigger value="unmatched">{t(
              i18n
            )`Unmatched`}</TabBarTrigger>
          </TabBarList>
        </TabBar>
        {receiptsEmailAddress && (
          <div className="mtw:flex mtw:flex-col">
            <div className="mtw:absolute mtw:-top-4 mtw:right-0 mtw:md:relative mtw:md:top-auto mtw:md:right-auto mtw:flex-1 mtw:items-center mtw:flex mtw:gap-1 mtw:text-sm mtw:md:pl-1">
              <span className="mtw:text-neutral-50">{t(
                i18n
              )`Inbox address:`}</span>
              <a href={`mailto:${receiptsEmailAddress}`}>
                {receiptsEmailAddress}
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(receiptsEmailAddress);
                }}
                aria-label={t(i18n)`Copy inbox email address`}
              >
                <CopyIcon />
              </Button>
            </div>
            <Separator />
          </div>
        )}
      </div>

      <Input
        placeholder={t(i18n)`Search by Document ID`}
        value={searchInputValue}
        onChange={handleSearchChange}
        className="mtw:max-w-sm"
      />

      <div className="mtw:flex-1">
        <ResponsiveGrid
          data={receipts || []}
          renderItem={(receipt) => (
            <ReceiptCard
              receipt={receipt}
              user={userDataMap.get(receipt.created_by_entity_user_id)}
            />
          )}
          onItemClick={handleReceiptClick}
          minItemWidth={240}
          loadingSkeleton={ReceiptCardSkeleton}
          skeletonCount={6}
          loading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          autoLoadMore={true}
          error={errorState}
        />
      </div>
    </div>
  );
};
