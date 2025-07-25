import type { InvoicePreviewBaseProps } from './InvoicePreview.types';
import { InvoicePreview as LegacyTemplate } from './InvoicePreviewLegacy';
import { MoniteTemplate } from './InvoicePreviewMonite';
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
        'mtw:flex mtw:justify-center mtw:items-start',
        'mtw:w-full mtw:h-full mtw:overflow-auto mtw:relative',
        'mtw:p-12', // 48px padding (12 * 4px)
        'mtw:bg-gradient-to-br mtw:from-slate-50 mtw:to-slate-200'
      )}
    >
      <AspectRatio
        ratio={21 / 29.7}
        className={cn(
          // Maximum width constraints for A4
          'mtw:max-w-[21cm]',
          // Minimum dimensions for proper scaling
          'mtw:min-w-[794px] mtw:min-h-[1123px]',
          // Responsive scaling with our adaptive scale hook
          'mtw:transition-transform mtw:duration-200 mtw:ease-in-out',
          'mtw:origin-top',
          // Ensure proper sizing
          'mtw:flex-shrink-0'
        )}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <div
          ref={previewRef}
          className={cn(
            // Full size within aspect ratio container
            'mtw:w-full mtw:h-full',
            'mtw:bg-white mtw:flex-shrink-0',
            'mtw:shadow-md mtw:rounded-sm',
            // Remove overflow-auto to prevent inner scrolling
            'mtw:overflow-hidden'
          )}
        >
          {isMoniteTemplate ? (
            <MoniteTemplate {...templateProps} />
          ) : (
            <LegacyTemplate {...templateProps} />
          )}
        </div>
      </AspectRatio>
    </div>
  );
};
