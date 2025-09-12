import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCallback, useState } from 'react';

const ALLOWED_DOWNLOAD_STATUSES: PurchaseOrderStatus[] = ['issued', 'draft'];

const isAllowedDownloadStatus = (
  status: PurchaseOrderStatus | undefined
): status is PurchaseOrderStatus =>
  Boolean(status && ALLOWED_DOWNLOAD_STATUSES.includes(status));

export enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

interface UseExistingPurchaseOrderDetailsProps {
  purchaseOrderId: PurchaseOrderResponse['id'];
  purchaseOrder?: PurchaseOrderResponse;
  deliveryMethod: DeliveryMethod;
}

export enum ExistingPurchaseOrderDetailsView {
  Edit = 'edit',
  View = 'view',
}

export function useExistingPurchaseOrderDetails({
  purchaseOrderId,
  purchaseOrder,
  deliveryMethod,
}: UseExistingPurchaseOrderDetailsProps) {
  const { api, entityId } = useMoniteContext();
  const { i18n } = useLingui();

  const [view, setView] = useState(ExistingPurchaseOrderDetailsView.View);

  const { data: isDeleteAllowed, isLoading: isDeleteAllowedLoading } =
    useIsActionAllowed({
      method: 'payables_purchase_order',
      action: 'delete',
      entityUserId: purchaseOrder?.created_by_user_id,
    });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'payables_purchase_order',
    action: 'update',
    entityUserId: purchaseOrder?.created_by_user_id,
  });

  const deleteMutation =
    api.payablePurchaseOrders.deletePayablePurchaseOrdersId.useMutation();
  const sendMutation =
    api.payablePurchaseOrders.postPayablePurchaseOrdersIdSend.useMutation();

  const mutationInProgress = deleteMutation.isPending || sendMutation.isPending;

  const handleIssueOnly = useCallback(() => {
    if (deliveryMethod !== DeliveryMethod.Download) {
      throw new Error('Unsupported delivery method');
    }

    // For purchase orders, there's no separate issue endpoint
    // Purchase orders are "issued" when they're sent via email
    // For "Issue only" mode, we still need to send an email but it's a minimal send
    // This will need to be implemented with actual email sending logic
    sendMutation.mutate({
      path: { purchase_order_id: purchaseOrderId },
      body: {
        subject_text: t(i18n)`Purchase Order`,
        body_text: t(i18n)`Please find the purchase order attached.`,
      },
      header: { 'x-monite-entity-id': entityId },
    });
  }, [deliveryMethod, sendMutation, purchaseOrderId, i18n, entityId]);

  const handleChangePurchaseOrderView = useCallback(() => {
    if (view === ExistingPurchaseOrderDetailsView.Edit) {
      setView(ExistingPurchaseOrderDetailsView.View);
    } else {
      setView(ExistingPurchaseOrderDetailsView.Edit);
    }
  }, [view]);

  const handleDownloadPDF = useCallback(async () => {
    if (purchaseOrder?.file_url) {
      window.open(purchaseOrder.file_url, '_blank');
    }
  }, [purchaseOrder?.file_url]);

  const isPdfReady = Boolean(purchaseOrder?.file_url);

  const isMoreButtonVisible =
    purchaseOrder?.status === 'draft' || purchaseOrder?.status === 'issued';

  const isEditButtonVisible =
    purchaseOrder?.status === 'draft' &&
    view !== ExistingPurchaseOrderDetailsView.Edit &&
    isUpdateAllowed;

  const isComposeEmailButtonVisible =
    purchaseOrder?.status === 'draft' && isUpdateAllowed;

  const isDownloadPDFButtonVisible =
    isAllowedDownloadStatus(purchaseOrder?.status) &&
    isPdfReady &&
    purchaseOrder?.status === 'issued';

  const isDownloadPDFButtonDisabled = !isPdfReady || mutationInProgress;

  const isIssueButtonVisible = false;
  const isDeleteButtonVisible = false;
  const isDeleteButtonDisabled =
    purchaseOrder?.status !== 'draft' ||
    isDeleteAllowedLoading ||
    !isDeleteAllowed ||
    mutationInProgress;

  return {
    view,
    callbacks: {
      handleIssueOnly,
      handleDownloadPDF,
      handleChangeViewPurchaseOrder: handleChangePurchaseOrderView,
    },
    loading: mutationInProgress,
    buttons: {
      isDownloadPDFButtonVisible,
      isDownloadPDFButtonDisabled,
      isMoreButtonVisible,
      isDeleteButtonDisabled,
      isDeleteButtonVisible,
      isEditButtonVisible,
      isComposeEmailButtonVisible,
      isIssueButtonVisible,
    },
  };
}

type PurchaseOrderResponse =
  components['schemas']['PurchaseOrderResponseSchema'];
type PurchaseOrderStatus = PurchaseOrderResponse['status'];
