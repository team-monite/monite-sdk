import type { InvoicePreviewBaseProps } from './InvoicePreview.types';
import { InvoicePreviewLegacy } from './InvoicePreviewLegacy';
import { InvoicePreviewMonite } from './InvoicePreviewMonite';
import { useDocumentTemplatesApi } from '@/components/templateSettings/hooks/useDocumentTemplatesApi';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useAdaptiveScale } from '@/hooks/useAdaptiveScale';
import { AspectRatio } from '@/ui/components/aspect-ratio';
import { cn } from '@/ui/lib/utils';
import { useRef } from 'react';

export const InvoicePreview = ({
  address,
  counterpart,
  counterpartVats,
  currency,
  invoiceData,
  entityData,
  entityVatIds,
  isNonVatSupported,
  paymentTerms,
  templateName = 'default_monite',
}: InvoicePreviewBaseProps) => {
  const { defaultInvoiceTemplate } = useDocumentTemplatesApi();
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { api } = useMoniteContext();

  const { data: measureUnitsData } =
    api.measureUnits.getMeasureUnits.useQuery();

  const currentTemplate = templateName ?? defaultInvoiceTemplate?.name;
  const isMoniteTemplate = currentTemplate === 'default_monite';

  const scale = useAdaptiveScale(containerRef, previewRef, {
    containerPadding: 96,
    minScale: 1,
    initialDelay: 100,
    useAdaptiveDimensions: true, // Enable DPI-aware A4 dimensions
  });

  const templateProps = {
    address,
    counterpart,
    counterpartVats,
    currency,
    invoiceData,
    entityData,
    entityVatIds,
    isNonVatSupported,
    paymentTerms,
    measureUnits: measureUnitsData?.data || [],
  };

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
        ratio={21 / 29.7}
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
          {isMoniteTemplate ? (
            <InvoicePreviewMonite {...templateProps} />
          ) : (
            <InvoicePreviewLegacy {...templateProps} />
          )}
        </div>
      </AspectRatio>
    </div>
  );
};
