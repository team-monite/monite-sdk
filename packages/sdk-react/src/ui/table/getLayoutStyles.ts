import type {
  LayoutStyles,
  LayoutStylesParams,
  PaginationLayout,
  PaginationPosition,
} from './TablePagination.types';

export type { PaginationLayout, PaginationPosition };

/**
 * Calculates flexbox layout styles for table pagination controls based on layout configuration.
 *
 * @param params - Layout configuration parameters
 * @param params.layout - The pagination layout mode: 'default', 'reversed', 'centered', or 'custom'
 * @param params.navigationPosition - Position of navigation arrows (only used when layout is 'custom')
 * @param params.pageSizePosition - Position of page size selector (only used when layout is 'custom')
 * @param params.hasPageSizeSelect - Whether the page size selector is visible
 * @returns Layout styles object with justifyContent, flexDirection, and gap properties
 */
export function getLayoutStyles({
  layout,
  navigationPosition,
  pageSizePosition,
  hasPageSizeSelect,
}: LayoutStylesParams): LayoutStyles {
  if (!hasPageSizeSelect) {
    return { justifyContent: 'center', flexDirection: 'row', gap: undefined };
  }

  if (layout === 'custom') {
    if (navigationPosition === 'center' && pageSizePosition === 'center') {
      return { justifyContent: 'center', flexDirection: 'row', gap: 3 };
    }
    if (navigationPosition === 'left' && pageSizePosition === 'left') {
      return { justifyContent: 'flex-start', flexDirection: 'row', gap: 3 };
    }
    if (navigationPosition === 'right' && pageSizePosition === 'right') {
      return { justifyContent: 'flex-end', flexDirection: 'row-reverse', gap: 3 };
    }
    if (navigationPosition === 'left' && pageSizePosition === 'right') {
      return { justifyContent: 'space-between', flexDirection: 'row', gap: undefined };
    }
    if (navigationPosition === 'right' && pageSizePosition === 'left') {
      return { justifyContent: 'space-between', flexDirection: 'row-reverse', gap: undefined };
    }
    if (navigationPosition === 'center') {
      const flexDir = pageSizePosition === 'left' ? 'row-reverse' : 'row';
      return { justifyContent: 'space-around', flexDirection: flexDir, gap: undefined };
    }
    if (pageSizePosition === 'center') {
      const flexDir = navigationPosition === 'left' ? 'row' : 'row-reverse';
      return { justifyContent: 'space-around', flexDirection: flexDir, gap: undefined };
    }
  }

  switch (layout) {
    case 'reversed':
      return { justifyContent: 'space-between', flexDirection: 'row-reverse', gap: undefined };
    case 'centered':
      return { justifyContent: 'center', flexDirection: 'row', gap: 3 };
    case 'default':
    default:
      return { justifyContent: 'space-between', flexDirection: 'row', gap: undefined };
  }
}
