import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { FileViewer } from '@/ui/FileViewer';
import { CenteredContentBox } from '@/ui/box';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AlertCircle } from 'lucide-react';

export const PurchaseOrderPDFViewer = ({
  purchaseOrderId,
}: {
  purchaseOrderId: string;
}) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const {
    data: purchaseOrder,
    isLoading,
    error,
  } = api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery(
    {
      path: {
        purchase_order_id: purchaseOrderId,
      },
      header: { 'x-monite-entity-id': entityId },
    },
    { enabled: Boolean(entityId && purchaseOrderId) }
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="mtw:text-sm mtw:text-destructive">
        {getAPIErrorMessage(i18n, error)}
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="mtw:p-4">
        <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-2">
          <AlertCircle className="mtw:text-red-500 mtw:h-8 mtw:w-8" />
          <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-1">
            <div className="mtw:text-sm mtw:font-medium">{t(
              i18n
            )`Purchase order not found`}</div>
            <div className="mtw:text-xs mtw:text-muted-foreground">
              {t(i18n)`The purchase order could not be loaded.`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!purchaseOrder.file_url) {
    return (
      <CenteredContentBox>
        <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-2 mtw:text-center">
          <div className="mtw:w-5 mtw:h-5 mtw:animate-spin mtw:rounded-full mtw:border-2 mtw:border-foreground mtw:border-t-transparent" />
          <div className="mtw:text-sm mtw:font-medium">{t(
            i18n
          )`Updating the purchase order`}</div>
          <div className="mtw:text-xs mtw:text-muted-foreground">{t(
            i18n
          )`information...`}</div>
        </div>
      </CenteredContentBox>
    );
  }

  return <FileViewer mimetype="application/pdf" url={purchaseOrder.file_url} />;
};
