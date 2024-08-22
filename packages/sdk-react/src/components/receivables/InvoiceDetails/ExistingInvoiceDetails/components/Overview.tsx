import { useId, useState } from 'react';

import { components } from '@/api';
import { OverviewTabPanel } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/OverviewTabPanel';
import { InvoiceRecurrenceIterations } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/ReceivableRecurrence/InvoiceRecurrenceIterations';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Card, Skeleton, Stack, Tab, Tabs } from '@mui/material';

import { useRecurrenceByInvoiceId } from '../components/ReceivableRecurrence/useInvoiceRecurrence';
import { PreviewCustomerSection } from './sections/PreviewCustomerSection';
import { PreviewDetailsSection } from './sections/PreviewDetailsSection';
import { PreviewItemsSection } from './sections/PreviewItemsSection';
import { PreviewPaymentDetailsSection } from './sections/PreviewPaymentDetailsSection';

export const Overview = (
  invoice: components['schemas']['InvoiceResponsePayload']
) => {
  const { i18n } = useLingui();
  const [view, setView] = useState<'overview' | 'details' | 'recurrence'>(
    'overview'
  );
  const { data: recurrence, isLoading: isRecurrenceLoading } =
    useRecurrenceByInvoiceId(invoice.id);
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
          label={t(i18n)`Overview`}
          id={`${tabsBaseId}-overview-tab`}
          aria-controls={`${tabsBaseId}-overview-tabpanel`}
          value="overview"
        />
        <Tab
          label={t(i18n)`Details`}
          id={`${tabsBaseId}-details-tab`}
          aria-controls={`${tabsBaseId}-details-tabpanel`}
          value="details"
        />

        {(recurrence || isRecurrenceLoading) && (
          <Tab
            label={t(i18n)`Issued documents`}
            id={`${tabsBaseId}-recurrence-tab`}
            aria-controls={`${tabsBaseId}-recurrence-tabpanel`}
            value="recurrence"
          />
        )}
      </Tabs>

      {view === 'overview' && (
        <OverviewTabPanel
          invoice={invoice}
          role="tabpanel"
          id={`${tabsBaseId}-overview-tabpanel`}
          aria-labelledby={`${tabsBaseId}-overview-tab`}
          onSetView={setView}
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

      {view === 'recurrence' && (
        <Box
          role="tabpanel"
          id={`${tabsBaseId}-recurrence-tabpanel`}
          aria-labelledby={`${tabsBaseId}-recurrence-tab`}
        >
          <Card variant="outlined">
            {recurrence ? (
              <InvoiceRecurrenceIterations recurrence={recurrence} />
            ) : isRecurrenceLoading ? (
              <Skeleton variant="text" width="100%" />
            ) : null}
          </Card>
        </Box>
      )}
    </Stack>
  );
};
