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

type ReceivableResponse = components['schemas']['ReceivableResponse'];
type ReceivablesStatusEnum = ReceivableResponse['status'];

const ALLOWED_DOWNLOAD_STATUSES: ReceivablesStatusEnum[] = [
  'issued',
  'partially_paid',
  'paid',
  'overdue',
  'canceled',
  'recurring',
  'uncollectible',
];

const isAllowedDownloadStatus = (
  status: ReceivablesStatusEnum | undefined
): status is ReceivablesStatusEnum =>
  Boolean(status && ALLOWED_DOWNLOAD_STATUSES.includes(status));

export enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

interface UseExistingInvoiceDetailsProps {
  receivableId: ReceivableResponse['id'];
  receivable?: ReceivableResponse;
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
  const { entityId } = useMoniteContext();

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

  const deleteMutation = useDeleteReceivableById(receivableId);
  const cancelMutation = useCancelReceivableById(receivableId);
  const sendMutation = useSendReceivableById(receivableId);
  const issueMutation = useIssueReceivableById(receivableId);
  const { api } = useMoniteContext();
  const pdfQuery = api.receivables.getReceivablesIdPdfLink.useQuery({
    path: { receivable_id: receivableId },
  });

  const recurrence_id =
    receivable?.type === 'invoice' && receivable.recurrence_id
      ? receivable.recurrence_id
      : '';

  const isCancelRecurrenceMutating = Boolean(
    api.recurrences.postRecurrencesIdCancel.useIsMutating({
      parameters: { path: { recurrence_id } },
    })
  );

  const mutationInProgress =
    deleteMutation.isPending ||
    sendMutation.isPending ||
    issueMutation.isPending ||
    cancelMutation.isPending ||
    isCancelRecurrenceMutating ||
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

    if (pdfQuery.data?.file_url) {
      window.open(pdfQuery.data.file_url, '_blank');
    }
  }, [pdfQuery]);

  const isPdfReady = useMemo(
    () => Boolean(pdfQuery.data?.file_url),
    [pdfQuery.data?.file_url]
  );

  const isDownloadPDFButtonVisible = useMemo(() => {
    const isStatusAllowsDownload = isAllowedDownloadStatus(receivable?.status);

    return isStatusAllowsDownload && isPdfReady;
  }, [receivable?.status, isPdfReady]);

  const isDownloadPDFButtonDisabled = useMemo(
    () => pdfQuery.isLoading || !isPdfReady || mutationInProgress,
    [pdfQuery.isLoading, isPdfReady, mutationInProgress]
  );

  const isSendEmailButtonVisible = useMemo(() => {
    switch (receivable?.status) {
      case 'issued':
      case 'partially_paid':
      case 'overdue':
      case 'draft':
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

  const isEditTemplateButtonVisible = receivable?.status === 'draft';

  const { data: entity } = api.entities.getEntitiesIdSettings.useQuery({
    path: { entity_id: entityId },
  });

  const isCancelButtonVisible =
    (receivable?.status === 'issued' || receivable?.status === 'overdue') &&
    isUpdateAllowed &&
    entity?.receivable_edit_flow !== 'compliant';

  const isCancelButtonDisabled = mutationInProgress;

  const isCancelRecurrenceButtonDisabled =
    !isUpdateAllowed || mutationInProgress;

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
      isDownloadPDFButtonDisabled,
      isSendEmailButtonVisible,
      isDeleteButtonDisabled,
      isDeleteButtonVisible,
      isEditButtonVisible,
      isComposeEmailButtonVisible,
      isIssueButtonVisible,
      isCancelButtonVisible,
      isCancelButtonDisabled,
      isCancelRecurrenceButtonDisabled,
      isEditTemplateButtonVisible,
    },
  };
}
