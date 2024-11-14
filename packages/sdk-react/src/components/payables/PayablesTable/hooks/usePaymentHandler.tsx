import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Modal, Box } from '@mui/material';

export const usePaymentHandler = (
  payableId: components['schemas']['PayableResponseSchema']['id']
) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const { root } = useRootElements();

  const [modalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const paymentIntentQuery = api.paymentIntents.getPaymentIntents.useQuery({
    query: { object_id: payableId },
  });

  const paymentLinkId = paymentIntentQuery.data?.data?.[0]?.payment_link_id;

  const paymentLinkQuery = api.paymentLinks.getPaymentLinksId.useQuery(
    { path: { payment_link_id: paymentLinkId || '' } },
    { enabled: !!paymentLinkId }
  );

  const payMutation = api.payables.postPayablesIdMarkAsPaid.useMutation(
    undefined,
    {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(error.toString());
      },
    }
  );

  const markInvoiceAsPaid = async (payableId: string) => {
    if (payableId) {
      await payMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" has been paid`
            );
          },
        }
      );
    }
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
    setIframeUrl(null);
    await markInvoiceAsPaid(payableId);
  };

  const handlePay = () => {
    const paymentPageUrl = paymentLinkQuery?.data?.payment_page_url;

    if (!paymentLinkId || !paymentPageUrl) {
      toast.error(
        t(
          i18n
        )`No payment link found for this payable. Please, create a payment link first.`
      );
      return null;
    }
    setIframeUrl(paymentPageUrl);
    setModalOpen(true);
  };

  return {
    handlePay,
    //TODO: integrate based on payment link availability if it's broken
    isPaymentLinkAvailable: true,
    modalComponent: (
      <Modal open={modalOpen} onClose={handleCloseModal} container={root}>
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
    ),
  };
};
