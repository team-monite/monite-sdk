import {
  sumaryClassName,
  SummaryStyledCard,
} from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
import { MonitePayableTableProps } from '@/components/payables/PayablesTable/types';
import { FilterValue } from '@/components/userRoles/types';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  CardContent,
  Skeleton,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

type FilterTypes = {
  custom_monite: string | 'all';
};

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
  tabFiltersData: Pick<MonitePayableTableProps, 'tab_filters'>['tab_filters'];
}

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
    <SummaryStyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      isAllItems={isAllItems}
      className={classNames(
        sumaryClassName,
        `${sumaryClassName}-${title}`,
        selected ? `${sumaryClassName}-selected` : ''
      )}
    >
      <CardContent
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
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
            sx={{ fontSize: 16 }}
            className={classNames(
              sumaryClassName,
              `${sumaryClassName}-Title-${title}`
            )}
          >
            {titleText}
          </Typography>
        </Box>
      </CardContent>
    </SummaryStyledCard>
  );
};

export const MoniteCustomFilters = ({
  onChangeFilter,
  tabFiltersData,
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

  if (!tabFiltersData) {
    return (
      <Skeleton
        variant="rectangular"
        height={80}
        className={classNames(`${sumaryClassName}-Skeleton`)}
        sx={{ m: 2, borderRadius: 3 }}
      />
    );
  }

  const enhancedData = [
    {
      title: 'all',
    },
    ...Object.keys(tabFiltersData).map((key) => ({
      title: key,
      filterData: tabFiltersData[key],
    })),
  ];

  const handleSelectTitle = (title: ExtendedPayableStateEnum) => {
    onChangeFilter('custom_monite', title === 'all' ? null : title);
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
