import { useEffect } from 'react';

import { components } from '@/api';
import { FilterContainer } from '@/components/misc/FilterContainer';
import { AggregatedPayablesResponse } from '@/mocks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, Card, CardContent } from '@mui/material';

type FilterTypes = {
  status: string;
};

type FilterValue = string | null;

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
  data: AggregatedPayablesResponse['data'];
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  selectedStatus: string | null;
}

const statusBackgroundColors: Record<ExtendedPayableStateEnum, string> = {
  draft: '#FAFAFA',
  new: '#F4F4FE',
  approve_in_progress: '#FFF5EB',
  paid: '#EEFBF9',
  waiting_to_be_paid: '#F4F4FE',
  rejected: '#d32f2f6b',
  partially_paid: '#EEFBF9',
  canceled: '#E27E46',
  all: '#FAFAFA',
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

  const formattedAmount = amount
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2 }).split('.')
    : ['', ''];

  const [integerPart, decimalPart] = formattedAmount;

  const backgroundColor = selected
    ? 'transparent'
    : statusBackgroundColors[status] || '#FAFAFA';

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

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        border: `2px solid ${selected ? '#3737FF' : 'transparent'}`,
        '&:hover': { border: '2px solid blue' },
        display: 'flex',
        padding: '16px 18px',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor,
        height: 80,
        minWidth: isAllItems ? 118 : 220,
        flexShrink: 0,
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
          justifyContent={amount ? 'space-between' : 'flex-start'}
          alignItems={isAllItems ? 'flex-start' : 'center'}
          flexDirection={amount ? 'row' : 'column'}
          sx={{
            textAlign: isAllItems ? 'left' : 'right',
            width: '100%',
            letterSpacing: 0.32,
          }}
        >
          {/* Adjust layout specifically for "All items" */}
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
                {count} {t(i18n)`items`}
              </Typography>
            </Box>
          ) : (
            <>
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
                  mt: amount ? 0 : 1,
                }}
              >
                {count} {t(i18n)`items`}
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
}: SummaryCardsFiltersProps) => {
  const className = 'Monite-SummaryCardsFilters';

  const enhancedData: (AggregatedPayablesResponse['data'][0] & {
    status: ExtendedPayableStateEnum;
  })[] = [
    {
      status: 'all' as AggregatedPayablesResponse['data'][0]['status'],
      quantity: data.reduce((acc, item) => acc + item.quantity, 0),
      amount: data.reduce((acc, item) => acc + (item.amount || 0), 0),
    },
    ...data,
  ];

  const handleSelectStatus = (status: ExtendedPayableStateEnum) => {
    onChangeFilter('status', status === 'all' ? null : status);
  };

  useEffect(() => {
    if (!selectedStatus) {
      onChangeFilter('status', 'all');
    }
  }, [selectedStatus, onChangeFilter]);

  return (
    <FilterContainer className={className}>
      <Box
        display="flex"
        gap={2}
        sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: 1,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {enhancedData.map((item) => (
          <SummaryCard
            key={item.status}
            status={item.status}
            count={item.quantity}
            amount={item.amount}
            onClick={() => handleSelectStatus(item.status)}
            selected={selectedStatus === item.status}
          />
        ))}
      </Box>
    </FilterContainer>
  );
};
