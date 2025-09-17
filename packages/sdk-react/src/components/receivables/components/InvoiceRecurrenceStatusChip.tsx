/* eslint-disable lingui/no-unlocalized-strings */
import { components } from '@/api';
import { getCommonRecurrenceStatusLabel } from '@/components/receivables/utils';
import { Badge } from '@/ui/components/badge';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

export interface MoniteInvoiceRecurrenceStatusChipProps {
  status: components['schemas']['RecurrenceStatus'];
  className?: string;
}

const statusChipVariants = cva('', {
  variants: {
    variant: {
      active: 'mtw:bg-blue-50 mtw:text-blue-600',
      paused: 'mtw:bg-amber-50 mtw:text-amber-600',
      canceled: 'mtw:bg-red-50 mtw:text-red-600',
      completed: 'mtw:bg-green-50 mtw:text-green-600',
    },
  },
});

export const InvoiceRecurrenceStatusChip = forwardRef<
  HTMLSpanElement,
  MoniteInvoiceRecurrenceStatusChipProps
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
      {getCommonRecurrenceStatusLabel(i18n, status)}
    </Badge>
  );
});
