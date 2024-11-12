import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Modal, Box } from '@mui/material';

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

  const { handlePay } = usePaymentHandler(payable);

  const [modalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const handleOpenModal = async () => {
    const url = await handlePay();
    if (url) {
      setIframeUrl(url);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIframeUrl(null);
  };

  if (isPayAllowed && payable.status === 'waiting_to_be_paid') {
    return (
      <>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onPay?.(payable.id);
            handleOpenModal();
          }}
        >
          {t(i18n)`Pay`}
        </Button>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          container={document.body}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                title="Payment Page"
                width="100%"
                height="400px"
                style={{ border: 'none' }}
              />
            ) : (
              <p>{t(i18n)`Loading payment page...`}</p>
            )}
          </Box>
        </Modal>
      </>
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

  const paymentLinkQuery = api.paymentLinks.getPaymentLinksId.useQuery(
    {
      path: { payment_link_id: paymentLinkId || '' },
    },
    {
      enabled: !!paymentLinkId,
    }
  );

  const handlePay = async () => {
    const paymentPageUrl = paymentLinkQuery?.data?.payment_page_url;
    if (!paymentLinkId || !paymentPageUrl) {
      toast.error(
        t(
          i18n
        )`No payment link found for this payable. Please, create a payment link first.`
      );
      return null;
    }

    return paymentPageUrl;
  };

  return {
    handlePay,
    isPaymentLinkAvailable:
      !!paymentLinkId && !!paymentLinkQuery?.data?.payment_page_url,
  };
};
