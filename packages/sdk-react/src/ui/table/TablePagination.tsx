import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import ArrowRight from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton } from '@mui/material';

interface ITablePaginationProps {
  isNextAvailable: boolean;
  onNext: () => void;

  isPreviousAvailable: boolean;
  onPrevious: () => void;
}

export const TablePagination = (props: ITablePaginationProps) => {
  const { i18n } = useLingui();
  return (
    <Box sx={{ margin: 2 }}>
      <IconButton
        aria-label={t(i18n)`Previous page`}
        onClick={props.onPrevious}
        disabled={!props.isPreviousAvailable}
      >
        <ArrowLeft fontSize="small" />
      </IconButton>
      <IconButton
        aria-label={t(i18n)`Next page`}
        onClick={props.onNext}
        disabled={!props.isNextAvailable}
      >
        <ArrowRight fontSize="small" aria-label={t(i18n)`Next page`} />
      </IconButton>
    </Box>
  );
};
