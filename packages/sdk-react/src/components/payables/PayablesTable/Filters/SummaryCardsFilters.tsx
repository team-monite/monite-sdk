import { components } from '@/api';
import { useDragScroll } from '@/components/payables/PayablesTable/hooks/useDragScroll';
import { FilterValue } from '@/components/userRoles/types';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Card, CardContent, SxProps, Typography } from '@mui/material';
import { lighten } from '@mui/material/styles';

import { Theme } from 'mui-styles';

type FilterTypes = {
  status: components['schemas']['PayableStateEnum'] | 'all';
};

type ExtendedPayableStateEnum =
  | components['schemas']['PayableStateEnum']
  | 'all';

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
  selectedStatus: string | null;
  sx?: SxProps<Theme>;
}

const statusBackgroundColors: Record<ExtendedPayableStateEnum, string> = {
  draft: '#000000D6',
  new: '#3737FF',
  approve_in_progress: '#3737FF',
  paid: '#13705F',
  waiting_to_be_paid: '#E75300',
  rejected: '#FF475D',
  partially_paid: '#0DAA8E',
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

  const formattedAmount = isTruthyOrZero(amount) ? formatAmount(amount) : '';

  const [integerPart, decimalPart] = formattedAmount.includes('.')
    ? formattedAmount.split('.')
    : ['0', '00'];

  const statusTitleNames: Record<ExtendedPayableStateEnum, string> = {
    draft: t(i18n)`Draft`,
    new: t(i18n)`New`,
    approve_in_progress: t(i18n)`In Approval`,
    paid: t(i18n)`Paid`,
    waiting_to_be_paid: t(i18n)`Approved`,
    rejected: t(i18n)`Rejected`,
    partially_paid: t(i18n)`Partially Paid`,
    canceled: t(i18n)`Canceled`,
    all: t(i18n)`All items`,
  };

  const className = 'Monite-SummaryCard';

  return (
    <Card
      onClick={onClick}
      className={classNames(
        className,
        `${className}-${status}`,
        selected && `${className}-selected`
      )}
      sx={{
        cursor: 'pointer',
        border: `2px solid ${selected ? '#3737FF' : 'transparent'}`,
        '&:hover': { border: '2px solid blue' },
        display: 'flex',
        padding: '16px 18px',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#F4F4FE',
        height: 80,
        minWidth: isAllItems ? 118 : 220,
        flexShrink: 0,
        boxShadow: '0px 1px 1px 0px #0000000F, 0px 4px 4px -1px #00000005',
      }}
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
          justifyContent={
            isTruthyOrZero(amount) ? 'space-between' : 'flex-start'
          }
          alignItems={isAllItems ? 'flex-start' : 'center'}
          flexDirection={isTruthyOrZero(amount) ? 'row' : 'column'}
          sx={{
            textAlign: isAllItems ? 'left' : 'right',
            width: '100%',
            letterSpacing: 0.32,
          }}
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
                fontWeight="bold"
                sx={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.32 }}
              >
                {statusTitleNames[status]}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.26,
                  mt: 0.5,
                }}
              >
                {count} {count === 1 ? t(i18n)`item` : t(i18n)`items`}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h6"
                fontWeight="bold"
                className={classNames(
                  className,
                  `${className}-title-${status}`
                )}
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 0.28,
                  color: statusBackgroundColors[status],
                }}
              >
                {statusTitleNames[status]}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.26,
                  mt: isTruthyOrZero(amount) ? 0 : 1,
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
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontSize: 20,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              ${integerPart}.
              <Typography
                component="span"
                sx={{
                  color: 'gray',
                  fontSize: 14,
                  fontWeight: 700,
                  leadingTrim: 'both',
                  textEdge: 'cap',
                }}
              >
                {decimalPart}
              </Typography>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
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
      status: 'all' as ExtendedPayableStateEnum,
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

const isTruthyOrZero = (value: number | null | undefined) =>
  value !== null && value !== undefined;
