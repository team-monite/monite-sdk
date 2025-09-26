import { calculatePurchaseOrderTotals } from '../../utils/calculations';
import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCurrencies } from '@/core/hooks';
import { useCounterpartById } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { Skeleton } from '@/ui/components/skeleton';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { HTMLAttributes } from 'react';

interface OverviewTabPanelProps
  extends Pick<
    HTMLAttributes<HTMLDivElement>,
    'id' | 'role' | 'aria-labelledby'
  > {
  purchaseOrder: components['schemas']['PurchaseOrderResponseSchema'];
  formattedTotal?: string | null;
}

export const OverviewTabPanel = ({
  purchaseOrder,
  formattedTotal,
  ...restProps
}: OverviewTabPanelProps) => {
  const { i18n } = useLingui();

  const { formatCurrencyToDisplay } = useCurrencies();
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(purchaseOrder.counterpart_id);

  const { totalAmountMinor } = calculatePurchaseOrderTotals(purchaseOrder);

  return (
    <div className="mtw:space-y-5" {...restProps}>
      <MoniteCard
        items={[
          {
            label: t(i18n)`Vendor`,
            value: isCounterpartLoading ? (
              <Skeleton className="mtw:w-1/2 mtw:h-4" />
            ) : counterpartError || !counterpart ? (
              '—'
            ) : (
              <span className="mtw:font-medium">
                {getCounterpartName(counterpart)}
              </span>
            ),
          },
          {
            label: t(i18n)`Total`,
            value: (
              <span className="mtw:font-medium">
                {formattedTotal ??
                  formatCurrencyToDisplay(
                    totalAmountMinor,
                    purchaseOrder.currency
                  )}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};
