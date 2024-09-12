import { ComponentProps } from 'react';

import { components } from '@/api';
import { getRowToStatusTextMap } from '@/components/payables/consts';
import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
import { FilterValue } from '@/components/userRoles/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Card,
  CardContent,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { lighten, styled } from '@mui/material/styles';

type FilterTypes = {
  status: components['schemas']['PayableStateEnum'] | 'all';
};

type ExtendedPayableStateEnum =
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
  data: components['schemas']['PayableAggregatedDataResponse']['data'];
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  selectedStatus: ExtendedPayableStateEnum | null;
  sx?: SxProps<Theme>;
}

interface StyledCardProps extends ComponentProps<typeof Card> {
  selected: boolean;
}

interface StatusTypographyProps extends ComponentProps<typeof Typography> {
  statusColor: (typeof statusBackgroundColors)[ExtendedPayableStateEnum];
}

const StyledCard = styled(Card)(({ selected }: StyledCardProps) => ({
  cursor: 'pointer',
  border: `2px solid ${selected ? '#3737FF' : 'transparent'}`,
  '&:hover': { border: '2px solid blue' },
  display: 'flex',
  padding: '16px 18px',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '3px',
  backgroundColor: '#ffffff',
  height: 80,
  minWidth: 220,
  flexShrink: 0,
  boxShadow: '0px 1px 1px 0px #0000000F, 0px 4px 4px -1px #00000005',
}));

const StatusTypography = styled(Typography)(
  ({ statusColor }: StatusTypographyProps) => ({
    color: statusColor,
    fontSize: 14,
  })
);

const AmountTypography = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  fontSize: 20,
  marginTop: 4,
}));

// ToDo: Define status background colors outside component to make it reusable from monite.ts theme
const statusBackgroundColors: Record<ExtendedPayableStateEnum, string> = {
  draft: '#000000D6',
  new: '#3737FF',
  approve_in_progress: '#E75300',
  paid: '#13705F',
  waiting_to_be_paid: '#3737FF',
  rejected: '#FF475D',
  partially_paid: '#A06DC8',
  canceled: '#E75300',
  all: '#F4F4FE',
};

const SummaryCard = ({
  status,
  count,
  amount,
  onClick,
  selected,
}: SummaryCardProps) => {
  const { i18n } = useLingui();
  const isAllItems = status === 'all';

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

  return (
    <StyledCard onClick={onClick} selected={selected}>
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
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: 16 }}>
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
              <StatusTypography
                variant="h6"
                fontWeight={700}
                fontSize="small"
                statusColor={statusBackgroundColors[status]}
              >
                {statusText}
              </StatusTypography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
                fontSize="small"
                sx={{
                  mt: amount != null ? 0 : 1,
                  color: statusBackgroundColors[status],
                  borderRadius: 2,
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  backgroundColor: lighten(statusBackgroundColors[status], 0.8),
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
            <AmountTypography variant="h5" fontWeight={700}>
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
  data,
  onChangeFilter,
  selectedStatus,
  sx,
}: SummaryCardsFiltersProps) => {
  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  const predefinedOrder = [
    'all',
    'draft',
    'new',
    'approve_in_progress',
    'rejected',
    'waiting_to_be_paid',
    'partially_paid',
    'paid',
    'canceled',
  ];

  const enhancedData = [
    {
      status: 'all',
      count: data.reduce((acc, item) => acc + item.count, 0),
      sum_total_amount: data.reduce(
        (acc, item) => acc + (item.sum_total_amount || 0),
        0
      ),
    },
    ...data,
  ];

  const sortedData = enhancedData.sort(
    (a, b) =>
      predefinedOrder.indexOf(a.status) - predefinedOrder.indexOf(b.status)
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
