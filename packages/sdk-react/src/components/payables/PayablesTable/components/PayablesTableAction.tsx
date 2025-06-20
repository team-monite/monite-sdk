import { useMemo, useState, useCallback } from 'react';

import { components } from '@/api';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  AccessTimeRounded,
  CalendarMonthOutlined,
  CheckCircleOutlineRounded,
} from '@mui/icons-material';
import { Button, Chip, Box, Tooltip } from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';

const FALLBACK_CURRENCY = 'USD';

interface PayablesTableActionProps {
  payable: components['schemas']['PayableResponseSchema'];
  payableRecentPaymentRecordByIntent: Array<{
    intent: string;
    record: components['schemas']['PaymentRecordResponse'];
  }>;
  onPay?: (id: string) => void;
  onPayUS?: (id: string) => void;
  onPayableActionComplete?: (payableId: string, status: string) => void;
}

export const PayablesTableAction = ({
  payable,
  payableRecentPaymentRecordByIntent,
  onPay,
  onPayUS, // TODO: remove onPayUS prop
  onPayableActionComplete = () => {},
}: PayablesTableActionProps) => {
  const theme = useTheme();
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: isPayAllowed } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable.was_created_by_user_id,
  });

  const payableStatusCanBePaid = useMemo(
    () => ['waiting_to_be_paid', 'partially_paid'].includes(payable.status),
    [payable.status]
  );

  const intentsAnalysis = useMemo(() => {
    const scheduledIntents: typeof payableRecentPaymentRecordByIntent = [];
    const processingIntents: typeof payableRecentPaymentRecordByIntent = [];
    const succeededIntents: typeof payableRecentPaymentRecordByIntent = [];
    const createdRecords: typeof payableRecentPaymentRecordByIntent = [];

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
    const hasAmountToPay = Number(payable.amount_to_pay) > 0;

    return (
      isPayAllowed &&
      payableStatusCanBePaid &&
      hasAmountToPay &&
      !intentsAnalysis.hasAnyIntentOtherThanCreated
    );
  }, [
    isPayAllowed,
    payableStatusCanBePaid,
    payable.amount_to_pay,
    intentsAnalysis.hasAnyIntentOtherThanCreated,
  ]);

  const handlePaymentComplete = useCallback(
    (payableId: string, status: string) => {
      setIsProcessingPayment(true);
      onPayableActionComplete(payableId, status);
    },
    [onPayableActionComplete]
  );

  const { handlePay, modalComponent } = usePaymentHandler(
    payable.id,
    payable.counterpart_id,
    handlePaymentComplete,
    intentsAnalysis.idPaymentIntentInCreated
  );

  const handlePayClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // TODO: remove onPayUS prop
      if (onPayUS && payable.currency === 'USD') {
        onPayUS?.(payable.id);
      } else {
        onPay ? onPay?.(payable.id) : handlePay();
      }
    },
    [onPayUS, payable.currency, payable.id, onPay, handlePay]
  );

  if (!payableStatusCanBePaid) {
    return null;
  }

  if (intentsAnalysis.scheduledIntents.length > 0) {
    const earliestScheduledIntent = intentsAnalysis.scheduledIntents[0];
    const formattedDate = earliestScheduledIntent.record.planned_payment_date
      ? i18n.date(
          earliestScheduledIntent.record.planned_payment_date,
          locale.dateFormat
        )
      : '';

    return (
      <Tooltip
        title={
          <Box>
            {i18n._('Scheduled for {amount} on {date}', {
              amount: formatCurrencyToDisplay(
                earliestScheduledIntent.record.amount,
                payable.currency || FALLBACK_CURRENCY
              ),
              date: formattedDate,
            })}
          </Box>
        }
        arrow
      >
        <Chip
          icon={<CalendarMonthOutlined fontSize="small" />}
          label={i18n._('Scheduled {date}', { date: formattedDate })}
          size="small"
          sx={{
            color: theme.palette.grey[700],
            backgroundColor: lighten(theme.palette.grey[500], 0.9),
            '& .MuiChip-icon': {
              color: theme.palette.grey[700],
            },
          }}
        />
      </Tooltip>
    );
  }

  if (intentsAnalysis.processingIntents.length > 0) {
    const processingData = intentsAnalysis.aggregation['processing'];

    return (
      <Tooltip
        title={
          processingData && (
            <Box>
              {i18n._('{count} payment for {amount} processing', {
                count: processingData.count,
                amount: formatCurrencyToDisplay(
                  processingData.sum,
                  payable.currency || FALLBACK_CURRENCY
                ),
              })}
            </Box>
          )
        }
        arrow
      >
        <Chip
          icon={<AccessTimeRounded fontSize="small" />}
          label={i18n._('{count} Processing', { count: processingData.count })}
          size="small"
          sx={{
            color: theme.palette.grey[700],
            backgroundColor: lighten(theme.palette.grey[500], 0.9),
            '& .MuiChip-icon': {
              color: theme.palette.grey[700],
            },
          }}
        />
      </Tooltip>
    );
  }

  if (intentsAnalysis.succeededIntents.length > 0) {
    return (
      <Chip
        icon={<CheckCircleOutlineRounded fontSize="small" />}
        label={t(i18n)`Settled`}
        size="small"
        sx={{
          color: theme.palette.success.main,
          backgroundColor: lighten(theme.palette.success.main, 0.9),
          '& .MuiChip-icon': {
            color: theme.palette.success.main,
          },
        }}
      />
    );
  }

  if (showPayButton && isProcessingPayment) {
    return t(i18n)`Processing payment...`;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 0.5,
        height: '100%',
        alignItems: 'center',
      }}
    >
      {showPayButton && (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{
              padding: '0',
              borderRadius: '8px',
            }}
            onClick={handlePayClick}
          >
            {t(i18n)`Pay`}
          </Button>
        </>
      )}

      {modalComponent}
    </Box>
  );
};
