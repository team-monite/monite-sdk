import { ComponentProps } from 'react';

import { components } from '@/api';
import { getRowToStatusTextMap } from '@/components/payables/consts';
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

interface StyledCardProps extends ComponentProps<typeof Card> {
  selected: boolean;
  isAllItems?: boolean;
  theme: Theme;
}

const StyledCard = styled(Card)(
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
    height: 80,
    minWidth: isAllItems ? '118px' : '220px',
    flexShrink: 0,
  })
);

const className = 'Monite-MoniteCustom';

const MoniteCustomFilter = ({
  title,
  onClick,
  selected,
}: MoniteCustomProps) => {
  const { i18n } = useLingui();
  const isAllItems = title === 'all';
  const theme = useTheme();

  const titleText = isAllItems
    ? t(i18n)`All items`
    : getRowToStatusTextMap(i18n)[
        title as components['schemas']['PayableStateEnum']
      ];

  const colorValue = theme.palette.primary.main;

  return (
    <StyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      isAllItems={isAllItems}
      className={classNames(
        className,
        `${className}-${title}`,
        selected ? `${className}-selected` : ''
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
          {isAllItems ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ width: '100%' }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ fontSize: 16 }}
                className={classNames(className, `${className}-Title-${title}`)}
              >
                {titleText}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h6"
                fontWeight={700}
                fontSize="small"
                className={classNames(
                  `${className}-TitleTypography`,
                  `${className}-TitleTypography-${title}`,
                  `${className}-TitleTypography-${title}-${selected}`
                )}
                color={colorValue}
              >
                {titleText}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </StyledCard>
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
        className={classNames(`${className}-Skeleton`)}
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
      ...tabFiltersData[key],
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
