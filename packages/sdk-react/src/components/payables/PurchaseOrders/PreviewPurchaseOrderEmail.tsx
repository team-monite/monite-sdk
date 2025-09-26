import { useMoniteContext } from '@/core/context/MoniteContext';
import { LoadingSpinner } from '@/ui/loading';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircleAlert } from 'lucide-react';
import { useEffect } from 'react';

interface PreviewPurchaseOrderEmailProps {
  purchaseOrderId: string;
  subject: string;
  body: string;
}

export const PreviewPurchaseOrderEmail = ({
  purchaseOrderId,
  subject,
  body,
}: PreviewPurchaseOrderEmailProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const {
    data: preview,
    mutateAsync: createPreview,
    isPending: isCreatingPreview,
    error,
  } = api.payablePurchaseOrders.postPayablePurchaseOrdersIdPreview.useMutation({
    path: { purchase_order_id: purchaseOrderId },
    header: { 'x-monite-entity-id': entityId },
  });

  useEffect(() => {
    if (!purchaseOrderId) return;
    createPreview({ subject_text: subject, body_text: body });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseOrderId, subject, body]);

  return (
    <div className="mtw:flex mtw:flex-col mtw:min-h-0 mtw:overflow-hidden mtw:flex-1">
      {isCreatingPreview ? (
        <div className="mtw:flex mtw:items-center mtw:justify-center mtw:flex-1">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:gap-4 mtw:flex-1">
          <CircleAlert className="mtw:text-red-500" />
          <div className="mtw:flex mtw:flex-col mtw:items-center mtw:text-center mtw:gap-1">
            <h2 className="mtw:font-bold mtw:text-base">{t(
              i18n
            )`Failed to generate email preview`}</h2>
            <p className="mtw:text-sm mtw:text-muted-foreground">{t(
              i18n
            )`Please check your connection and try again.`}</p>
          </div>
        </div>
      ) : (
        <iframe
          srcDoc={preview?.body_preview ?? ''}
          title={t(i18n)`Email preview`}
          sandbox=""
          referrerPolicy="no-referrer"
          className="mtw:w-full mtw:h-full mtw:border-0 mtw:flex-1"
        />
      )}
    </div>
  );
};
