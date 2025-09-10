/* eslint-disable lingui/no-unlocalized-strings */
import { forwardRef } from 'react';

import { components } from '@/api';
import { Badge } from '@/ui/components/badge';
import { getCommonRecurrenceIterationStatusLabel } from '@/components/receivables/utils';
import { useLingui } from '@lingui/react';
import { cn } from '@/ui/lib/utils';
import { cva } from 'class-variance-authority';

export interface MoniteInvoiceRecurrenceIterationStatusChipProps {
  status: components['schemas']['IterationStatus'];
  className?: string;
}

const statusChipVariants = cva(
  '',
  {
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
  }
);

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
