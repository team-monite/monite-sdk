import { EntitySection } from '../sections/PurchaseOrderEntitySection';
import { FullfillmentSummary } from '../sections/PurchaseOrderTermsSummary';
import { VendorSection } from '../sections/VendorSection';
import { components } from '@/api';
import { ConfigurableItemsSection } from '@/components/shared/ItemsSection';
import { PURCHASE_ORDERS_ITEMS_CONFIG } from '@/components/shared/ItemsSection/constants';
import { DialogContent } from '@mui/material';
import { memo } from 'react';

interface CreatePurchaseOrderFormProps {
  counterpart?: components['schemas']['CounterpartResponse'];
  counterpartAddresses?: components['schemas']['CounterpartAddressResourceList'];
  className?: string;
  disabled?: boolean;
  existingPurchaseOrder?:
    | components['schemas']['PurchaseOrderResponseSchema']
    | null;
  actualCurrency?: string;
  isNonVatSupported?: boolean;
}

export const CreatePurchaseOrderForm = memo(
  ({
    counterpart,
    className,
    disabled = false,
    actualCurrency = 'USD',
    isNonVatSupported = false,
  }: CreatePurchaseOrderFormProps) => {
    return (
      <DialogContent
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 3,
          py: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
        className={className + '-Form'}
      >
        <VendorSection counterpart={counterpart} disabled={disabled} />

        <ConfigurableItemsSection
          config={PURCHASE_ORDERS_ITEMS_CONFIG}
          actualCurrency={
            actualCurrency as components['schemas']['CurrencyEnum']
          }
          defaultCurrency={
            actualCurrency as components['schemas']['CurrencyEnum']
          }
          isNonVatSupported={isNonVatSupported}
          isVatSelectionDisabled={disabled}
        />

        <EntitySection disabled={disabled} />

        <FullfillmentSummary disabled={disabled} />
      </DialogContent>
    );
  }
);
