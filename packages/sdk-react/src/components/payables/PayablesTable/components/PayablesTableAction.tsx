import { components } from '@/api';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
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

  const { handlePay, modalComponent, isPaymentLinkAvailable } =
    usePaymentHandler(payable.id);

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
};
