import { EmailPurchaseOrderDetails } from './EmailPurchaseOrderDetails';
import { ExistingPurchaseOrderDetails } from './ExistingPurchaseOrderDetails/ExistingPurchaseOrderDetails';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { usePurchaseOrderDetails } from './hooks/usePurchaseOrderDetails';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { CustomerTypes } from '@/components/counterparts/types';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

export interface PurchaseOrderDetailsProps {
  /** Purchase Order ID. If not provided, component will be used for creating a new purchase order */
  id?: string;
  onClose?: () => void;
  /** @see {@link CustomerTypes} */
  vendorTypes?: CustomerTypes;
  /** Callback fired when purchase order is saved */
  onSaved?: (purchaseOrderId: string) => void;
  /** Callback fired when purchase order is deleted */
  onDeleted?: (purchaseOrderId: string) => void;
}

export const PurchaseOrderDetails = (props: PurchaseOrderDetailsProps) => (
  <PurchaseOrderDetailsBase {...props} />
);

const PurchaseOrderDetailsBase = ({
  id,
  vendorTypes,
  onClose,
  onSaved,
  onDeleted,
}: PurchaseOrderDetailsProps) => {
  const { i18n } = useLingui();
  const {
    purchaseOrder,
    isLoading,
    isEdit,
    error,
    actions: { setEdit, savePurchaseOrder },
  } = usePurchaseOrderDetails({
    id,
    onSaved,
    onDeleted,
  });

  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    mode: 'issue_and_send' | 'send';
  }>({ open: false, mode: 'send' });

  const isCreate = !id;

  if (isLoading) {
    return <LoadingPage />;
  }

  if ((id && error) || (!isCreate && !purchaseOrder)) {
    return (
      <NotFound
        title={t(i18n)`Purchase order not found`}
        description={t(i18n)`There is no purchase order by provided id: ${id}`}
      />
    );
  }

  const className = 'Monite-PurchaseOrderDetails';

  if (isCreate || isEdit) {
    return (
      <div
        className={classNames(ScopedCssBaselineContainerClassName, className)}
      >
        <PurchaseOrderForm
          purchaseOrder={purchaseOrder}
          isCreate={isCreate}
          onSave={(purchaseOrderIdOrData) => {
            if (isCreate && typeof purchaseOrderIdOrData === 'string') {
              onSaved?.(purchaseOrderIdOrData);
            } else if (!isCreate && typeof purchaseOrderIdOrData !== 'string') {
              savePurchaseOrder(purchaseOrderIdOrData);
            }
          }}
          onCancel={() => (isCreate ? onClose?.() : setEdit(false))}
          vendorTypes={vendorTypes}
        />

        {purchaseOrder && (
          <EmailPurchaseOrderDetails
            purchaseOrderId={purchaseOrder.id}
            isOpen={emailDialog.open}
            mode={emailDialog.mode}
            onClose={() => setEmailDialog({ open: false, mode: 'send' })}
          />
        )}
      </div>
    );
  }

  return (
    <ExistingPurchaseOrderDetails
      id={id}
      onUpdate={(purchaseOrderId) => {
        onSaved?.(purchaseOrderId);
      }}
      onDelete={(purchaseOrderId) => {
        onDeleted?.(purchaseOrderId);
      }}
    />
  );
};
