import { useMemo, useState } from 'react';
import React from 'react';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useCurrencies } from '@/core/hooks';
import { useCounterpartById } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';
import { Box, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';

import { PreviewCustomerSection } from './sections/PreviewCustomerSection';
import { PreviewDetailsSection } from './sections/PreviewDetailsSection';
import { PreviewItemsSection } from './sections/PreviewItemsSection';
import { PreviewPaymentDetailsSection } from './sections/PreviewPaymentDetailsSection';

enum ViewState {
  Overview = 'overview',
  Details = 'details',
}

const a11yProps = (index: ViewState) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

interface ITabPanel {
  children: React.ReactNode;
  index: ViewState;
  value: ViewState;
}

const TabPanel = ({ value, index, children }: ITabPanel) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-content-${index}`}
      aria-labelledby={`Tab content ${index}`}
    >
      {value === index && children}
    </div>
  );
};

interface IOverviewProps {
  invoice: InvoiceResponsePayload;
}

export const Overview = ({ invoice }: IOverviewProps) => {
  const { i18n } = useLingui();
  const [view, setView] = useState<ViewState>(ViewState.Overview);

  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(invoice.counterpart_id);

  const counterpartName = useMemo(() => {
    if (isCounterpartLoading) {
      return <Skeleton variant="text" width="50%" />;
    }

    if (counterpartError) {
      return '—';
    }

    if (counterpart) {
      return getCounterpartName(counterpart);
    }
  }, [counterpart, counterpartError, isCounterpartLoading]);

  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Stack spacing={3}>
      <Tabs
        value={view}
        onChange={(_, newValue) => {
          setView(newValue);
        }}
        aria-label={t(i18n)`Overview or details tabs`}
      >
        <Tab
          label={t(i18n)`Overview`}
          {...a11yProps(ViewState.Overview)}
          value={ViewState.Overview}
        />
        <Tab
          label={t(i18n)`Details`}
          {...a11yProps(ViewState.Details)}
          value={ViewState.Details}
        />
      </Tabs>

      <TabPanel value={view} index={ViewState.Overview}>
        <MoniteCard
          items={[
            {
              label: t(i18n)`Customer`,
              value: (
                <Typography fontWeight={500}>{counterpartName}</Typography>
              ),
            },
            {
              label: t(i18n)`Current status`,
              value: (
                <Box component="span" fontWeight={500} fontSize="0.9rem">
                  <InvoiceStatusChip status={invoice.status} icon={false} />
                </Box>
              ),
            },
            {
              label: t(i18n)`Invoice total`,
              value: (
                <Typography fontWeight={500}>
                  {formatCurrencyToDisplay(
                    invoice.total_amount_with_credit_notes,
                    invoice.currency
                  )}
                </Typography>
              ),
            },
          ]}
        />
      </TabPanel>

      <TabPanel value={view} index={ViewState.Details}>
        <Stack spacing={4}>
          <PreviewCustomerSection invoice={invoice} />
          <PreviewDetailsSection invoice={invoice} />
          <PreviewItemsSection invoice={invoice} />
          <PreviewPaymentDetailsSection invoice={invoice} />
        </Stack>
      </TabPanel>
    </Stack>
  );
};
