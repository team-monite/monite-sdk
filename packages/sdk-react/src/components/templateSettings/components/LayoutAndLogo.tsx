import { useState, useEffect } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Divider, CircularProgress } from '@mui/material';

import { useDocumentTemplatesApi } from '../hooks';
import { LogoSelection } from './LogoSelection';
import { TemplatePreview } from './TemplatePreview';
import { TemplatesSelection } from './TemplatesSelection';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

type Props = {
  isDialog: boolean;
};

export const LayoutAndLogo = ({ isDialog }: Props) => {
  const { componentSettings } = useMoniteContext();
  const {
    invoiceTemplates,
    defaultInvoiceTemplate,
    isLoading,
    setDefaultTemplate,
  } = useDocumentTemplatesApi();
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
        isDialog ? 'mtw:md:flex-row' : 'mtw:lg:flex-row'
      }`}
    >
      {componentSettings?.templateSettings?.showTemplateSection &&
        componentSettings?.templateSettings?.showTemplatePreview && (
          <div className="mtw:w-[400px] mtw:h-auto mtw:min-w-[400px]">
            {selectedTemplate && (
              <TemplatePreview template={selectedTemplate} />
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
                selectedTemplate &&
                  setDefaultTemplate(
                    selectedTemplate.id,
                    selectedTemplate.name
                  );
              }}
            />

            <Divider />
          </>
        )}

        {componentSettings?.templateSettings?.showLogoSection && (
          <LogoSelection isDialog={isDialog} />
        )}
      </div>
    </div>
  );
};
