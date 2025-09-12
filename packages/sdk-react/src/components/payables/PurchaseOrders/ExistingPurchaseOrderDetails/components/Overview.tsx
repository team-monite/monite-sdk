import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { OverviewTabPanel } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/OverviewTabPanel';
import { PurchaseOrderStatusChip } from '@/components/payables/PurchaseOrders/PurchaseOrderStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  useCounterpartById,
  useCounterpartAddresses,
  useMyEntity,
} from '@/core/queries';
import { vatRateBasisPointsToPercentage } from '@/core/utils/vatUtils';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack, Tab, Tabs, Skeleton, Typography } from '@mui/material';
import { useId, useState } from 'react';

interface OverviewProps {
  purchaseOrder: components['schemas']['PurchaseOrderResponseSchema'];
}

export const Overview = ({ purchaseOrder }: OverviewProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { isNonVatSupported } = useMyEntity();
  const [view, setView] = useState<'overview' | 'details'>('overview');
  const tabsBaseId = `Monite-PurchaseOrderDetails-overview-${useId()}-tab-`;

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(purchaseOrder.counterpart_id);
  const { data: counterpartAddresses, isLoading: isAddressesLoading } =
    useCounterpartAddresses(counterpart?.id);
  const billingAddress = counterpartAddresses?.data?.find(
    (address) => address.id === counterpart?.default_billing_address_id
  );

  const issueDate = purchaseOrder.created_at
    ? new Date(purchaseOrder.created_at)
    : null;
  const expiryDate = purchaseOrder.valid_for_days
    ? new Date(Date.now() + purchaseOrder.valid_for_days * 24 * 60 * 60 * 1000)
    : null;

  const subtotal =
    purchaseOrder.items?.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) || 0;
  const totalTax =
    purchaseOrder.items?.reduce(
      (sum, item) =>
        sum +
        (item.quantity *
          item.price *
          vatRateBasisPointsToPercentage(item.vat_rate)) /
          100,
      0
    ) || 0;
  const totalAmount = subtotal + totalTax;

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
      </Tabs>

      {view === 'overview' && (
        <OverviewTabPanel
          purchaseOrder={purchaseOrder}
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
            {/* Vendor Section */}
            <MoniteCard
              title={t(i18n)`Vendor`}
              items={[
                {
                  label: t(i18n)`Name`,
                  value: isCounterpartLoading ? (
                    <Skeleton width={150} />
                  ) : (
                    getCounterpartName(counterpart) || '—'
                  ),
                },
                {
                  label: t(i18n)`Address`,
                  value: isAddressesLoading ? (
                    <Skeleton width={200} />
                  ) : billingAddress ? (
                    <>
                      {billingAddress.line1}
                      {billingAddress.line2 && `, ${billingAddress.line2}`}
                      <br />
                      {billingAddress.city}, {billingAddress.state}{' '}
                      {billingAddress.postal_code}
                      <br />
                      {billingAddress.country}
                    </>
                  ) : (
                    '—'
                  ),
                },
              ]}
            />

            {/* Details Section */}
            <MoniteCard
              title={t(i18n)`Purchase Order Details`}
              items={[
                {
                  label: t(i18n)`Document ID`,
                  value: purchaseOrder.document_id ?? t(i18n)`PO-auto`,
                },
                {
                  label: t(i18n)`Status`,
                  value: (
                    <PurchaseOrderStatusChip status={purchaseOrder.status} />
                  ),
                },
                {
                  label: t(i18n)`Issue Date`,
                  value: issueDate
                    ? i18n.date(issueDate, locale.dateFormat)
                    : '—',
                },
                {
                  label: t(i18n)`Expiry Date`,
                  value: expiryDate
                    ? i18n.date(expiryDate, locale.dateFormat)
                    : '—',
                },
                ...(purchaseOrder.message
                  ? [
                      {
                        label: t(i18n)`Message`,
                        value: purchaseOrder.message,
                      },
                    ]
                  : []),
              ]}
            />

            {/* Payment Details Section */}
            <MoniteCard
              title={t(i18n)`Payment Details`}
              items={[
                {
                  label: t(i18n)`Subtotal`,
                  value: formatCurrencyToDisplay(
                    subtotal,
                    purchaseOrder.currency
                  ),
                },
                ...(totalTax > 0 && !isNonVatSupported
                  ? [
                      {
                        label: t(i18n)`Tax`,
                        value: formatCurrencyToDisplay(
                          totalTax,
                          purchaseOrder.currency
                        ),
                      },
                    ]
                  : []),
                {
                  label: t(i18n)`Total`,
                  value: (
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {formatCurrencyToDisplay(
                        totalAmount,
                        purchaseOrder.currency
                      )}
                    </Typography>
                  ),
                },
              ]}
            />
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
