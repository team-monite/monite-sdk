import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { Alert, AlertDescription } from '@/ui/components/alert';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { LoadingSpinner } from '@/ui/loading';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

interface PurchaseOrderDeleteModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
  onDelete?: (purchaseOrderId: string) => void;
}

export const PurchaseOrderDeleteModal = (
  props: PurchaseOrderDeleteModalProps
) => (
  <MoniteScopedProviders>
    <PurchaseOrderDeleteModalBase {...props} />
  </MoniteScopedProviders>
);

const PurchaseOrderDeleteModalBase = ({
  id,
  open,
  onClose,
  onDelete,
}: PurchaseOrderDeleteModalProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();
  const [error, setError] = useState<string | null>(null);

  const deleteMutation =
    api.payablePurchaseOrders.deletePayablePurchaseOrdersId.useMutation(
      undefined,
      {
        onSuccess: () => {
          onDelete?.(id);
          onClose();
        },
        onError: (error) => {
          setError(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const handleDelete = () => {
    setError(null);
    deleteMutation.mutate({
      header: { 'x-monite-entity-id': entityId },
      path: { purchase_order_id: id },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t(i18n)`Delete Purchase Order`}</DialogTitle>
        </DialogHeader>
        <div className="mtw:text-sm">
          {t(
            i18n
          )`Are you sure you want to delete this purchase order? This action cannot be undone.`}
        </div>
        {error && (
          <Alert variant="error" className="mtw:mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <span className="mtw:flex mtw:items-center mtw:gap-2">
                <LoadingSpinner className="mtw:w-4 mtw:h-4 mtw:border-inherit mtw:border-t-transparent" />
                {t(i18n)`Deleting...`}
              </span>
            ) : (
              t(i18n)`Delete`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
