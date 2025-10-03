import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { OverviewTabPanel } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/OverviewTabPanel';
import { PurchaseOrderStatusChip } from '@/components/payables/PurchaseOrders/PurchaseOrderStatusChip';
import { calculatePurchaseOrderTotals } from '@/components/payables/PurchaseOrders/utils/calculations';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  useCounterpartById,
  useCounterpartAddresses,
  useMyEntity,
} from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { Skeleton } from '@/ui/components/skeleton';
import {
  TabBar,
  TabBarContent,
  TabBarList,
  TabBarTrigger,
} from '@/ui/components/tab-bar';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { addDays } from 'date-fns';
import { useState, useMemo } from 'react';

interface OverviewProps {
  purchaseOrder: components['schemas']['PurchaseOrderResponseSchema'];
}

export const Overview = ({ purchaseOrder }: OverviewProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { isNonVatSupported } = useMyEntity();
  const [view, setView] = useState<'overview' | 'details'>('overview');

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(purchaseOrder.counterpart_id);
  const { data: counterpartAddresses, isLoading: isAddressesLoading } =
    useCounterpartAddresses(counterpart?.id);
  const billingAddress = counterpartAddresses?.data?.find(
    (address) => address.id === counterpart?.default_billing_address_id
  );

  const createdAt = useMemo(
    () =>
      purchaseOrder.created_at ? new Date(purchaseOrder.created_at) : null,
    [purchaseOrder.created_at]
  );

  const issuedAt = useMemo(
    () => (purchaseOrder.issued_at ? new Date(purchaseOrder.issued_at) : null),
    [purchaseOrder.issued_at]
  );

  const expiryDate = useMemo(() => {
    if (!purchaseOrder.valid_for_days) return null;

    const baseDate = issuedAt ?? createdAt;
    if (!baseDate) return null;

    const normalizedBase = new Date(baseDate);
    normalizedBase.setUTCHours(0, 0, 0, 0);

    return addDays(normalizedBase, purchaseOrder.valid_for_days);
  }, [purchaseOrder.valid_for_days, issuedAt, createdAt]);

  const { subtotalMinor, totalTaxMinor, totalAmountMinor } =
    calculatePurchaseOrderTotals(purchaseOrder);

  return (
    <div className="mtw:space-y-3">
      <TabBar
        value={view}
        onValueChange={(val) => setView(val as 'overview' | 'details')}
      >
        <TabBarList
          indicatorClassName="mtw:bg-[#292929]"
          gapClassName="mtw:mb-6"
        >
          <TabBarTrigger value="overview">{t(i18n)`Overview`}</TabBarTrigger>
          <TabBarTrigger value="details">{t(i18n)`Details`}</TabBarTrigger>
        </TabBarList>

        <TabBarContent value="overview">
          <OverviewTabPanel
            purchaseOrder={purchaseOrder}
            formattedTotal={formatCurrencyToDisplay(
              totalAmountMinor,
              purchaseOrder.currency
            )}
          />
        </TabBarContent>

        <TabBarContent value="details">
          <div className="mtw:space-y-4">
            {/* Vendor Section */}
            <MoniteCard
              title={t(i18n)`Vendor`}
              items={[
                {
                  label: t(i18n)`Name`,
                  value: isCounterpartLoading ? (
                    <Skeleton className="mtw:h-4 mtw:w-[150px]" />
                  ) : counterpart ? (
                    (getCounterpartName(counterpart) ?? '—')
                  ) : (
                    '—'
                  ),
                },
                {
                  label: t(i18n)`Address`,
                  value: isAddressesLoading ? (
                    <Skeleton className="mtw:h-4 mtw:w-[200px]" />
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
                  value: issuedAt
                    ? i18n.date(issuedAt, locale.dateFormat)
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
                    subtotalMinor,
                    purchaseOrder.currency
                  ),
                },
                ...(totalTaxMinor > 0 && !isNonVatSupported
                  ? [
                      {
                        label: t(i18n)`Tax`,
                        value: formatCurrencyToDisplay(
                          totalTaxMinor,
                          purchaseOrder.currency
                        ),
                      },
                    ]
                  : []),
                {
                  label: t(i18n)`Total`,
                  value: (
                    <div className="mtw:text-base mtw:font-semibold">
                      {formatCurrencyToDisplay(
                        totalAmountMinor,
                        purchaseOrder.currency
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </TabBarContent>
      </TabBar>
    </div>
  );
};
