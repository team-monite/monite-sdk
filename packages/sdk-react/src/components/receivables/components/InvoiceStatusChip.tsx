/* eslint-disable lingui/no-unlocalized-strings */
import { components } from '@/api';
import { getCommonStatusLabel } from '@/components/receivables/utils';
import { Badge } from '@/ui/components/badge';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

export interface MoniteInvoiceStatusChipProps {
  status: components['schemas']['ReceivablesStatusEnum'];
  className?: string;
}

const statusChipVariants = cva('', {
  variants: {
    variant: {
      draft: 'mtw:bg-gray-100 mtw:text-gray-950',
      issuing: 'mtw:bg-blue-50 mtw:text-blue-600',
      issued: 'mtw:bg-blue-50 mtw:text-blue-600',
      failed: 'mtw:bg-red-50 mtw:text-red-600',
      accepted: 'mtw:bg-green-50 mtw:text-green-600',
      partially_paid: 'mtw:bg-purple-50 mtw:text-purple-600',
      paid: 'mtw:bg-green-50 mtw:text-green-600',
      expired: 'mtw:bg-red-50 mtw:text-red-600',
      uncollectible: 'mtw:bg-red-50 mtw:text-red-600',
      canceled: 'mtw:bg-red-50 mtw:text-red-600',
      recurring: 'mtw:bg-muted mtw:text-foreground',
      declined: 'mtw:bg-red-50 mtw:text-red-600',
      overdue: 'mtw:bg-amber-50 mtw:text-amber-600',
      deleted: 'mtw:bg-red-50 mtw:text-red-600',
    },
  },
});

export const InvoiceStatusChip = forwardRef<
  HTMLSpanElement,
  MoniteInvoiceStatusChipProps
>(({ status, className }, ref) => {
  const { i18n } = useLingui();

  return (
    <Badge
      ref={ref}
      className={cn(
        'mtw:inline-flex mtw:items-center mtw:gap-1',
        statusChipVariants({ variant: status }),
        className
      )}
    >
      {getCommonStatusLabel(i18n, status)}
    </Badge>
  );
});
