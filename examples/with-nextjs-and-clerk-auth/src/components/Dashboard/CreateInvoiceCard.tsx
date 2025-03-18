import React from 'react';

import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Link } from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import { IconReceipt } from '@/icons';

export const CreateInvoiceCard = () => {
  return (
    <DashboardCard
      title="Create an invoice"
      renderIcon={(props) => <IconReceipt {...props} />}
      sx={{
        backgroundImage: `url('/invoice-bg.svg')`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `bottom 0 right 80px`,
      }}
    >
      <Box
        sx={{
          padding: '24px 24px 0',
        }}
      >
        <Link
          href={'/receivables'}
          sx={{
            '&:hover': {
              textDecoration: 'underline',
            },
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#3737FF',
            textDecoration: 'none',
            fontSize: `0.9rem`,
          }}
        >
          Set your style and create invoice{' '}
          <ArrowForward sx={{ fontSize: '1rem' }} />
        </Link>
      </Box>
    </DashboardCard>
  );
};
