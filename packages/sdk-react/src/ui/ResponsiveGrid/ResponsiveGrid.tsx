import { Button } from '@/ui/components/button';
import { Card, CardContent } from '@/ui/components/card';
import { Skeleton } from '@/ui/components/skeleton';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

interface ResponsiveGridProps<TData> {
  data: TData[];
  renderItem: (item: TData, index: number) => React.ReactNode;
  loading?: boolean;
  // Infinite scroll props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  error?: Error | null;
  // Minimum item width for auto-sizing (default: 200px)
  minItemWidth?: number;
  onItemClick?: (item: TData, index: number) => void;
  // Custom no items overlay component
  noItemsOverlay?: React.ComponentType;
  // Custom loading skeleton component
  loadingSkeleton?: React.ComponentType;
  skeletonCount?: number;
  // Auto-load more when scrolling (default: true)
  autoLoadMore?: boolean;
  // Custom scroll container for intersection observer (default: null = viewport)
  scrollContainer?: React.RefObject<Element> | (() => Element | null);
}

/**
 * A reusable ResponsiveGrid component that automatically adjusts column count based on available width
 * and provides infinite scroll functionality for large datasets.
 *
 * Features include:
 * - Responsive Grid Layout: Automatically calculates optimal number of columns based on container width
 * - Infinite Scroll: Supports both automatic and manual loading of additional data
 * - Loading States: Customizable loading skeletons and error handling
 *
 * @template TData - The type of data items in the grid
 *
 * @param data - Array of data items to display in the grid
 * @param renderItem - Function to render each data item (item, index) => ReactNode
 * @param loading - Whether the initial data is loading
 * @param hasNextPage - Whether there are more pages of data available
 * @param isFetchingNextPage - Whether currently fetching the next page
 * @param fetchNextPage - Function to call when loading more data
 * @param error - Error object if data fetching failed
 * @param minItemWidth - Minimum width for each grid item (default: 200px)
 * @param onItemClick - Optional click handler for grid items
 * @param noItemsOverlay - Custom component to show when no data is available
 * @param loadingSkeleton - Custom component to show during loading
 * @param skeletonCount - Number of skeleton items to show during loading (default: 12)
 * @param autoLoadMore - Whether to automatically load more data on scroll (default: true)
 * @param scrollContainer - Custom scroll container for intersection observer (default: null = viewport)
 *
 * @example
 * ```tsx
 * <ResponsiveGrid
 *   data={receipts}
 *   renderItem={(receipt) => <ReceiptCard receipt={receipt} />}
 *   loading={isLoading}
 *   hasNextPage={hasNextPage}
 *   isFetchingNextPage={isFetchingNextPage}
 *   fetchNextPage={fetchNextPage}
 *   minItemWidth={300}
 *   onItemClick={(receipt) => openReceiptDetails(receipt.id)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom loading skeleton and empty state
 * <ResponsiveGrid
 *   data={products}
 *   renderItem={(product) => <ProductCard product={product} />}
 *   loadingSkeleton={CustomSkeleton}
 *   noItemsOverlay={CustomEmptyState}
 *   autoLoadMore={false} // Manual load more only
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom scroll container (e.g., inside a dialog or modal)
 * const scrollContainerRef = useRef<HTMLDivElement>(null);
 *
 * return (
 *   <div ref={scrollContainerRef} className="overflow-auto h-full">
 *     <ResponsiveGrid
 *       data={items}
 *       renderItem={(item) => <ItemCard item={item} />}
 *       scrollContainer={scrollContainerRef}
 *       hasNextPage={hasNextPage}
 *       fetchNextPage={fetchNextPage}
 *     />
 *   </div>
 * );
 * ```
 */
function ResponsiveGridComponent<TData>({
  data,
  renderItem,
  loading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  error,
  minItemWidth = 200,
  onItemClick,
  noItemsOverlay: NoItemsOverlay,
  loadingSkeleton: LoadingSkeleton,
  skeletonCount = 12,
  autoLoadMore = true,
  scrollContainer,
}: ResponsiveGridProps<TData>) {
  const { i18n } = useLingui();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for auto-loading more items
  useEffect(() => {
    if (!autoLoadMore || !fetchNextPage || !hasNextPage || isFetchingNextPage) {
      return;
    }

    // Get the scroll container element
    const getScrollRoot = () => {
      if (!scrollContainer) return null;
      if (typeof scrollContainer === 'function') {
        return scrollContainer();
      }
      return scrollContainer.current;
    };

    const scrollRoot = getScrollRoot();

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        root: scrollRoot,
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [
    autoLoadMore,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    scrollContainer,
    data.length,
  ]);

  // Auto-columns grid style that automatically adjusts the number of columns based on the available width, given a minimum item width
  const autoColumnsGridStyle = useMemo(
    () =>
      ({
        display: 'grid',
        // eslint-disable-next-line lingui/no-unlocalized-strings
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
        gap: '1rem',
      }) as React.CSSProperties,
    [minItemWidth]
  );

  const handleItemClick = useCallback(
    (item: TData, index: number) => {
      onItemClick?.(item, index);
    },
    [onItemClick]
  );

  const SkeletonComponent = useMemo(
    () => LoadingSkeleton || DefaultLoadingSkeleton,
    [LoadingSkeleton]
  );

  const skeletonItems = useMemo(
    () =>
      Array.from({ length: skeletonCount }, (_, index) => (
        <div key={`loading-item-${index}`} className="mtw:aspect-square">
          <div className="mtw:w-full mtw:h-full">
            <SkeletonComponent />
          </div>
        </div>
      )),
    [skeletonCount, SkeletonComponent]
  );

  // Early return for loading state
  if (loading && data.length === 0) {
    return (
      <div className="mtw:flex mtw:flex-col">
        <div style={autoColumnsGridStyle}>{skeletonItems}</div>
      </div>
    );
  }

  // Early return for empty state
  if (data.length === 0) {
    return (
      <div className="mtw:flex mtw:flex-col">
        <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-8">
          {NoItemsOverlay ? (
            <NoItemsOverlay />
          ) : (
            <p className="mtw:text-muted-foreground">{t(i18n)`No results.`}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mtw:flex mtw:flex-col">
      <div className="mtw:flex mtw:flex-col">
        <div style={autoColumnsGridStyle}>
          {data.map((item, index) => (
            <div
              key={(item as any)?.id || `grid-item-${index}`}
              className="mtw:cursor-pointer mtw:transition-transform"
              onClick={() => handleItemClick(item, index)}
            >
              <div className="mtw:w-full mtw:h-full">
                {renderItem(item, index)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite scroll load more section */}
      {(hasNextPage || isFetchingNextPage) && (
        <div className="mtw:flex-shrink-0 mtw:mt-4">
          {autoLoadMore ? (
            <div className="mtw:min-h-[1px]">
              {isFetchingNextPage && (
                <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-4">
                  <div className="mtw:flex mtw:items-center mtw:space-x-2">
                    <div className="mtw:animate-spin mtw:rounded-full mtw:h-4 mtw:w-4 mtw:border-b-2 mtw:border-primary"></div>
                    <p className="mtw:text-muted-foreground mtw:text-sm">
                      {t(i18n)`Loading more...`}
                    </p>
                  </div>
                </div>
              )}
              {/* Trigger element positioned at the very end - only when not fetching */}
              {!isFetchingNextPage && (
                <div ref={loadMoreRef} className="mtw:h-[1px] mtw:w-full" />
              )}
            </div>
          ) : (
            <InfiniteScrollManualLoadMore
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage || (() => {})}
              error={error}
            />
          )}
        </div>
      )}

      {/* Show error state separately if needed */}
      {error && !hasNextPage && (
        <div className="mtw:flex-shrink-0 mtw:mt-4">
          <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-4">
            <p className="mtw:text-destructive mtw:text-sm">
              {t(i18n)`Failed to load more items`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const MemoizedResponsiveGrid = memo(ResponsiveGridComponent);
// eslint-disable-next-line lingui/no-unlocalized-strings
MemoizedResponsiveGrid.displayName = 'ResponsiveGrid';

export const ResponsiveGrid = MemoizedResponsiveGrid as <TData>(
  props: ResponsiveGridProps<TData>
) => JSX.Element;

const InfiniteScrollManualLoadMore = memo(
  ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
  }: {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    error?: Error | null;
  }) => {
    const { i18n } = useLingui();

    if (error) {
      return (
        <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-4">
          <p className="mtw:text-destructive mtw:text-sm">
            {t(i18n)`Failed to load more items`}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            className="mtw:ml-2"
          >
            {t(i18n)`Retry`}
          </Button>
        </div>
      );
    }

    if (!hasNextPage) {
      return (
        <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-4">
          <p className="mtw:text-muted-foreground mtw:text-sm">
            {t(i18n)`No more items to load`}
          </p>
        </div>
      );
    }

    return (
      <div className="mtw:flex mtw:items-center mtw:justify-center mtw:py-4">
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? t(i18n)`Loading more...` : t(i18n)`Load more`}
        </Button>
      </div>
    );
  }
);
// eslint-disable-next-line lingui/no-unlocalized-strings
InfiniteScrollManualLoadMore.displayName = 'InfiniteScrollManualLoadMore';

const DefaultLoadingSkeleton = memo(() => (
  <Card className="mtw:h-full mtw:w-full">
    <CardContent className="mtw:p-4 mtw:h-full mtw:flex mtw:flex-col">
      <div className="mtw:space-y-3 mtw:flex-1 mtw:flex mtw:flex-col">
        <Skeleton className="mtw:flex-1 mtw:w-full mtw:min-h-[100px]" />
        <Skeleton className="mtw:h-4 mtw:w-3/4" />
        <Skeleton className="mtw:h-4 mtw:w-1/2" />
      </div>
    </CardContent>
  </Card>
));
// eslint-disable-next-line lingui/no-unlocalized-strings
DefaultLoadingSkeleton.displayName = 'DefaultLoadingSkeleton';
