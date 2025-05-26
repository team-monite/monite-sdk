import { useState, useEffect } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Stack, Box, Divider, CircularProgress } from '@mui/material';

import { useDocumentTemplatesApi } from '../hooks';
import { LogoSelection } from './LogoSelection';
import { TemplatePreview } from './TemplatePreview';
import { TemplatesSelection } from './TemplatesSelection';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export const LayoutAndLogo = () => {
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
    <Stack direction="row" gap={10}>
      {componentSettings?.templateSettings?.showTemplateSection &&
        componentSettings?.templateSettings?.showTemplatePreview && (
          <Box sx={{ width: 400, height: 'auto', minWidth: 400 }}>
            {selectedTemplate && (
              <TemplatePreview template={selectedTemplate} />
            )}
          </Box>
        )}
      <Stack gap={5}>
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
          <LogoSelection />
        )}
      </Stack>
    </Stack>
  );
};
