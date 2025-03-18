import { ComponentProps, useState, useEffect, useRef } from 'react';

import { components } from '@/api';
import { STATUS_TO_MUI_MAP } from '@/components/approvalRequests/consts';
import { getRowToStatusTextMap } from '@/components/payables/consts';
import { DEFAULT_CARDS_ORDER } from '@/components/payables/PayablesTable/consts';
import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
import { FilterValue } from '@/components/userRoles/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Circle } from '@mui/icons-material';
import { KeyboardArrowDown } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Palette,
  PaletteColor,
  Skeleton,
  SxProps,
  Theme,
  Typography,
  Popover,
  Button,
} from '@mui/material';
import { lighten, styled, useTheme } from '@mui/material/styles';

type FilterTypes = {
  status: components['schemas']['PayableStateEnum'] | 'all';
};

export type ExtendedPayableStateEnum =
  | components['schemas']['PayableStateEnum']
  | 'all'
  | string;

interface SummaryCardProps {
  status: ExtendedPayableStateEnum;
  count: number;
  amount?: number;
  onClick: () => void;
  selected: boolean;
}

interface SummaryCardsFiltersProps {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  selectedStatus: ExtendedPayableStateEnum | null;
  sx?: SxProps<Theme>;
}

export interface StyledCardProps extends ComponentProps<typeof Card> {
  selected: boolean;
  isAllItems?: boolean;
  theme: Theme;
}

export const SummaryStyledCard = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== 'selected' && prop !== 'isAllItems' && prop !== 'theme',
})(({ selected, isAllItems, theme }: StyledCardProps) => ({
  cursor: 'pointer',
  display: 'flex',
  padding: '12px 16px',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 80,
  minWidth: isAllItems ? '118px' : '230px',
  flexShrink: 0,
}));

export const summaryCardClassName = 'Monite-SummaryCard';

const SummaryCard = ({
  status,
  count,
  amount,
  onClick,
  selected,
}: SummaryCardProps) => {
  const { i18n } = useLingui();
  const isAllItems = status === 'all';
  const theme = useTheme();

  const statusText = isAllItems
    ? t(i18n)`All items`
    : getRowToStatusTextMap(i18n)[
        status as components['schemas']['PayableStateEnum']
      ];

  const formatAmount = (amount: number) => {
    const dividedAmount = amount / 100;
    return dividedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  };

  const formattedAmount = amount != null ? formatAmount(amount) : '';
  const [integerPart, decimalPart] = formattedAmount.includes('.')
    ? formattedAmount.split('.')
    : ['0', '00'];

  const getColor = (theme: Palette, colorName: string) => {
    const [colorGroup, colorShade] = colorName.split('.') as [
      keyof Palette,
      string
    ];

    const paletteGroup = theme[colorGroup] as PaletteColor | undefined;

    return (
      paletteGroup?.[colorShade as keyof PaletteColor] || theme.text.primary
    );
  };

  const colorValue = getColor(theme.palette, STATUS_TO_MUI_MAP[status]);

  return (
    <SummaryStyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      isAllItems={isAllItems}
      className={classNames(
        summaryCardClassName,
        `${summaryCardClassName}-${status}`,
        selected ? `${summaryCardClassName}-selected` : ''
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
          justifyContent={amount != null ? 'space-between' : 'flex-start'}
          alignItems={isAllItems ? 'flex-start' : 'center'}
          flexDirection={amount != null ? 'row' : 'column'}
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
                fontWeight={500}
                sx={{ fontSize: 14 }}
                className={classNames(
                  summaryCardClassName,
                  `${summaryCardClassName}-title-${status}`
                )}
              >
                {statusText}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={400}
                fontSize="small"
                sx={{ mt: 0.5 }}
              >
                {count} {count === 1 ? t(i18n)`item` : t(i18n)`items`}
              </Typography>
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
              width="100%"
            >
              <Typography
                variant="h6"
                fontWeight={500}
                fontSize="small"
                className={classNames(
                  `${summaryCardClassName}-StatusTypography`,
                  `${summaryCardClassName}-StatusTypography-${status}`,
                  `${summaryCardClassName}-StatusTypography-${status}-${selected}`
                )}
                color={'body.primary'}
              >
                <Circle
                  sx={{
                    color: lighten(colorValue, 0.4),
                    fontSize: 10,
                    background: lighten(colorValue, 0.82),
                    borderRadius: '100%',
                    border: `2px solid ${lighten(colorValue, 0.82)}`,
                    mr: 1,
                  }}
                />
                {statusText}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={400}
                fontSize="small"
                sx={{}}
              >
                {count}
              </Typography>
            </Box>
          )}
        </Box>
        {status !== 'all' && (
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-end"
            mt="auto"
          >
            {/* TODO: Enable amount calculations with analytics endpoint */}
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={400}
              fontSize="small"
              className={classNames(
                `${summaryCardClassName}-AmountTypography`,
                `${summaryCardClassName}-AmountTypography-${status}`,
                `${summaryCardClassName}-AmountTypography-${status}-${selected}`
              )}
            >
              ${integerPart}.
              <Typography
                component="span"
                fontWeight={700}
                fontSize="small"
                sx={{}}
              >
                {decimalPart}
              </Typography>
            </Typography>
          </Box>
        )}
      </CardContent>
    </SummaryStyledCard>
  );
};

export const SummaryCardsFilters = ({
  onChangeFilter,
  selectedStatus,
  sx,
}: SummaryCardsFiltersProps) => {
  const { data: summaryData } = usePayablesTableSummaryData();
  const { api, entityId } = useMoniteContext();
  const { data: entitySettings } = api.entities.getEntitiesIdSettings.useQuery({
    path: { entity_id: entityId },
  });
  const currency = entitySettings?.currency;
  console.log(currency);
  console.log(entitySettings);
  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  // New state variables for the dropdown functionality
  const [visibleCardsCount, setVisibleCardsCount] = useState(0);
  const [openMoreDropdown, setOpenMoreDropdown] = useState(false);
  const moreButtonRef = useRef(null);

  // Calculate visible cards based on container width
  useEffect(() => {
    if (containerRef.current && summaryData?.data) {
      const containerWidth = containerRef.current.offsetWidth;
      const firstCardWidth = 118 + 8; // "All items" card width + gap
      const otherCardWidth = 230 + 8; // Regular card width + gap
      const buttonWidth = 30; // Width for the "More" button

      // Calculate how many regular cards can fit after the first card
      const availableWidthForOtherCards =
        containerWidth - firstCardWidth - buttonWidth;
      const maxRegularCards = Math.floor(
        availableWidthForOtherCards / otherCardWidth
      );

      // Total number of cards: first card + regular cards
      const totalVisibleCards = 1 + maxRegularCards;

      // Ensure we show at least the first card
      setVisibleCardsCount(Math.max(1, totalVisibleCards));
    }
  }, [containerRef.current?.offsetWidth, summaryData?.data?.length]);

  if (!summaryData) {
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
      status: 'all',
      count: summaryData.data.reduce((acc, item) => acc + item.count, 0),
      sum_total_amount: summaryData.data.reduce(
        (acc, item) => acc + (item.sum_total_amount || 0),
        0
      ),
    },
    ...summaryData.data,
  ];

  const sortedData = enhancedData.sort(
    (a, b) =>
      DEFAULT_CARDS_ORDER.indexOf(a.status) -
      DEFAULT_CARDS_ORDER.indexOf(b.status)
  );

  const handleSelectStatus = (status: ExtendedPayableStateEnum) => {
    onChangeFilter('status', status === 'all' ? null : status);
  };

  return (
    <Box
      ref={containerRef}
      display="flex"
      gap={1}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      sx={{
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        padding: '3px',
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
        position: 'relative',
        ...sx,
      }}
    >
      {sortedData.slice(0, visibleCardsCount).map((item) => (
        <SummaryCard
          key={item.status}
          status={item.status}
          count={item.count}
          amount={item.sum_total_amount}
          onClick={() => handleSelectStatus(item.status)}
          selected={selectedStatus === item.status}
        />
      ))}

      {sortedData.length > visibleCardsCount && (
        <>
          <Button
            ref={moreButtonRef}
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setOpenMoreDropdown(true)}
            sx={{
              minWidth: 'auto',
              padding: '12px 0',
              height: '80px',
              maxHeight: '100%',
              marginBottom: '5px',
            }}
          >
            <KeyboardArrowDown />
          </Button>

          <Popover
            id="summary-cards-more-popover"
            open={openMoreDropdown}
            anchorEl={moreButtonRef.current}
            disablePortal={true}
            onClose={() => setOpenMoreDropdown(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: {
                  maxHeight: 'calc(100vh - 100px)',
                  overflowY: 'auto',
                  borderRadius: 1,
                },
              },
            }}
          >
            <Box sx={{ p: 1 }}>
              {sortedData.slice(visibleCardsCount).map((item) => (
                <SummaryCard
                  key={item.status}
                  status={item.status}
                  count={item.count}
                  amount={item.sum_total_amount}
                  onClick={() => {
                    handleSelectStatus(item.status);
                    setOpenMoreDropdown(false);
                  }}
                  selected={selectedStatus === item.status}
                />
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

const usePayablesTableSummaryData = () => {
  const { api, queryClient } = useMoniteContext();

  if (queryClient) {
    api.payables.getPayablesAnalytics.invalidateQueries(queryClient);
  }

  return api.payables.getPayablesAnalytics.useQuery(
    {},
    {
      enabled: !!queryClient,
    }
  );
};
