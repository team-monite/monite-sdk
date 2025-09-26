import { CustomerTypes } from '@/components/counterparts/types';
import { CreatePurchaseOrder } from './CreatePurchaseOrder';
import { components } from '@/api';

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrderResponse | null;
  isCreate?: boolean;
  vendorTypes?: CustomerTypes;
  onSave?: (purchaseOrderId: string) => void;
  onUpdate?: (purchaseOrder: PurchaseOrderResponse) => void;
  onCancel?: () => void;
}

export const PurchaseOrderForm = ({ 
  purchaseOrder,
  isCreate = true, 
  vendorTypes,
  onSave,
  onUpdate, 
  onCancel, 
}: PurchaseOrderFormProps) => {
  if (isCreate) {
    return (
      <CreatePurchaseOrder 
        type="purchase_order"
        onCreate={onSave}
        vendorTypes={vendorTypes}
      />
    );
  }

  return (
    <CreatePurchaseOrder 
      type="purchase_order"
      onCreate={onSave}
      onUpdate={onUpdate}
      vendorTypes={vendorTypes}
      existingPurchaseOrder={purchaseOrder}
      onCancel={onCancel}
    />
  );
};

type PurchaseOrderResponse = components['schemas']['PurchaseOrderResponseSchema'];
