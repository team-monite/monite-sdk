import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { usePaymentIntentById } from '@/core/queries';
import {
  usePaymentLinkById,
  useCreatePayablePaymentLink,
} from '@/core/queries/usePaymentLinks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Modal, Box, CircularProgress } from '@mui/material';

export const usePaymentHandler = (
  payableId?: components['schemas']['PayableResponseSchema']['id'],
  counterpartId?: components['schemas']['PayableResponseSchema']['counterpart_id'],
  onPaymentComplete?: (payableId: string, status: string) => void,
  existingPaymentIntentId?: string
) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const createPaymentLink = useCreatePayablePaymentLink();

  const [modalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [paymentLinkId, setPaymentLinkId] = useState<string | null>(null);

  // Fetch existing payment intent if existingPaymentIntentId is provided
  const {
    data: existingPaymentIntent,
    isSuccess: isExistingPaymentIntentSuccess,
  } = usePaymentIntentById(existingPaymentIntentId ?? '');

  // Set payment link ID from existing payment intent
  useEffect(() => {
    if (
      isExistingPaymentIntentSuccess &&
      existingPaymentIntent?.payment_link_id &&
      existingPaymentIntentId
    ) {
      setPaymentLinkId(existingPaymentIntent.payment_link_id);
    }
  }, [
    isExistingPaymentIntentSuccess,
    existingPaymentIntent,
    existingPaymentIntentId,
  ]);

  const {
    data: currentPaymentLink,
    refetch: refetchCurrentPaymentLink,
    isSuccess: isCurrentPaymentLinkSuccess,
  } = usePaymentLinkById(paymentLinkId ?? '');

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

    try {
      if (
        !paymentLinkId ||
        currentPaymentLink?.payment_intent?.status !== 'created'
      ) {
        // A) Create new payment link
        if (!payableId) throw new Error('Payable ID is undefined');
        const createdPaymentLink = await createPaymentLink(
          payableId,
          counterpartId,
          ['sepa_credit'],
          60 // 60 days from now
        );

        if (createdPaymentLink.payment_page_url) {
          setPaymentLinkId(createdPaymentLink.id);
          setIframeUrl(createdPaymentLink.payment_page_url);
        } else {
          setPaymentLinkId(null);
          setIframeUrl(null);
          throw new Error('No payment page URL in response');
        }
      } else {
        // B) Use existing payment link
        if (currentPaymentLink?.payment_page_url) {
          setIframeUrl(currentPaymentLink.payment_page_url);
        } else {
          throw new Error('No payment page URL in existing payment link');
        }
      }
      setModalOpen(true);
    } catch (error) {
      console.error('Payment link creation/retrieval error:', error);
      toast.error(
        t(i18n)`Failed to ${
          existingPaymentIntentId && existingPaymentIntent?.status === 'created'
            ? 'retrieve'
            : 'create'
        } payment link. Please try again.`
      );
      setModalOpen(false);
    }
  };

  return {
    handlePay,
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
              <p>{t(i18n)`Loading payment page...`}</p>
            </Box>
          )}
        </Box>
      </Modal>
    ),
  };
};
