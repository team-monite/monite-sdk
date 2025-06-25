import { useState, useCallback } from 'react';

import { components } from '@/api';
import { usePayButtonVisibility } from '@/components/payables/hooks/usePayButtonVisibility';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
import { type PaymentRecordWithIntent } from '@/components/payables/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks/useCurrencies';
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
  payableRecentPaymentRecordByIntent: PaymentRecordWithIntent[];
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

  const { showPayButton, intentsAnalysis } = usePayButtonVisibility({
    payable,
    payableRecentPaymentRecordByIntent,
  });

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

  if (!showPayButton) {
    return null;
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
      {modalComponent}
    </Box>
  );
};
