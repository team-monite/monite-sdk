import { useDocumentTemplatesApi } from '../hooks';
import { TemplateName } from '../types';
import { SelectableDocumentType } from '../types';
import { formatTemplateName } from '../utils';
import { LogoSelection } from './LogoSelection';
import { TemplatesSelection } from './TemplatesSelection';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Divider, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

type LayoutAndLogoProps = {
  shouldApplyDialogStyles?: boolean;
  documentType?: SelectableDocumentType;
};

export const LayoutAndLogo = ({
  shouldApplyDialogStyles,
  documentType,
}: LayoutAndLogoProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const {
    invoiceTemplates,
    defaultInvoiceTemplate,
    isLoading,
    setDefaultTemplate,
  } = useDocumentTemplatesApi(documentType);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>();

  useEffect(() => {
    setSelectedTemplate(defaultInvoiceTemplate);
  }, [defaultInvoiceTemplate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div
      className={`mtw:flex mtw:flex-col mtw:gap-10 mtw:xl:gap-20 ${
        shouldApplyDialogStyles ? 'mtw:md:flex-row' : 'mtw:lg:flex-row'
      }`}
    >
      {componentSettings?.templateSettings?.showTemplateSection &&
        componentSettings?.templateSettings?.showTemplatePreview && (
          <div className="mtw:w-[400px] mtw:h-auto mtw:min-w-[400px]">
            {selectedTemplate && (
              <img
                src={selectedTemplate?.preview?.url as string}
                alt={t(i18n)`Preview of ${selectedTemplate.name || 'template'}`}
                className="mtw:w-[400px] mtw:h-[566px] mtw:border mtw:border-gray-200 mtw:shadow-[0_3px_13px_rgba(17,17,17,0.16)]"
              />
            )}
          </div>
        )}
      <div className="mtw:flex mtw:flex-col mtw:gap-10">
        {componentSettings?.templateSettings?.showTemplateSection && (
          <>
            <TemplatesSelection
              templates={invoiceTemplates}
              selectTemplate={(template) => setSelectedTemplate(template)}
              selectedTemplateId={selectedTemplate?.id}
              isDefaultButtonDisabled={
                defaultInvoiceTemplate?.id === selectedTemplate?.id
              }
              handleSetDefault={() => {
                const formattedName = formatTemplateName(
                  i18n,
                  (selectedTemplate?.name ?? 'unknown') as TemplateName
                );

                selectedTemplate &&
                  setDefaultTemplate(selectedTemplate.id, formattedName);
              }}
            />

            <Divider />
          </>
        )}

        {componentSettings?.templateSettings?.showLogoSection && (
          <LogoSelection shouldApplyDialogStyles={shouldApplyDialogStyles} />
        )}
      </div>
    </div>
  );
};

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];
