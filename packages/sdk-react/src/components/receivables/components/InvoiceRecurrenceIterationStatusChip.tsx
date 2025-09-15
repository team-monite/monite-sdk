/* eslint-disable lingui/no-unlocalized-strings */
import { components } from '@/api';
import { getCommonRecurrenceIterationStatusLabel } from '@/components/receivables/utils';
import { Badge } from '@/ui/components/badge';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

export interface MoniteInvoiceRecurrenceIterationStatusChipProps {
  status: components['schemas']['IterationStatus'];
  className?: string;
}

const statusChipVariants = cva('', {
  variants: {
    variant: {
      pending: 'mtw:bg-gray-100 mtw:text-gray-950',
      skipped: 'mtw:bg-amber-50 mtw:text-amber-600',
      canceled: 'mtw:bg-red-50 mtw:text-red-600',
      issue_failed: 'mtw:bg-red-50 mtw:text-red-600',
      send_failed: 'mtw:bg-red-50 mtw:text-red-600',
      completed: 'mtw:bg-green-50 mtw:text-green-600',
    },
  },
});

export const InvoiceRecurrenceIterationStatusChip = forwardRef<
  HTMLSpanElement,
  MoniteInvoiceRecurrenceIterationStatusChipProps
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
      {getCommonRecurrenceIterationStatusLabel(i18n, status)}
    </Badge>
  );
});
