import { useId, useState } from 'react';

import { components } from '@/api';
import { OverviewTabPanel } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/OverviewTabPanel';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack, Tab, Tabs } from '@mui/material';

import { PreviewCustomerSection } from './sections/PreviewCustomerSection';
import { PreviewDetailsSection } from './sections/PreviewDetailsSection';
import { PreviewItemsSection } from './sections/PreviewItemsSection';
import { PreviewPaymentDetailsSection } from './sections/PreviewPaymentDetailsSection';

export const Overview = (
  invoice: components['schemas']['InvoiceResponsePayload']
) => {
  const { i18n } = useLingui();
  const [view, setView] = useState<'overview' | 'details'>('overview');

  const tabsBaseId = `Monite-InvoiceDetails-overview-${useId()}-tab-`;

  return (
    <Stack spacing={3}>
      <Tabs
        value={view}
        onChange={(_, newValue) => {
          setView(newValue);
        }}
      >
        <Tab
          label={t(i18n)`Invoice overview`}
          id={`${tabsBaseId}-overview-tab`}
          aria-controls={`${tabsBaseId}-overview-tabpanel`}
          value="overview"
        />
        <Tab
          label={t(i18n)`Invoice details`}
          id={`${tabsBaseId}-details-tab`}
          aria-controls={`${tabsBaseId}-details-tabpanel`}
          value="details"
        />
      </Tabs>

      {view === 'overview' && (
        <OverviewTabPanel
          invoice={invoice}
          role="tabpanel"
          id={`${tabsBaseId}-overview-tabpanel`}
          aria-labelledby={`${tabsBaseId}-overview-tab`}
        />
      )}

      {view === 'details' && (
        <Box
          role="tabpanel"
          id={`${tabsBaseId}-details-tabpanel`}
          aria-labelledby={`${tabsBaseId}-details-tab`}
        >
          <Stack spacing={4}>
            <PreviewCustomerSection {...invoice} />
            <PreviewDetailsSection {...invoice} />
            <PreviewItemsSection {...invoice} />
            <PreviewPaymentDetailsSection {...invoice} />
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
