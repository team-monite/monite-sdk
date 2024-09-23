import { ComponentProps } from 'react';

import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
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
import { lighten, styled, useTheme } from '@mui/material/styles';

interface GenericFilterTypes {
  status: string | 'all';
}

export type GenericExtendedStatusEnum = string | 'all';

interface GenericSummaryCardProps {
  status: GenericExtendedStatusEnum;
  count: number;
  amount?: number;
  onClick: () => void;
  selected: boolean;
  statusText?: string;
  colorMap?: Record<string, string>;
}

interface SummaryCardsFiltersProps {
  onChangeFilter: (field: keyof GenericFilterTypes, value: FilterValue) => void;
  filterField: keyof GenericFilterTypes;
  selectedFilter: GenericExtendedStatusEnum | null;
  data: Array<{
    status: GenericExtendedStatusEnum;
    count: number;
    amount?: number;
    statusText?: string;
  }>;
  colorMap?: Record<string, string>;
  sx?: SxProps<Theme>;
}

interface StyledCardProps extends ComponentProps<typeof Card> {
  selected: boolean;
  isAllItems?: boolean;
  theme: Theme;
}

const StyledCard = styled(Card)(
  ({ selected, isAllItems, theme }: StyledCardProps) => {
    return {
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
    };
  }
);

const AmountTypography = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'baseline',
}));

const className = 'Monite-SummaryCard';

const SummaryCard = ({
  status,
  count,
  amount,
  onClick,
  selected,
  statusText,
  colorMap,
}: GenericSummaryCardProps) => {
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

  const displayStatusText =
    statusText || (isAllItems ? t(i18n)`All items` : status);

  const colorValue = colorMap ? colorMap[status] : theme.palette.text.primary;

  return (
    <StyledCard
      theme={theme}
      onClick={onClick}
      selected={selected}
      className={classNames(
        className,
        `${className}-${status}`,
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
                  className,
                  `${className}-title-${status}`
                )}
              >
                {displayStatusText}
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
                  `${className}-StatusTypography`,
                  `${className}-StatusTypography-${status}`,
                  `${className}-StatusTypography-${status}-${selected}`
                )}
                color={colorValue}
              >
                {displayStatusText}
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
                `${className}-AmountTypography`,
                `${className}-AmountTypography-${status}`,
                `${className}-AmountTypography-${status}-${selected}`
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
  selectedFilter,
  filterField,
  data,
  colorMap,
  sx,
}: SummaryCardsFiltersProps) => {
  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  if (!data || data.length === 0) {
    return (
      <Skeleton
        variant="rectangular"
        height={80}
        className={classNames(`${className}-Skeleton`)}
        sx={{ m: 2, borderRadius: 3 }}
      />
    );
  }

  const handleSelectStatus = (status: GenericExtendedStatusEnum) => {
    onChangeFilter(filterField, status === 'all' ? null : status);
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
      {data.map((item) => (
        <SummaryCard
          key={item.status}
          status={item.status}
          count={item.count}
          amount={item.amount}
          onClick={() => handleSelectStatus(item.status)}
          selected={selectedFilter === item.status}
          statusText={item.statusText}
          colorMap={colorMap}
        />
      ))}
    </Box>
  );
};
