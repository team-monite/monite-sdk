import { components } from '@/api';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

interface PayablesTableActionProps {
  payable: components['schemas']['PayableResponseSchema'];
  onPay?: (id: string) => void;
}

export const PayablesTableAction = ({
  payable,
  onPay,
}: PayablesTableActionProps) => {
  const { i18n } = useLingui();
  const { data: isPayAllowed } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable.was_created_by_user_id,
  });

  const { handlePay, modalComponent, isPaymentLinkAvailable } =
    usePaymentHandler(payable.id);

  if (!isPayAllowed) {
    return null;
  }

  if (isPayAllowed && payable.status === 'waiting_to_be_paid') {
    return (
      <>
        {isPaymentLinkAvailable ? (
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onPay?.(payable.id);
              handlePay();
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
};
