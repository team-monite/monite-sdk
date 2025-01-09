import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { usePaymentIntentByObjectId } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Modal, Box, CircularProgress } from '@mui/material';

import { useRetry } from './useRetry';

export const usePaymentHandler = (
  payableId?: components['schemas']['PayableResponseSchema']['id'],
  counterpartId?: components['schemas']['PayableResponseSchema']['counterpart_id'],
  onPaymentComplete?: () => void,
  returnUrl: string = 'https://www.monite.com'
) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();

  const [modalOpen, setModalOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const { data } = usePaymentIntentByObjectId(payable.id);
  const paymentIntent = data?.data?.[0];

  const createPaymentLinkMutation =
    api.paymentLinks.postPaymentLinks.useMutation({});
  // const payMutation = api.payables.postPayablesIdMarkAsPaid.useMutation(
  //   undefined,
  //   {
  //     onSuccess: (payable) =>
  //       Promise.all([
  //         api.payables.getPayablesId.invalidateQueries(
  //           { parameters: { path: { payable_id: payable.id } } },
  //           queryClient
  //         ),
  //         api.payables.getPayables.invalidateQueries(queryClient),
  //       ]),
  //     onError: (error) => {
  //       toast.error(error.toString());
  //     },
  //   }
  // );

  // const {
  //   executeWithRetry: executeWithRetryMarkPaid,
  //   isRetrying: isRetryingMarkPaid,
  // } = useRetry({
  //   maxAttempts: 5,
  //   initialDelayMs: 1000,
  //   backoffFactor: 1.5,
  //   shouldRetry: () => {
  //     if (!payableId) return true;
  //     return true;
  //   },
  //   onRetry: (attempt, error) => {
  //     console.log(`Marking as paid attempt ${attempt} failed:`, error);
  //   },
  // });

  const {
    executeWithRetry: executeWithRetryCreateLink,
    isRetrying: isRetryingCreateLink,
  } = useRetry({
    maxAttempts: 5,
    initialDelayMs: 1000,
    backoffFactor: 1.5,
    shouldRetry: () => {
      if (!payableId) return true;
      return true;
    },
    onRetry: (attempt, error) => {
      console.log(`Payment link creation attempt ${attempt} failed:`, error);
    },
  });

  // const markInvoiceAsPaid = async (id?: string) => {
  //   if (!id) return;
  //
  //   try {
  //     await executeWithRetryMarkPaid(async () => {
  //       if (!id) throw new Error('Payable ID is undefined');
  //
  //       return payMutation.mutateAsync(
  //         {
  //           path: { payable_id: id },
  //         },
  //         {
  //           onSuccess: (payable) => {
  //             toast.success(
  //               t(i18n)`Payable "${payable.document_id}" has been paid`
  //             );
  //           },
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.error('Failed to mark invoice as paid after retries:', error);
  //     toast.error(t(i18n)`Failed to mark invoice as paid. Please try again.`);
  //   }
  // };

  const handleCloseModal = async () => {
    setModalOpen(false);
    setIframeUrl(null);
    onPaymentComplete();
    // await markInvoiceAsPaid(payableId);
  };

  const handlePay = async () => {
    if (!returnUrl?.startsWith('https://')) {
      toast.error(t(i18n)`Return URL must use HTTPS protocol`);
      return;
    }

    if (!counterpartId) {
      toast.error(
        t(i18n)`Counterpart not found. Please create a counterpart first.`
      );
      return;
    }

    setModalOpen(true);

    try {
      const paymentLink = await executeWithRetryCreateLink(async () => {
        if (!payableId) throw new Error('Payable ID is undefined');

        return createPaymentLinkMutation.mutateAsync({
          recipient: {
            id: counterpartId,
            type: 'counterpart',
          },
          object: {
            id: payableId,
            type: 'payable',
          },
          payment_methods: ['sepa_credit'],
          return_url: returnUrl,
          expires_at: new Date(
            Date.now() + 60 * 24 * 3600 * 1000
          ).toISOString(),
        });
      });

      if (paymentLink.payment_page_url) {
        setIframeUrl(paymentLink.payment_page_url);
      } else {
        throw new Error('No payment page URL in response');
      }
    } catch (error) {
      console.error('Payment link creation error:', error);
      toast.error(t(i18n)`Failed to create payment link. Please try again.`);
      setModalOpen(false);
    }
  };

  const LoadingMessage = () => {
    if (isRetryingCreateLink) {
      return t(i18n)`Creating payment link...`;
    }
    // if (isRetryingMarkPaid) {
    //   return t(i18n)`Marking invoice as paid...`;
    // }
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
