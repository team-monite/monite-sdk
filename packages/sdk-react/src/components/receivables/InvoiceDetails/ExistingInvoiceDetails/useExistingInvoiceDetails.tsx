import { useCallback, useMemo, useState } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import {
  useCancelReceivableById,
  useDeleteReceivableById,
  useIssueReceivableById,
  useSendReceivableById,
} from '@/core/queries/useReceivables';

export enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

interface UseExistingInvoiceDetailsProps {
  receivableId: components['schemas']['ReceivableResponse']['id'];
  receivable?: components['schemas']['ReceivableResponse'];
  deliveryMethod: DeliveryMethod;
}

export enum ExistingInvoiceDetailsView {
  Edit = 'edit',
  View = 'view',
}

export function useExistingInvoiceDetails({
  receivableId,
  receivable,
  deliveryMethod,
}: UseExistingInvoiceDetailsProps) {
  const { monite } = useMoniteContext();

  const [view, setView] = useState(ExistingInvoiceDetailsView.View);

  const { data: isDeleteAllowed, isLoading: isDeleteAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'delete',
      entityUserId: receivable?.entity_user_id,
    });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: receivable?.entity_user_id,
  });

  const { data: isCancelAllowed, isLoading: isCancelAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'cancel',
      entityUserId: receivable?.entity_user_id,
    });

  const deleteMutation = useDeleteReceivableById(receivableId);
  const cancelMutation = useCancelReceivableById(receivableId);
  const sendMutation = useSendReceivableById(receivableId);
  const issueMutation = useIssueReceivableById(receivableId);
  const { api } = useMoniteContext();
  const pdfQuery = api.receivables.getReceivablesIdPdfLink.useQuery({
    path: { receivable_id: receivableId },
  });

  const mutationInProgress =
    deleteMutation.isPending ||
    sendMutation.isPending ||
    issueMutation.isPending ||
    cancelMutation.isPending ||
    pdfQuery.isPending;

  const handleIssueOnly = useCallback(() => {
    if (deliveryMethod !== DeliveryMethod.Download) {
      throw new Error('Unsupported delivery method');
    }

    issueMutation.mutate();
  }, [deliveryMethod, issueMutation]);

  const handleChangeInvoiceView = useCallback(() => {
    if (view === ExistingInvoiceDetailsView.Edit) {
      setView(ExistingInvoiceDetailsView.View);
    } else {
      setView(ExistingInvoiceDetailsView.Edit);
    }
  }, [view]);

  const handleCancelInvoice = useCallback(() => {
    cancelMutation.mutate();
  }, [cancelMutation]);

  const handleDownloadPDF = useCallback(async () => {
    await pdfQuery.refetch();

    if (pdfQuery.data) {
      window.open(pdfQuery.data.file_url, '_blank');
    }
  }, [pdfQuery]);

  const isDownloadPDFButtonVisible = useMemo(() => {
    switch (receivable?.status) {
      case 'issued':
      case 'partially_paid':
      case 'paid':
      case 'overdue':
      case 'canceled':
      case 'uncollectible': {
        return true;
      }
      default:
        return false;
    }
  }, [receivable?.status]);

  const isMoreButtonVisible = useMemo(() => {
    switch (receivable?.status) {
      case 'issued':
      case 'partially_paid':
      case 'overdue':
        return true;
      default:
        return false;
    }
  }, [receivable?.status]);

  const isComposeEmailButtonVisible =
    deliveryMethod === DeliveryMethod.Email &&
    receivable?.status === 'draft' &&
    isUpdateAllowed;

  const isIssueButtonVisible =
    deliveryMethod === DeliveryMethod.Download &&
    receivable?.status === 'draft' &&
    isUpdateAllowed;

  const isEditButtonVisible =
    receivable?.status === 'draft' &&
    view !== ExistingInvoiceDetailsView.Edit &&
    isUpdateAllowed;

  const isDeleteButtonDisabled =
    receivable?.status !== 'draft' ||
    isDeleteAllowedLoading ||
    !isDeleteAllowed ||
    mutationInProgress;

  const isDeleteButtonVisible =
    receivable?.status === 'draft' && isDeleteAllowed;

  const isCancelButtonVisible =
    receivable?.status === 'draft' && isUpdateAllowed;

  const { data: entity } = api.entities.getEntitiesIdSettings.useQuery({
    path: { entity_id: monite.entityId },
  });

  const isCancelButtonDisabled =
    receivable?.status !== 'draft' ||
    entity?.receivable_edit_flow !== 'compliant' ||
    isCancelAllowedLoading ||
    !isCancelAllowed ||
    mutationInProgress;

  return {
    view,
    callbacks: {
      handleIssueOnly,
      handleDownloadPDF,
      handleCancelInvoice,
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
      isCancelButtonVisible,
      isCancelButtonDisabled,
    },
  };
}
