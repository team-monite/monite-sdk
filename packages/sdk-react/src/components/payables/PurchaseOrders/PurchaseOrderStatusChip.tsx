import { components } from '@/api';
import { Badge, type badgeVariants } from '@/ui/components/badge';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { VariantProps } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

type PurchaseOrderStatus =
  components['schemas']['PurchaseOrderResponseSchema']['status'];
type StatusConfigKey = PurchaseOrderStatus & keyof StatusConfigMap;

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

interface StatusConfigMap {
  draft: StatusConfig;
  issued: StatusConfig;
}

export interface MonitePurchaseOrderStatusChipProps {
  status: components['schemas']['PurchaseOrderResponseSchema']['status'];
  variant?: BadgeVariant;
}

export const PurchaseOrderStatusChip = forwardRef<
  HTMLDivElement,
  MonitePurchaseOrderStatusChipProps
>(({ status, variant }, ref) => {
  const { i18n } = useLingui();

  const statusConfig: StatusConfigMap = useMemo(
    () => ({
      draft: {
        label: t(i18n)`Draft`,
        variant: 'secondary' as const,
      },
      issued: {
        label: t(i18n)`Issued`,
        variant: 'default' as const,
      },
    }),
    [i18n]
  );

  const config: StatusConfig = useMemo(() => {
    const isValidStatus = (
      status: PurchaseOrderStatus
    ): status is StatusConfigKey => {
      return status in statusConfig;
    };

    return isValidStatus(status)
      ? statusConfig[status]
      : {
          label: status || t(i18n)`Unknown`,
          variant: 'outline' as const,
        };
  }, [status, statusConfig, i18n]);

  return (
    <Badge
      ref={ref}
      className="Monite-PurchaseOrderStatusChip"
      variant={variant ?? config.variant}
    >
      {config.label}
    </Badge>
  );
});
