import { useMemo } from 'react';

import { components } from '@/api';
import { type PaymentRecordWithIntent } from '@/components/payables/types';
import { useIsActionAllowed } from '@/core/queries/usePermissions';

interface UsePayButtonVisibilityProps {
  payable?: components['schemas']['PayableResponseSchema'];
  payableRecentPaymentRecordByIntent: PaymentRecordWithIntent[];
}

interface PaymentIntentsAnalysis {
  scheduledIntents: PaymentRecordWithIntent[];
  processingIntents: PaymentRecordWithIntent[];
  succeededIntents: PaymentRecordWithIntent[];
  createdRecords: PaymentRecordWithIntent[];
  hasAnyIntentOtherThanCreated: boolean;
  aggregation: Record<
    string,
    {
      count: number;
      sum: number;
      records: Array<components['schemas']['PaymentRecordResponse']>;
    }
  >;
  idPaymentIntentInCreated?: string;
}

export const usePayButtonVisibility = ({
  payable,
  payableRecentPaymentRecordByIntent,
}: UsePayButtonVisibilityProps) => {
  const { data: isPayAllowed } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable?.was_created_by_user_id,
  });

  const payableStatusCanBePaid = useMemo(
    () =>
      payable
        ? ['waiting_to_be_paid', 'partially_paid'].includes(payable.status)
        : false,
    [payable]
  );

  const intentsAnalysis = useMemo((): PaymentIntentsAnalysis => {
    const scheduledIntents: PaymentRecordWithIntent[] = [];
    const processingIntents: PaymentRecordWithIntent[] = [];
    const succeededIntents: PaymentRecordWithIntent[] = [];
    const createdRecords: PaymentRecordWithIntent[] = [];

    let hasAnyIntentOtherThanCreated = false;

    const aggregation: Record<
      string,
      {
        count: number;
        sum: number;
        records: Array<components['schemas']['PaymentRecordResponse']>;
      }
    > = {};

    // Aggregate the payment intents by status
    payableRecentPaymentRecordByIntent.forEach((item) => {
      const { record } = item;

      // Collect for different status arrays
      if (record.planned_payment_date) {
        scheduledIntents.push(item);
      }
      if (record.status === 'processing') {
        processingIntents.push(item);
      }
      if (record.status === 'succeeded') {
        succeededIntents.push(item);
      }
      if (record.status === 'created') {
        createdRecords.push(item);
      }

      if (record.status !== 'created') {
        hasAnyIntentOtherThanCreated = true;
      }

      // Build aggregation
      const status = record.planned_payment_date ? 'scheduled' : record.status;
      if (!aggregation[status]) {
        aggregation[status] = { count: 0, sum: 0, records: [] };
      }
      aggregation[status].count++;
      aggregation[status].sum += record.amount;
      aggregation[status].records.push(record);
    });

    return {
      scheduledIntents,
      processingIntents,
      succeededIntents,
      createdRecords,
      hasAnyIntentOtherThanCreated,
      aggregation,
      idPaymentIntentInCreated:
        createdRecords.length > 0 ? createdRecords[0].intent : undefined,
    };
  }, [payableRecentPaymentRecordByIntent]);

  const showPayButton = useMemo(() => {
    // Don't show pay button if payable data hasn't loaded yet
    if (!payable) {
      return false;
    }

    const hasAmountToPay = Number(payable.amount_to_pay) > 0;

    // Has only intents on status 'created' or 'canceled'
    const hasPaidIntents =
      intentsAnalysis.scheduledIntents.length > 0 ||
      intentsAnalysis.processingIntents.length > 0 ||
      intentsAnalysis.succeededIntents.length > 0;

    return (
      isPayAllowed &&
      payableStatusCanBePaid &&
      hasAmountToPay &&
      !hasPaidIntents
    );
  }, [
    payable,
    isPayAllowed,
    payableStatusCanBePaid,
    intentsAnalysis.scheduledIntents.length,
    intentsAnalysis.processingIntents.length,
    intentsAnalysis.succeededIntents.length,
  ]);

  return {
    showPayButton,
    isPayAllowed,
    payableStatusCanBePaid,
    intentsAnalysis,
  };
};
