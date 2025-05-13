import React from 'react';

import { ArrowForward } from '@mui/icons-material';
import { Box, Link } from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import { IconReceipt } from '@/icons';

export const CreateInvoiceCard = () => {
  return (
    <div
      style={{
        backgroundColor: 'transparent',
        backgroundImage: `url('/dashboard-card-bg.svg')`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `bottom 0 right 0`,
      }}
    >
      <DashboardCard
        title="Set your style & create invoice"
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: `url('/invoice-bg.svg')`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `bottom 0 right 10px`,
        }}
      >
        <Box
          sx={{
            padding: '64px 0 0',
          }}
        >
          <Link
            href={'/invoice-design'}
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#3737FF',
              textDecoration: 'none',
              fontSize: `0.9rem`,
            }}
          >
            Select style <ArrowForward sx={{ fontSize: '1rem' }} />
          </Link>
        </Box>
      </DashboardCard>
    </div>
  );
};
