import { FILTER_TYPE_SUMMARY_CARD } from '@/components/payables/PayablesTable/consts';
import {
  StyledCardProps,
  summaryCardClassName,
} from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
import { MonitePayableTableProps } from '@/components/payables/PayablesTable/types';
import { FilterValue } from '@/components/userRoles/types';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

type FilterTypes = Record<typeof FILTER_TYPE_SUMMARY_CARD, 'all'>;

export type ExtendedPayableStateEnum = 'all' | string;

interface MoniteCustomProps {
  title: ExtendedPayableStateEnum;
  onClick: () => void;
  selected: boolean;
}

interface MoniteCustomFiltersProps {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  selectedFilter: ExtendedPayableStateEnum | null;
  sx?: SxProps<Theme>;
  summaryCardFiltersData: Pick<
    MonitePayableTableProps,
    'summaryCardFilters'
  >['summaryCardFilters'];
}

const CustomStyledCard = styled(Card)(
  ({ selected, isAllItems, theme }: StyledCardProps) => ({
    cursor: 'pointer',
    border: `2px solid ${
      selected ? theme.palette.primary.main : 'transparent'
    }`,
    '&:hover': { border: `2px solid ${theme.palette.primary.main}` },
    display: 'flex',
    padding: '16px 18px',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    minWidth: isAllItems ? '118px' : '220px',
    flexShrink: 0,
  })
);

const MoniteCustomFilter = ({
  title,
  onClick,
  selected,
}: MoniteCustomProps) => {
  const { i18n } = useLingui();
  const isAllItems = title === 'all';
  const theme = useTheme();

  const titleText = isAllItems ? t(i18n)`All items` : title;

  return (
    <CustomStyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      isAllItems={isAllItems}
      className={classNames(
        summaryCardClassName,
        `${summaryCardClassName}-${title}`,
        selected ? `${summaryCardClassName}-selected` : ''
      )}
    >
      <CardContent
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: '0 !important',
        }}
      >
        <Box
          display="flex"
          justifyContent={'space-between'}
          alignItems={isAllItems ? 'flex-start' : 'center'}
          flexDirection={'row'}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontSize: 16, paddingBottom: 0 }}
            className={classNames(
              summaryCardClassName,
              `${summaryCardClassName}-Title-${title}`
            )}
          >
            {titleText}
          </Typography>
        </Box>
      </CardContent>
    </CustomStyledCard>
  );
};

export const MoniteCustomFilters = ({
  onChangeFilter,
  summaryCardFiltersData,
  selectedFilter,
  sx,
}: MoniteCustomFiltersProps) => {
  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  if (!summaryCardFiltersData) {
    return (
      <Skeleton
        variant="rectangular"
        height={80}
        className={classNames(`${summaryCardClassName}-Skeleton`)}
        sx={{ m: 2, borderRadius: 3 }}
      />
    );
  }

  const enhancedData = [
    {
      title: 'all',
    },
    ...Object.keys(summaryCardFiltersData).map((key) => ({
      title: key,
      filterData: summaryCardFiltersData[key],
    })),
  ];

  const handleSelectTitle = (title: ExtendedPayableStateEnum) => {
    onChangeFilter(FILTER_TYPE_SUMMARY_CARD, title === 'all' ? null : title);
  };

  return (
    <Box
      ref={containerRef}
      display="flex"
      gap={2}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      sx={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingBottom: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        userSelect: 'none',
        cursor: 'grab',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        ...sx,
      }}
    >
      {enhancedData.map((item) => (
        <MoniteCustomFilter
          title={item.title}
          key={item.title}
          onClick={() => handleSelectTitle(item.title)}
          selected={selectedFilter === item.title}
        />
      ))}
    </Box>
  );
};
