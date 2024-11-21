import { useEffect, useState } from 'react';

import { useCurrencies } from '@monite/sdk-react';
import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import { IconUniversity } from '@/icons';

import DashboardCard from './DashboardCard';
import EmptyState from './EmptyState';

interface CashItem {
  name: string;
  details: string;
  total: number;
}

const mockData = {
  total: 12734780,
  currency: 'USD',
  items: [
    {
      name: 'American Express',
      details: 'Business Card ( **** 8779)',
      total: 9734780,
    },
    {
      name: 'Mercury',
      details: 'Checking account (**** 2190)',
      total: 1000000,
    },
    {
      name: 'JP Morgan Case',
      details: 'Checking account (**** 5467)',
      total: 2000000,
    },
  ],
};

const mockApi = () => Promise.resolve(mockData);

export function CashCard() {
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState<string>();
  const [items, setItems] = useState<CashItem[]>([]);

  const { formatCurrencyToDisplay } = useCurrencies();

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockApi();

      setTotal(data.total);
      setCurrency(data.currency);
      setItems(data.items);
    };

    fetchData();
  }, []);

  const title = (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack>
        <Typography variant="subtitle1">Cash on accounts</Typography>
        {Boolean(items.length) && (
          <Typography>{items.length} account(s)</Typography>
        )}
      </Stack>
      {Boolean(total) && (
        <Typography variant="h3">
          {formatCurrencyToDisplay(total, currency as string)}
        </Typography>
      )}
    </Stack>
  );

  const emptyState = (
    <EmptyState renderIcon={(props) => <IconUniversity {...props} />}>
      No bank accounts connected
    </EmptyState>
  );

  const itemsList = (
    <List dense>
      {items.map((item) => (
        <ListItem key={item.name} disablePadding={true}>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ variant: 'body1' }}
            secondary={item.details}
          />
          <ListItemText
            primary={formatCurrencyToDisplay(item.total, currency as string)}
            primaryTypographyProps={{
              variant: 'body1',
              sx: { fontWeight: 700, textAlign: 'right' },
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <DashboardCard
      title={title}
      renderIcon={(props) => <IconUniversity {...props} />}
    >
      {items.length ? itemsList : emptyState}
    </DashboardCard>
  );
}
