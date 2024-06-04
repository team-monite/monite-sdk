import { useCallback, useMemo, useState } from 'react';

import {
  useDeleteReceivableById,
  useIssueReceivableById,
  usePDFReceivableByIdMutation,
  useSendReceivableById,
} from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import {
  ActionEnum,
  ReceivableResponse,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';

export enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

interface UseExistingInvoiceDetailsProps {
  receivableId: ReceivableResponse['id'];
  receivable?: ReceivableResponse;
  deliveryMethod: DeliveryMethod;
}

interface UseExistingInvoiceDetailsReturns {
  /**
   * Describes which view should be rendered
   * - `view` - by default; we render the view mode
   * - `edit` - we render the edit mode
   *   (the view is almost the same as create an invoice details component)
   */
  view: ExistingInvoiceDetailsView;

  /** Callbacks for handling invoice actions */
  callbacks: {
    /** Fires when we need to issue an invoice */
    handleIssueOnly: () => void;

    /** Fires when we need to download an invoice PDF */
    handleDownloadPDF: () => void;

    /** Fires when we need to change invoice view (from view to edit) */
    handleChangeViewInvoice: () => void;
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

    /** Describes should "Delete" button be disabled or not */
    isDeleteButtonDisabled: boolean;

    /**
     * Describes should we show "Delete" button or not
     *
     * Note: computed based on receivable status,
     *  user permissions, and other checks
     */
    isDeleteButtonVisible: boolean;

    /** Describes should we show "Edit" button or not */
    isEditButtonVisible: boolean;
  };
}

export enum ExistingInvoiceDetailsView {
  Edit = 'edit',
  View = 'view',
}

export function useExistingInvoiceDetails({
  receivableId,
  receivable,
  deliveryMethod,
}: UseExistingInvoiceDetailsProps): UseExistingInvoiceDetailsReturns {
  const [view, setView] = useState(ExistingInvoiceDetailsView.View);

  const { data: isDeleteAllowed, isLoading: isDeleteAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: ActionEnum.DELETE,
      entityUserId: receivable?.entity_user_id,
    });

  const { data: isUpdateAllowed, isLoading: isUpdateAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: ActionEnum.UPDATE,
      entityUserId: receivable?.entity_user_id,
    });

  const deleteMutation = useDeleteReceivableById();
  const sendMutation = useSendReceivableById();
  const issueMutation = useIssueReceivableById();
  const pdfMutation = usePDFReceivableByIdMutation(receivableId);

  const mutationInProgress =
    deleteMutation.isPending ||
    sendMutation.isPending ||
    issueMutation.isPending ||
    pdfMutation.isPending;

  const handleIssueOnly = useCallback(() => {
    if (deliveryMethod !== DeliveryMethod.Download) {
      throw new Error('Unsupported delivery method');
    }

    issueMutation.mutate(receivableId);
  }, [deliveryMethod, issueMutation, receivableId]);

  const handleChangeInvoiceView = useCallback(() => {
    if (view === ExistingInvoiceDetailsView.Edit) {
      setView(ExistingInvoiceDetailsView.View);
    } else {
      setView(ExistingInvoiceDetailsView.Edit);
    }
  }, [view]);

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

  const isComposeEmailButtonVisible =
    deliveryMethod === DeliveryMethod.Email &&
    receivable?.status === ReceivablesStatusEnum.DRAFT &&
    isUpdateAllowed;

  const isIssueButtonVisible =
    deliveryMethod === DeliveryMethod.Download &&
    receivable?.status === ReceivablesStatusEnum.DRAFT &&
    isUpdateAllowed;

  const isEditButtonVisible =
    receivable?.status === ReceivablesStatusEnum.DRAFT &&
    view !== ExistingInvoiceDetailsView.Edit &&
    isUpdateAllowed;

  const isDeleteButtonDisabled =
    receivable?.status !== ReceivablesStatusEnum.DRAFT ||
    isDeleteAllowedLoading ||
    !isDeleteAllowed ||
    mutationInProgress;

  const isDeleteButtonVisible =
    receivable?.status === ReceivablesStatusEnum.DRAFT && isDeleteAllowed;

  return {
    view,
    callbacks: {
      handleIssueOnly,
      handleDownloadPDF,
      handleChangeViewInvoice: handleChangeInvoiceView,
    },
    loading: mutationInProgress,
    buttons: {
      isDownloadPDFButtonVisible,
      isMoreButtonVisible,
      isDeleteButtonDisabled,
      isDeleteButtonVisible,
      isEditButtonVisible,
      isComposeEmailButtonVisible,
      isIssueButtonVisible,
    },
  };
}
