import React from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import ArrowRight from '@mui/icons-material/ArrowForwardIos';
import {
  Grid,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useThemeProps } from '@mui/material/styles';

type PaginationModel<T> = {
  pageSize: number;
  page: T;
};

interface TablePaginationProps<T> {
  pageSizeOptions: number[];
  paginationModel: PaginationModel<T>;
  onPaginationModelChange: (paginationModel: PaginationModel<T>) => void;
  nextPage: T | undefined;
  prevPage: T | undefined;
}

export const TablePagination = <T,>({
  onPaginationModelChange,
  paginationModel,
  nextPage,
  prevPage,
  ...inProps
}: TablePaginationProps<T>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { pageSizeOptions } = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteTablePagination',
  });

  return (
    <Grid container m={2}>
      <Grid item xs={10} md={10} lg={11} display="flex" justifyContent="center">
        <IconButton
          sx={{ height: '100%' }}
          aria-label={t(i18n)`Previous page`}
          disabled={!prevPage}
          onClick={(event) => {
            event.preventDefault();
            if (typeof prevPage === 'undefined')
              throw new Error('Previous page is not available');

            onPaginationModelChange({
              page: prevPage,
              pageSize: paginationModel.pageSize,
            });
          }}
        >
          <ArrowLeft fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ height: '100%' }}
          aria-label={t(i18n)`Next page`}
          disabled={!nextPage}
          onClick={(event) => {
            event.preventDefault();
            if (typeof nextPage === 'undefined')
              throw new Error('Next page is not available');

            onPaginationModelChange({
              page: nextPage,
              pageSize: paginationModel.pageSize,
            });
          }}
        >
          <ArrowRight fontSize="small" aria-label={t(i18n)`Next page`} />
        </IconButton>
      </Grid>
      <Grid item xs={2} md={2} lg={1} display="flex" justifyContent="flex-end">
        <Select
          aria-label={t(i18n)`Rows per page`}
          MenuProps={{ container: root }}
          value={paginationModel.pageSize.toString()}
          onChange={(event) =>
            void onPaginationModelChange({
              page: paginationModel.page,
              pageSize: parseInt(event.target.value, 10),
            })
          }
        >
          {pageSizeOptions.map((menuItem) => (
            <MenuItem key={menuItem} value={menuItem.toString()}>
              {menuItem}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
};
