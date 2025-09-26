import { useGetMailboxes } from '../hooks/useGetMailboxes';
import { useGetReceipts } from '../hooks/useGetReceipts';
import { useInfiniteGetReceipts } from '../hooks/useInfiniteGetReceipts';
import { useUploadNewReceiptFile } from '../hooks/useUploadNewReceiptFile';
import { ReceiptCard, ReceiptCardSkeleton } from './ReceiptCard';
import { components } from '@/api/schema';
import { useDebounce } from '@/core/hooks';
import { useEntityUserByAuthToken, useEntityUsersByIds } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { ResponsiveGrid, useResponsiveGridState } from '@/ui/ResponsiveGrid';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { FileUpload } from '@/ui/components/file-upload';
import { Input } from '@/ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { Separator } from '@/ui/components/separator';
import { TabBar, TabBarList, TabBarTrigger } from '@/ui/components/tab-bar';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CopyIcon, FocusIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FILTER_TYPE_SEARCH = 'search';
const FILTER_TYPE_HAS_TRANSACTION = 'has_transaction';

type HasTransactionFilterValue = 'all' | 'matched' | 'unmatched';

type ReceiptsFilters = Partial<{
  [FILTER_TYPE_SEARCH]: string;
  [FILTER_TYPE_HAS_TRANSACTION]: HasTransactionFilterValue;
}>;

export const ReceiptsInbox = ({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) => {
  const { i18n } = useLingui();

  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: user } = useEntityUserByAuthToken();

  const {
    data: isReadReceiptsAllowed,
    isLoading: isReadReceiptsAllowedLoading,
  } = useIsActionAllowed({
    method: 'receipt',
    action: 'read',
    entityUserId: user?.id,
  });

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
    refetch,
    error,
  } = useInfiniteGetReceipts(
    {
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
      // created_by_entity_user_id: user?.id, // TODO: add this to filter to only show receipts for the current user. pending API to support this. See DEV-16314.
    },
    isReadReceiptsAllowed
  );

  const errorState = useMemo(() => {
    if (!error) return null;
    return new Error('Failed to load receipts');
  }, [error]);

  // Extract unique user IDs from receipts data
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
  const { data: usersData } = useEntityUsersByIds(uniqueUserIds);

  // Create user data map
  const userDataMap = useMemo(() => {
    if (!usersData?.data) return new Map();

    const userMap = new Map();
    usersData.data.forEach((user) => {
      userMap.set(user.id, user);
    });

    return userMap;
  }, [usersData?.data]);

  const { receipts: unmatchedReceipts } = useGetReceipts(
    {
      has_transaction: false,
      limit: 1,
    },
    isReadReceiptsAllowed
  );

  const { receiptUploadFromFileMutation } = useUploadNewReceiptFile();

  const { data: mailboxexData } = useGetMailboxes(isReadReceiptsAllowed);
  const receiptsEmailAddress = mailboxexData?.data?.find(
    (mailbox) =>
      mailbox.related_object_type === 'receipt' && mailbox.status === 'active'
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

  const handleReceiptUpload = (files: File[]) => {
    files.forEach((file) => {
      receiptUploadFromFileMutation.mutateAsync({
        file,
      });
    });
    setUploadMenuOpen(false);
  };

  const handleChangeTab = useCallback(
    (value: HasTransactionFilterValue) => {
      onFilterChange(FILTER_TYPE_HAS_TRANSACTION, value);
      setSearchInputValue('');
      // Scroll to top when changing tabs
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      });
    },
    [onFilterChange]
  );

  const getPageContent = useCallback(() => {
    if (isReadReceiptsAllowedLoading) {
      <LoadingPage />;
    }
    if (!isReadReceiptsAllowed) {
      <AccessRestriction />;
    }
    return (
      <>
        {/* Fixed Tabs and Search Section */}
        <div className="mtw:space-y-4">
          <div className="mtw:flex mtw:w-full mtw:relative">
            <TabBar
              defaultValue="all"
              onValueChange={(value: string) =>
                handleChangeTab(value as HasTransactionFilterValue)
              }
              className="mtw:flex-1"
            >
              <TabBarList>
                <TabBarTrigger value="all">{t(i18n)`All`}</TabBarTrigger>
                <TabBarTrigger value="unmatched">
                  <div className="mtw:flex mtw:items-center">
                    {t(i18n)`Unmatched`}
                    {unmatchedReceipts?.length &&
                    unmatchedReceipts?.length > 0 ? (
                      <div className="mtw:ml-1 mtw:rounded-2xl mtw:w-3 mtw:h-3 mtw:bg-primary">
                        &nbsp;
                      </div>
                    ) : null}
                  </div>
                </TabBarTrigger>
                <TabBarTrigger value="matched">{t(
                  i18n
                )`Matched`}</TabBarTrigger>
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
        </div>

        <div
          ref={scrollContainerRef}
          className="mtw:flex-1 mtw:overflow-auto mtw:px-6 mtw:py-4"
        >
          <ResponsiveGrid
            data={receipts || []}
            renderItem={(receipt) => (
              <ReceiptCard
                receipt={receipt}
                user={userDataMap.get(receipt.created_by_entity_user_id)}
              />
            )}
            onItemClick={handleReceiptClick}
            isItemClickable={(receipt) => receipt.ocr_status !== 'processing'}
            minItemWidth={240}
            loadingSkeleton={ReceiptCardSkeleton}
            skeletonCount={6}
            loading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            autoLoadMore={true}
            error={errorState}
            scrollContainer={scrollContainerRef}
            noItemsOverlay={() => (
              <GetNoRowsOverlay
                isLoading={isLoading}
                dataLength={receipts?.length || 0}
                isFiltering={
                  filters[FILTER_TYPE_HAS_TRANSACTION] === 'all'
                    ? false
                    : !!filters[FILTER_TYPE_HAS_TRANSACTION]
                }
                isSearching={!!filters[FILTER_TYPE_SEARCH]}
                isError={!!error}
                entityName={t(i18n)`Receipts`}
                refetch={refetch}
                type="no-data=receipts"
                noDataDescription1={t(i18n)`No receipts yet`}
                noDataDescription2={t(i18n)`Uploaded receipts will appear here`}
              />
            )}
          />
        </div>
      </>
    );
  }, [
    isReadReceiptsAllowedLoading,
    isReadReceiptsAllowed,
    i18n,
    unmatchedReceipts?.length,
    receiptsEmailAddress,
    searchInputValue,
    handleSearchChange,
    receipts,
    handleReceiptClick,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    errorState,
    handleChangeTab,
    userDataMap,
    filters,
    error,
    refetch,
  ]);

  return (
    <DialogContent
      fullScreen
      showCloseButton={false}
      className="mtw:flex mtw:flex-col mtw:h-screen mtw:p-0"
    >
      <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:px-6 mtw:h-full">
        <DialogHeader className="mtw:py-4">
          <div className="mtw:flex mtw:items-center mtw:gap-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
            >
              <XIcon className="mtw:size-6" />
            </Button>
            <DialogTitle className="mtw:font-semibold mtw:text-2xl">
              {t(i18n)`Receipt inbox`}
            </DialogTitle>
            <DialogDescription className="mtw:sr-only">{t(
              i18n
            )`Receipt inbox`}</DialogDescription>

            <Popover
              open={isUploadMenuOpen}
              onOpenChange={setUploadMenuOpen}
              modal={true}
            >
              <PopoverTrigger asChild>
                <Button variant="secondary" className="mtw:ml-auto">
                  <FocusIcon className="mtw:size-6" />
                  {t(i18n)`Scan receipts`}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="mtw:w-auto mtw:min-w-[550px] mtw:border-none"
              >
                <div className="mtw:p-4 mtw:w-[550px] mtw:space-y-4">
                  <div className="mtw:space-y-2">
                    <p className="mtw:text-xl mtw:font-semibold">
                      {t(i18n)`Upload receipts`}
                    </p>
                    <p>
                      {t(
                        i18n
                      )`Upload card transaction receipts and we'll automatically match them to the correct transaction. `}
                    </p>
                  </div>
                  <FileUpload
                    onFileUpload={handleReceiptUpload}
                    multiple={true}
                    height="200px"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        {getPageContent()}
      </div>
    </DialogContent>
  );
};
