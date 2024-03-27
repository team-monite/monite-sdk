import { useCallback, useMemo } from 'react';

import { useDialog } from '@/components';
import {
  useDeleteReceivableById,
  useIssueReceivableById,
  usePDFReceivableByIdMutation,
  useSendReceivableById,
} from '@/core/queries';
import { ReceivableResponse, ReceivablesStatusEnum } from '@monite/sdk-api';

export enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

interface IUseExistingInvoiceDetailsProps {
  receivableId: ReceivableResponse['id'];
  receivable?: ReceivableResponse;
  deliveryMethod: DeliveryMethod;
}

interface IUseExistingInvoiceDetails {
  /** Callbacks for handling invoice actions */
  callbacks: {
    /** Fires when we need to delete an invoice */
    handleDeleteInvoice: () => void;

    /** Fires when we need to issue an invoice */
    handleIssueOnly: () => void;

    /** Fires when we need to download an invoice PDF */
    handleDownloadPDF: () => void;
  };

  /** Describes is any mutation or queries is in progress */
  loading: boolean;

  /** Describes which buttons should be visible */
  buttons: {
    /** Describes should we show "Download PDF" button or not */
    isDownloadPDFButtonVisible: boolean;

    /** Describes should we show "More" button or not */
    isMoreButtonVisible: boolean;

    /** Describes should we show "Compose email" button or not */
    isComposeEmailButtonVisible: boolean;

    /** Describes should we show "Issue" button or not */
    isIssueButtonVisible: boolean;
  };
}

export function useExistingInvoiceDetails({
  receivableId,
  receivable,
  deliveryMethod,
}: IUseExistingInvoiceDetailsProps): IUseExistingInvoiceDetails {
  const dialogContext = useDialog();

  const deleteMutation = useDeleteReceivableById();
  const sendMutation = useSendReceivableById();
  const issueMutation = useIssueReceivableById();
  const pdfMutation = usePDFReceivableByIdMutation(receivableId);

  const mutationInProgress =
    deleteMutation.isLoading ||
    sendMutation.isLoading ||
    issueMutation.isLoading ||
    pdfMutation.isLoading;

  const handleIssueOnly = useCallback(() => {
    if (deliveryMethod !== DeliveryMethod.Download) {
      throw new Error('Unsupported delivery method');
    }

    issueMutation.mutate(receivableId);
  }, [deliveryMethod, issueMutation, receivableId]);

  const handleDeleteInvoice = useCallback(() => {
    deleteMutation.mutate(receivableId, {
      onSuccess: () => {
        dialogContext?.onClose?.();
      },
    });
  }, [deleteMutation, dialogContext, receivableId]);

  const handleDownloadPDF = useCallback(() => {
    pdfMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.file_url, '_blank');
      },
    });
  }, [pdfMutation]);

  const isDownloadPDFButtonVisible = useMemo(() => {
    switch (receivable?.status) {
      case ReceivablesStatusEnum.ISSUED:
      case ReceivablesStatusEnum.PARTIALLY_PAID:
      case ReceivablesStatusEnum.PAID:
      case ReceivablesStatusEnum.OVERDUE:
      case ReceivablesStatusEnum.CANCELED:
      case ReceivablesStatusEnum.UNCOLLECTIBLE:
        return true;
      default:
        return false;
    }
  }, [receivable?.status]);

  const isMoreButtonVisible = useMemo(() => {
    switch (receivable?.status) {
      case ReceivablesStatusEnum.ISSUED:
      case ReceivablesStatusEnum.PARTIALLY_PAID:
      case ReceivablesStatusEnum.OVERDUE:
        return true;
      default:
        return false;
    }
  }, [receivable?.status]);

  const isComposeEmailButtonVisible = useMemo(() => {
    return (
      deliveryMethod === DeliveryMethod.Email &&
      receivable?.status === ReceivablesStatusEnum.DRAFT
    );
  }, [deliveryMethod, receivable?.status]);

  const isIssueButtonVisible = useMemo(() => {
    return (
      deliveryMethod === DeliveryMethod.Download &&
      receivable?.status === ReceivablesStatusEnum.DRAFT
    );
  }, [deliveryMethod, receivable?.status]);

  return {
    callbacks: {
      handleDeleteInvoice,
      handleIssueOnly,
      handleDownloadPDF,
    },
    loading: mutationInProgress,
    buttons: {
      isDownloadPDFButtonVisible,
      isMoreButtonVisible,
      isComposeEmailButtonVisible,
      isIssueButtonVisible,
    },
  };
}
