import React, { forwardRef } from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import ArrowRight from '@mui/icons-material/ArrowForwardIos';
import {
  Grid,
  GridProps,
  IconButton,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

// eslint-disable-next-line lingui/no-unlocalized-strings
const componentName = 'MoniteTablePagination' as const;
const DEFAULT_PAGE_SIZE = 10 as const;

type PaginationModel<T> = {
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

export interface MoniteTablePaginationProps
  extends MoniteTablePaginationSlotProps,
    MoniteTablePaginationRootSlotProps {}

interface TablePaginationProps<T> extends MoniteTablePaginationProps {
  paginationModel: PaginationModel<T> | { page: T };
  onPaginationModelChange: (paginationModel: PaginationModel<T>) => void;
  nextPage: T | undefined;
  prevPage: T | undefined;
}

/**
 * Provides a pagination component for tables.
 * @param onPaginationModelChange Callback for when the prev/next page buttons are clicked, or when the page size is changed.
 * @param paginationModel The current pagination model. It should contain the current page and the page size.
 * @param nextPage The next page number. If undefined, the next page button will be disabled.
 * @param prevPage The previous page number. If undefined, the previous page button will be disabled.
 * @param pageSizeOptions The page size options. If not provided, will be used from MUI theme or hidden if only one option is available.
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteTablePagination: {
 *       defaultProps: {
 *         // The default page size options
 *         pageSizeOptions: [5, 10, 15, 20],
 *         slotProps: {
 *           pageSizeSelect: {
 *             size: 'small',
 *           },
 *         },
 *       },
 *     }
 *   }
 * }
 */
export const TablePagination = <T,>({
  onPaginationModelChange,
  paginationModel,
  nextPage,
  prevPage,
  pageSizeOptions: inSizeOptionsProp,
  slotProps: inSlotProps,
}: TablePaginationProps<T>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { pageSizeOptions, slotProps } = useThemeProps({
    props: { pageSizeOptions: inSizeOptionsProp, slotProps: inSlotProps },
    name: componentName,
  });

  const defaultPageSize = useTablePaginationThemeDefaultPageSize();

  const pageSize =
    'pageSize' in paginationModel
      ? paginationModel.pageSize
      : pageSizeOptions?.[0] ?? defaultPageSize;

  const hasPageSizeSelect = pageSizeOptions && pageSizeOptions.length > 1;

  const middleGridItemProps = hasPageSizeSelect
    ? {
        xs: 8,
        md: 8,
        lg: 10,
      }
    : {
        xs: 12,
      };

  return (
    <RootGrid container m={2} boxSizing="border-box">
      {hasPageSizeSelect && <Grid item xs={2} md={2} lg={1} />}
      <Grid
        {...middleGridItemProps}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton
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
          <ArrowLeft fontSize="small" />
        </IconButton>
        <IconButton
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
          <ArrowRight fontSize="small" aria-label={t(i18n)`Next page`} />
        </IconButton>
      </Grid>
      {hasPageSizeSelect && (
        <Grid
          item
          xs={2}
          md={2}
          lg={1}
          display="flex"
          justifyContent="flex-end"
        >
          <StyledSelect
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
                pageSize: parseInt(event.target.value, DEFAULT_PAGE_SIZE),
              })
            }
          >
            {pageSizeOptions?.map((menuItem) => (
              <MenuItem key={menuItem} value={menuItem.toString()}>
                {menuItem}
              </MenuItem>
            ))}
          </StyledSelect>
        </Grid>
      )}
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
    return <Select ref={ref} {...restProps} />;
  }),
  {
    name: componentName,
    slot: 'pageSizeSelect',
    shouldForwardProp: () => true,
  }
)({});

/**
 * Returns the default `pageSize` from the Theme.
 * If not specified, it will return a fallback value.
 */
export const useTablePaginationThemeDefaultPageSize = () => {
  const { pageSizeOptions } = useThemeProps({
    props: {} as MoniteTablePaginationRootSlotProps,
    name: componentName,
  });

  return pageSizeOptions?.length ? pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
};
