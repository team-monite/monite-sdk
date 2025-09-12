import { PURCHASE_ORDER_CONSTANTS } from '../../constants';
import type { PurchaseOrderLineItem } from '../../validation';
import { PurchaseOrderPreviewMonite } from './PurchaseOrderPreviewMonite';
import { components } from '@/api';
import { useAdaptiveScale } from '@/hooks/useAdaptiveScale';
import { AspectRatio } from '@/ui/components/aspect-ratio';
import { cn } from '@/ui/lib/utils';
import { addDays } from 'date-fns';
import { useMemo, useRef } from 'react';

export interface PurchaseOrderPreviewBaseProps {
  purchaseOrderData: {
    valid_for_days?: number;
    expiry_date?: Date | string;
    line_items?: PurchaseOrderLineItem[];
    message?: string;
    footer?: string;
    entity_bank_account_id?: string;
    vat_mode?: components['schemas']['VatModeEnum'];
  };
  counterpart?: components['schemas']['CounterpartResponse'] | null;
  currency?: string;
  isNonVatSupported?: boolean;
  entityData?: components['schemas']['EntityResponse'] | null;
  counterpartAddress?: components['schemas']['CounterpartAddress'] | null;
  entityVatIds?: components['schemas']['EntityVatIDResourceList'] | null;
  counterpartVats?:
    | components['schemas']['CounterpartVatIDResourceList']
    | null;
}

export const PurchaseOrderPreview = ({
  purchaseOrderData,
  counterpart,
  currency = 'USD',
  isNonVatSupported: _isNonVatSupported = false,
  entityData,
  counterpartAddress,
  entityVatIds: _entityVatIds,
  counterpartVats: _counterpartVats,
}: PurchaseOrderPreviewBaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const expiryDate = useMemo(() => {
    if (purchaseOrderData.expiry_date) {
      return new Date(purchaseOrderData.expiry_date);
    }
    const validForDays =
      purchaseOrderData.valid_for_days ||
      PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS;
    return addDays(new Date(), validForDays);
  }, [purchaseOrderData.expiry_date, purchaseOrderData.valid_for_days]);

  const scale = useAdaptiveScale(containerRef, previewRef, {
    containerPadding: 96,
    minScale: PURCHASE_ORDER_CONSTANTS.MIN_PREVIEW_SCALE,
    initialDelay: 100,
    useAdaptiveDimensions: true,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        // Container layout
        'mtw:flex mtw:overflow-auto mtw:relative',
        'mtw:w-full mtw:h-full mtw:min-h-0',
        'mtw:p-12', // 48px padding
        'mtw:bg-gradient-to-br mtw:from-slate-50 mtw:to-slate-200',
        // Force pixel-snapping for zoom stability
        'mtw:[transform:translateZ(0)]'
      )}
      style={{
        justifyContent: 'safe center',
        alignItems: 'safe center',
      }}
    >
      <AspectRatio
        ratio={PURCHASE_ORDER_CONSTANTS.A4_PAPER_RATIO}
        className={cn(
          // Maximum width constraints for A4
          'mtw:max-w-[21cm]',
          // Minimum dimensions for proper scaling (A4: 794×1123px = 21cm × 29.7cm)
          'mtw:min-w-[794px] mtw:min-h-[1123px]',
          // Responsive scaling with our adaptive scale hook
          'mtw:transition-transform mtw:duration-200 mtw:ease-in-out',
          // Respect reduced motion preferences
          'motion-reduce:mtw:transition-none',
          'mtw:origin-center',
          // Prevent unwanted shrinking and layout shifts
          'mtw:flex-shrink-0',
          // CSS containment for layout stability
          'mtw:[contain:"layout style"]'
        )}
        style={{
          // Dynamic transform must stay as inline style due to variable
          transform: `scale(${scale})`,
        }}
      >
        <div
          ref={previewRef}
          className={cn(
            // Full size within aspect ratio container
            'mtw:w-full mtw:h-full',
            'mtw:bg-white mtw:flex-shrink-0',
            'mtw:shadow-md',
            'mtw:overflow-hidden'
          )}
        >
          <PurchaseOrderPreviewMonite
            purchaseOrderData={purchaseOrderData}
            counterpart={counterpart}
            currency={currency}
            entityData={entityData}
            counterpartAddress={counterpartAddress}
            expiryDate={expiryDate}
            isNonVatSupported={_isNonVatSupported}
          />
        </div>
      </AspectRatio>
    </div>
  );
};
