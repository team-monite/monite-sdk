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

interface ITablePaginationProps {
  pageSizeOptions: number[];
  pageSize: number;
  onPageSizeChange: (event: SelectChangeEvent) => void;

  isNextAvailable: boolean;
  onNext: () => void;

  isPreviousAvailable: boolean;
  onPrevious: () => void;
}

export const TablePagination = ({
  pageSizeOptions,
  pageSize,
  onPageSizeChange,
  isNextAvailable,
  onNext,
  isPreviousAvailable,
  onPrevious,
}: ITablePaginationProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Grid container m={2}>
      <Grid item xs={10} md={10} lg={11} display="flex" justifyContent="center">
        <IconButton
          sx={{ height: '100%' }}
          aria-label={t(i18n)`Previous page`}
          onClick={onPrevious}
          disabled={!isPreviousAvailable}
        >
          <ArrowLeft fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ height: '100%' }}
          aria-label={t(i18n)`Next page`}
          onClick={onNext}
          disabled={!isNextAvailable}
        >
          <ArrowRight fontSize="small" aria-label={t(i18n)`Next page`} />
        </IconButton>
      </Grid>
      <Grid item xs={2} md={2} lg={1} display="flex" justifyContent="flex-end">
        <Select
          aria-label={t(i18n)`Rows per page`}
          MenuProps={{ container: root }}
          value={pageSize.toString()}
          onChange={onPageSizeChange}
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
