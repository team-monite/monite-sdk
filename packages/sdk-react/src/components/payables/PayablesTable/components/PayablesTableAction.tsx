import toast from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

interface PayablesTableActionProps {
  payable: components['schemas']['PayableResponseSchema'];

  /**
   * The event handler for the pay action
   *
   * @param id - The identifier of the row to perform the pay action on, a string.
   */
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

  const { handlePay, isPaymentLinkAvailable } = usePaymentHandler(payable);

  const handleClick = () => {
    const paymentPageUrl = handlePay();
    if (paymentPageUrl && onPay) {
      onPay(payable.id);
    }
  };

  if (
    isPayAllowed &&
    payable.status === 'waiting_to_be_paid' &&
    isPaymentLinkAvailable
  ) {
    return (
      <Button
        variant="outlined"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {t(i18n)`Pay`}
      </Button>
    );
  }

  return null;
};

export const usePaymentHandler = (
  payable: components['schemas']['PayableResponseSchema']
) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const paymentIntentQuery = api.paymentIntents.getPaymentIntents.useQuery({
    query: {
      object_id: payable.id,
    },
  });

  const paymentLinkId = paymentIntentQuery.data?.data?.[0]?.payment_link_id;

  const paymentLinkQuery = paymentLinkId
    ? api.paymentLinks.getPaymentLinksId.useQuery({
        path: { payment_link_id: paymentLinkId },
      })
    : null;

  const handlePay = () => {
    const paymentPageUrl = paymentLinkQuery?.data?.payment_page_url;
    console.log('Payment page URL:', paymentPageUrl);
    if (!paymentLinkId || !paymentPageUrl) {
      toast.error(
        t(
          i18n
        )`No payment link found for this payable. Please, create a payment link first.`
      );
      return;
    }

    return paymentPageUrl;
  };

  return {
    handlePay,
    isPaymentLinkAvailable:
      !!paymentLinkId && !!paymentLinkQuery?.data?.payment_page_url,
  };
};
