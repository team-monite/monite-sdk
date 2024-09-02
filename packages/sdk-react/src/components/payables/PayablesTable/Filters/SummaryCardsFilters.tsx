import { useEffect } from 'react';

import { FilterContainer } from '@/components/misc/FilterContainer';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface SummaryCardProps {
  status: string;
  count: number;
  amount?: number;
  onClick: () => void;
  selected: boolean;
}

interface SummaryCardsFiltersProps {
  data: SummaryCardData[];
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  selectedStatus: string | null;
}

interface SummaryCardData {
  status: string;
  count: number;
  amount?: number;
}

type FilterTypes = {
  status: string;
};

type FilterValue = string | null;

const statusBackgroundColors: Record<string, string> = {
  Draft: '#FAFAFA',
  New: '#F4F4FE',
  'In Approval': '#FFF5EB',
  Paid: '#EEFBF9',
};

const SummaryCard = ({
  status,
  count,
  amount,
  onClick,
  selected,
}: SummaryCardProps) => {
  const isAllItems = status === t(i18n)`All items`;

  const formattedAmount = amount
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2 }).split('.')
    : ['', ''];
  const [integerPart, decimalPart] = formattedAmount;

  const backgroundColor = selected
    ? '#3737FF'
    : statusBackgroundColors[status] || '#FAFAFA';

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
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.32 }}
          >
            {status}
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
        </Box>
        {amount && (
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
  const { i18n } = useLingui();
  const className = 'Monite-SummaryCardsFilters';

  const enhancedData: SummaryCardData[] = [
    {
      status: t(i18n)`All items`,
      count: data.reduce((acc, item) => acc + item.count, 0),
    },
    ...data,
  ];

  const handleSelectStatus = (status: string) => {
    onChangeFilter('status', status);
  };

  useEffect(() => {
    if (!selectedStatus) {
      onChangeFilter('status', t(i18n)`All items`);
    }
  }, [selectedStatus, onChangeFilter, i18n]);

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
            count={item.count}
            amount={item.amount}
            onClick={() => handleSelectStatus(item.status)}
            selected={selectedStatus === item.status}
          />
        ))}
      </Box>
    </FilterContainer>
  );
};
