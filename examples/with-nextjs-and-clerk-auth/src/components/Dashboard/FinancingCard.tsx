import DashboardCard from '@/components/DashboardCard';
import { IconCard } from '@/icons';
import { ArrowForward } from '@mui/icons-material';
import { Box, Link } from '@mui/material';
import React from 'react';

export const FinancingCard = () => {
  return (
    <div
      style={{ background: 'linear-gradient(180deg, #F9F9FA 0%, #FFF 100%)' }}
    >
      <DashboardCard
        title="Set up financing & get paid now"
        renderIcon={() => (
          <IconCard sx={{ width: '20px', height: '20px', color: 'black' }} />
        )}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: `url('/financing-bg.svg')`,
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
            Get approved for invoice financing{' '}
            <ArrowForward sx={{ fontSize: '1rem' }} />
          </Link>
        </Box>
      </DashboardCard>
    </div>
  );
};
