import { useState } from 'react';

import { components } from '@/api';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

interface PayablesTableActionProps {
  payable: components['schemas']['PayableResponseSchema'];
  onPay?: (id: string) => void;
  onPayUS?: (id: string) => void;
  onPayableActionComplete?: (payableId: string, status: string) => void;
}

export const PayablesTableAction = ({
  payable,
  onPay,
  onPayUS, // TODO: remove onPayUS prop
  onPayableActionComplete = () => {},
}: PayablesTableActionProps) => {
  const { i18n } = useLingui();
  const { data: isPayAllowed } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable.was_created_by_user_id,
  });

  const statusCanBePaid = ['waiting_to_be_paid', 'partially_paid'].includes(
    payable.status
  );

  const hasDueAmount = Number(payable.amount_to_pay) > 0;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { handlePay, modalComponent, isPaymentLinkAvailable } =
    usePaymentHandler(
      payable.id,
      payable.counterpart_id,
      (payableId, status) => {
        setIsProcessingPayment(true);
        onPayableActionComplete(payableId, status);
      }
    );

  if (isPayAllowed && statusCanBePaid && hasDueAmount) {
    if (isProcessingPayment) {
      return t(i18n)`Processing payment...`;
    }

    return (
      <>
        {isPaymentLinkAvailable ? (
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();

              // TODO: remove onPayUS prop
              if (onPayUS && payable.currency === 'USD') {
                onPayUS?.(payable.id);
              } else {
                onPay ? onPay?.(payable.id) : handlePay();
              }
            }}
          >
            {t(i18n)`Pay`}
          </Button>
        ) : (
          <p>{t(i18n)`Payment not allowed`}</p>
        )}
        {modalComponent}
      </>
    );
  }
  return null;
};
