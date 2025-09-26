import { EntitySection } from '../sections/PurchaseOrderEntitySection';
import { FullfillmentSummary } from '../sections/PurchaseOrderTermsSummary';
import { VendorSection } from '../sections/VendorSection';
import { components } from '@/api';
import { ConfigurableItemsSection } from '@/components/shared/ItemsSection';
import type { CreatePurchaseOrderFormBeforeValidationProps } from '../types';
import { PURCHASE_ORDERS_ITEMS_CONFIG } from '@/components/shared/ItemsSection/consts';
import { memo } from 'react';
import { FormErrorDisplay as POFormErrorDisplay } from './FormErrorDisplay';
import type { ErrorDisplayProps as POErrorDisplayProps } from './FormErrorDisplay';

interface CreatePurchaseOrderFormComponentProps {
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
  }: CreatePurchaseOrderFormComponentProps) => {
    return (
      <div
        className={(className + '-Form') + ' mtw:flex mtw:flex-1 mtw:overflow-auto mtw:px-3 mtw:py-0 mtw:flex-col mtw:gap-3'}
      >
        <VendorSection counterpart={counterpart} disabled={disabled} />

        <ConfigurableItemsSection<CreatePurchaseOrderFormBeforeValidationProps>
          config={PURCHASE_ORDERS_ITEMS_CONFIG}
          actualCurrency={
            actualCurrency as components['schemas']['CurrencyEnum']
          }
          defaultCurrency={
            actualCurrency as components['schemas']['CurrencyEnum']
          }
          isNonVatSupported={isNonVatSupported}
          isVatSelectionDisabled={disabled}
          renderErrorDisplay={({ generalError, fieldErrors }) => (
            <POFormErrorDisplay
              generalError={generalError}
              fieldErrors={fieldErrors as POErrorDisplayProps['fieldErrors']}
            />
          )}
        />

        <EntitySection disabled={disabled} />

        <FullfillmentSummary disabled={disabled} />
      </div>
    );
  }
);
