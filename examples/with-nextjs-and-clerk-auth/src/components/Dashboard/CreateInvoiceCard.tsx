import React from 'react';

import { Box, Button } from '@mui/material';

import invoiceBg from '@/app/(monite)/[[...path]]/invoice-bg.svg';
import DashboardCard from '@/components/DashboardCard';
import { IconReceipt } from '@/icons';

export const CreateInvoiceCard = () => {
  return (
    <DashboardCard
      title="Create an invoice"
      action={
        <Button
          href={'/receivables'}
          variant={'contained'}
          size={'medium'}
          sx={{
            '&:hover': {
              borderRadius: '8px',
              background: '#F8F8FF',
            },
            background: '#EBEBFF',
            color: '#3737FF',
            borderRadius: '8px',
            height: `40px`,
            fontSize: `0.9rem`,
          }}
        >
          Create invoice
        </Button>
      }
      renderIcon={(props) => <IconReceipt {...props} />}
    >
      <Box
        sx={{
          padding: '24px 24px 64px',
          background: '#FAFAFA',
          borderRadius: '12px',
          backgroundImage: `url(${(invoiceBg as { src: string }).src})`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `bottom 0 right 80px`,
        }}
      >
        <p style={{ color: `rgba(0,0,0,0.68)`, margin: 0 }}>
          Quickly create, customize, and send an invoice
        </p>
        <p style={{ color: `rgba(0,0,0,0.38)`, margin: 0 }}>
          Choose your template, payment terms and methods, and send instantly
        </p>
      </Box>
    </DashboardCard>
  );
};
