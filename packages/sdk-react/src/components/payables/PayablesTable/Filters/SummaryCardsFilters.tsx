import { ComponentProps } from 'react';

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

const AmountTypography = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'baseline',
}));

export const sumaryClassName = 'Monite-SummaryCard';

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

  const statusText = isAllItems
    ? t(i18n)`All items`
    : getRowToStatusTextMap(i18n)[
        status as components['schemas']['PayableStateEnum']
      ];

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
    <StyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      isAllItems={isAllItems}
      className={classNames(
        sumaryClassName,
        `${sumaryClassName}-${status}`,
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
                fontWeight={700}
                sx={{ fontSize: 16 }}
                className={classNames(
                  sumaryClassName,
                  `${sumaryClassName}-title-${status}`
                )}
              >
                {statusText}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
                fontSize="small"
                sx={{ mt: 0.5 }}
              >
                {count} {count === 1 ? t(i18n)`item` : t(i18n)`items`}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h6"
                fontWeight={700}
                fontSize="small"
                className={classNames(
                  `${sumaryClassName}-StatusTypography`,
                  `${sumaryClassName}-StatusTypography-${status}`,
                  `${sumaryClassName}-StatusTypography-${status}-${selected}`
                )}
                color={colorValue}
              >
                {statusText}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
                fontSize="small"
                sx={{
                  mt: amount != null ? 0 : 1,
                  color: colorValue,
                  borderRadius: 2,
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  backgroundColor: lighten(colorValue, 0.8),
                }}
              >
                {count} {count === 1 ? t(i18n)`item` : t(i18n)`items`}
              </Typography>
            </>
          )}
        </Box>
        {status !== 'all' && (
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            mt="auto"
          >
            <AmountTypography
              variant="h5"
              fontWeight={700}
              className={classNames(
                `${sumaryClassName}-AmountTypography`,
                `${sumaryClassName}-AmountTypography-${status}`,
                `${sumaryClassName}-AmountTypography-${status}-${selected}`
              )}
            >
              ${integerPart}.
              <Typography
                component="span"
                fontWeight={700}
                fontSize="small"
                sx={{ color: 'gray' }}
              >
                {decimalPart}
              </Typography>
            </AmountTypography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export const SummaryCardsFilters = ({
  onChangeFilter,
  selectedStatus,
  sx,
}: SummaryCardsFiltersProps) => {
  const { data: summaryData } = usePayablesTableSummaryData();

  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  if (!summaryData) {
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
      {sortedData.map((item) => (
        <SummaryCard
          key={item.status}
          status={item.status}
          count={item.count}
          amount={item.sum_total_amount}
          onClick={() => handleSelectStatus(item.status)}
          selected={selectedStatus === item.status}
        />
      ))}
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
