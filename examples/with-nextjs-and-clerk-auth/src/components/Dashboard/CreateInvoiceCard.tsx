import React from 'react';

import { ArrowForward } from '@mui/icons-material';
import { Box, Link } from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import { IconReceipt } from '@/icons';

export const CreateInvoiceCard = () => {
  return (
    <div
      style={{ background: 'linear-gradient(180deg, #F9F9FA 0%, #FFF 100%)' }}
    >
      <DashboardCard
        title="Create an invoice"
        renderIcon={(props) => <IconReceipt {...props} />}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: `url('/invoice-bg.svg')`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `bottom 0 right 80px`,
        }}
      >
        <Box
          sx={{
            padding: '44px 24px 0',
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
    </div>
  );
};
