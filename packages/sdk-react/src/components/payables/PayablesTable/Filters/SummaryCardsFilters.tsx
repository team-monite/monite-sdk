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

const SummaryCard: React.FC<SummaryCardProps> = ({
  status,
  count,
  amount,
  onClick,
  selected,
}) => {
  // Check if the card is "All items" to apply specific styling
  const isAllItems = status === t(i18n)`All items`;

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        border: selected ? '2px solid #3737FF' : '2px solid gray',
        '&:hover': { border: '2px solid blue' },
        display: 'flex',
        padding: '16px 18px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: '1 0 0',
        backgroundColor: selected ? '#f0f4ff' : '#fafafa',
        height: 80,
        minWidth: isAllItems ? 118 : 220,
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
          alignItems={isAllItems ? 'flex-start' : 'center'} // Align items to the left for "All items"
          flexDirection={amount ? 'row' : 'column'}
          sx={{ textAlign: isAllItems ? 'left' : 'right', width: '100%' }} // Align text to the left for "All items"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.32,
            }}
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
              mt: amount ? 0 : 1, // Adds margin-top when in column layout
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
              }}
            >
              ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
      <Box display="flex" gap={2}>
        {enhancedData.map((item) => (
          <SummaryCard
            key={item.status}
            status={item.status}
            count={item.count}
            amount={item?.amount}
            onClick={() => handleSelectStatus(item.status)}
            selected={selectedStatus === item.status}
          />
        ))}
      </Box>
    </FilterContainer>
  );
};
