import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Modal, Box, CircularProgress } from '@mui/material';

export const usePaymentHandler = (
  payableId?: components['schemas']['PayableResponseSchema']['id'],
  counterpartId?: components['schemas']['PayableResponseSchema']['counterpart_id'],
  onPaymentComplete?: (payableId: string, status: string) => void
) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();

  const [modalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [paymentLinkId, setPaymentLinkId] = useState<string | null>(null);

  const createPaymentLinkMutation =
    api.paymentLinks.postPaymentLinks.useMutation({});

  const {
    data: currentPaymentLink,
    refetch: refetchCurrentPaymentLink,
    isSuccess: isCurrentPaymentLinkSuccess,
  } = api.paymentLinks.getPaymentLinksId.useQuery(
    {
      path: { payment_link_id: paymentLinkId ?? '' },
    },
    { enabled: !!paymentLinkId }
  );

  useEffect(() => {
    if (
      isCurrentPaymentLinkSuccess &&
      currentPaymentLink?.payment_intent?.status === 'processing'
    ) {
      onPaymentComplete?.(
        payableId ?? '',
        currentPaymentLink?.payment_intent?.status ?? ''
      );
    }
  }, [
    currentPaymentLink,
    isCurrentPaymentLinkSuccess,
    onPaymentComplete,
    payableId,
  ]);

  const handleCloseModal = async () => {
    await refetchCurrentPaymentLink();

    setModalOpen(false);
    setIframeUrl(null);
  };

  const handlePay = async () => {
    if (!counterpartId) {
      toast.error(
        t(i18n)`Counterpart not found. Please create a counterpart first.`
      );
      return;
    }

    setModalOpen(true);

    try {
      if (!payableId) throw new Error('Payable ID is undefined');
      const paymentLink = await createPaymentLinkMutation.mutateAsync({
        recipient: {
          id: counterpartId,
          type: 'counterpart',
        },
        object: {
          id: payableId,
          type: 'payable',
        },
        payment_methods: ['sepa_credit'],
        expires_at: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
      });

      if (paymentLink.payment_page_url) {
        setPaymentLinkId(paymentLink.id);
        setIframeUrl(paymentLink.payment_page_url);
      } else {
        setPaymentLinkId(null);
        setIframeUrl(null);
        throw new Error('No payment page URL in response');
      }
    } catch (error) {
      console.error('Payment link creation error:', error);
      toast.error(t(i18n)`Failed to a create payment link. Please try again.`);
      setModalOpen(false);
    }
  };

  const LoadingMessage = () => {
    return t(i18n)`Loading payment page...`;
  };

  return {
    handlePay,
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                py: 4,
              }}
            >
              <CircularProgress />
              <p>
                <LoadingMessage />
              </p>
            </Box>
          )}
        </Box>
      </Modal>
    ),
  };
};
