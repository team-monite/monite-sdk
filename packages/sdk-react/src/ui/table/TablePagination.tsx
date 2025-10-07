import { forwardRef } from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

import './TablePagination.theme';
import {
  Box,
  Grid,
  GridProps,
  IconButton,
  MenuItem,
  Select,
  SelectProps,
  Typography,
} from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

import { getLayoutStyles } from './getLayoutStyles';
import type { PaginationLayout, PaginationPosition } from './TablePagination.types';

const componentName = 'MoniteTablePagination' as const;
const DEFAULT_PAGE_SIZE = 10 as const;

export type PaginationModel<T> = {
  pageSize: number;
  page: T | null;
};

interface MoniteTablePaginationSlotProps {
  slotProps?: {
    pageSizeSelect?: Omit<
      SelectProps,
      'value' | 'defaultValue' | 'aria-label' | 'ref' | 'components'
    >;
  };
}

interface MoniteTablePaginationRootSlotProps {
  pageSizeOptions?: number[];
}

interface MoniteTablePaginationLayoutProps {
  /**
   * Controls the layout of pagination controls.
   * - 'default': Navigation arrows on left, page size selector on right
   * - 'reversed': Page size selector on left, navigation arrows on right
   * - 'centered': Both controls centered
   * - 'custom': Use navigationPosition and pageSizePosition for fine-grained control
   * @default 'default'
   */
  paginationLayout?: PaginationLayout;
  /**
   * Position of the navigation arrows (Previous/Next buttons).
   * Only used when paginationLayout is 'custom'. Ignored for other layouts.
   * @default 'left'
   */
  navigationPosition?: PaginationPosition;
  /**
   * Position of the page size selector.
   * Only used when paginationLayout is 'custom'. Ignored for other layouts.
   * @default 'right'
   */
  pageSizePosition?: PaginationPosition;
}

export type MoniteTablePaginationProps = MoniteTablePaginationSlotProps &
  MoniteTablePaginationRootSlotProps &
  MoniteTablePaginationLayoutProps;

type TablePaginationProps<T> = MoniteTablePaginationProps & {
  paginationModel: PaginationModel<T> | { page: T };
  onPaginationModelChange: (paginationModel: PaginationModel<T>) => void;
  nextPage: T | undefined;
  prevPage: T | undefined;
  className?: string;
};

/**
 * Provides a pagination component for tables.
 * @param onPaginationModelChange Callback for when the prev/next page buttons are clicked, or when the page size is changed.
 * @param paginationModel The current pagination model. It should contain the current page and the page size.
 * @param nextPage The next page number. If undefined, the next page button will be disabled.
 * @param prevPage The previous page number. If undefined, the previous page button will be disabled.
 * @param pageSizeOptions The page size options. If not provided, will be used from theme or hidden if only one option is available.
 * @param paginationLayout Controls the layout of pagination controls. Options: 'default' (nav left, selector right), 'reversed' (selector left, nav right), 'centered' (both centered), 'custom' (use individual position props).
 * @param navigationPosition Position of navigation arrows. Only used when paginationLayout is 'custom', ignored otherwise.
 * @param pageSizePosition Position of page size selector. Only used when paginationLayout is 'custom', ignored otherwise.
 */
export const TablePagination = <T,>({
  onPaginationModelChange,
  paginationModel,
  nextPage,
  prevPage,
  pageSizeOptions: inSizeOptionsProp,
  slotProps: inSlotProps,
  paginationLayout: inPaginationLayout,
  navigationPosition: inNavigationPosition,
  pageSizePosition: inPageSizePosition,
  className,
}: TablePaginationProps<T>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const {
    pageSizeOptions,
    slotProps,
    paginationLayout = 'default',
    navigationPosition = 'left',
    pageSizePosition = 'right',
  } = useThemeProps({
    props: {
      pageSizeOptions: inSizeOptionsProp,
      slotProps: inSlotProps,
      paginationLayout: inPaginationLayout,
      navigationPosition: inNavigationPosition,
      pageSizePosition: inPageSizePosition,
    },
    name: componentName,
  });

  const pageSize =
    'pageSize' in paginationModel
      ? paginationModel.pageSize
      : pageSizeOptions?.[0] ?? DEFAULT_PAGE_SIZE;

  const hasPageSizeSelect = pageSizeOptions && pageSizeOptions.length > 1;

  const layoutStyles = getLayoutStyles({
    layout: paginationLayout,
    navigationPosition,
    pageSizePosition,
    hasPageSizeSelect: !!hasPageSizeSelect,
  });

  return (
    <RootGrid container mx={2} boxSizing="border-box" className={className}>
      <Grid
        xs={12}
        item
        display="flex"
        justifyContent={layoutStyles.justifyContent}
        flexDirection={layoutStyles.flexDirection}
        gap={layoutStyles.gap}
        pt={0.5}
        pb={1}
        alignItems="center"
      >
        <Box>
          <IconButton
            className="Monite-TablePagination-PreviousPageButton"
            aria-label={t(i18n)`Previous page`}
            disabled={!prevPage}
            onClick={(event) => {
              event.preventDefault();
              if (typeof prevPage === 'undefined')
                throw new Error('Previous page is not available');

              onPaginationModelChange({
                page: prevPage,
                pageSize,
              });
            }}
          >
            <ChevronLeft fontSize="small" aria-label={t(i18n)`Previous page`} />
          </IconButton>
          <IconButton
            className="Monite-TablePagination-NextPageButton"
            aria-label={t(i18n)`Next page`}
            disabled={!nextPage}
            onClick={(event) => {
              event.preventDefault();
              if (typeof nextPage === 'undefined')
                throw new Error('Next page is not available');

              onPaginationModelChange({
                page: nextPage,
                pageSize,
              });
            }}
          >
            <ChevronRight fontSize="small" aria-label={t(i18n)`Next page`} />
          </IconButton>
        </Box>
        {hasPageSizeSelect && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {t(i18n)`Results per page`}
            </Typography>
            <Box>
              <StyledSelect
                className="Monite-RowsPerPageSelector"
                {...slotProps?.pageSizeSelect}
                aria-label={t(i18n)`Rows per page`}
                MenuProps={{
                  ...slotProps?.pageSizeSelect?.MenuProps,
                  container: root,
                }}
                value={pageSize.toString()}
                onChange={(event) =>
                  void onPaginationModelChange({
                    page: null,
                    pageSize: parseInt(event.target.value, 10),
                  })
                }
              >
                {pageSizeOptions?.map((menuItem) => (
                  <MenuItem key={menuItem} value={menuItem.toString()}>
                    {menuItem}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box>
          </Box>
        )}
      </Grid>
    </RootGrid>
  );
};

const RootGrid = styled(
  forwardRef<HTMLDivElement, GridProps>((props, ref) => (
    <Grid ref={ref} {...props} />
  )),
  {
    name: componentName,
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});

const StyledSelect = styled(
  forwardRef<HTMLDivElement, SelectProps<string>>(({ ...restProps }, ref) => {
    const { root } = useRootElements();

    return <Select ref={ref} {...restProps} MenuProps={{ container: root }} />;
  }),
  {
    name: componentName,
    slot: 'pageSizeSelect',
    shouldForwardProp: () => true,
  }
)({});
