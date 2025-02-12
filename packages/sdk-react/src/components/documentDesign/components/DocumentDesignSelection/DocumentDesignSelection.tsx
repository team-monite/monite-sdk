import { useState, useEffect } from 'react';

import { components } from '@/api';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { Stack, Box } from '@mui/material';

import { useDocumentTemplatePreviewLoader } from '../../useDocumentTemplatePreviewLoader';
import { useDocumentTemplatesApi } from '../../useDocumentTemplatesApi';
import { DocumentDesignSelectionHeader } from '../DocumentDesignSelectionHeader';
import { DocumentDesignTemplatePreview } from '../DocumentDesignTemplatePreview';
import { DocumentDesignTemplates } from '../DocumentDesignTemplates';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export const DocumentDesignSelection = () => (
  <MoniteScopedProviders>
    <DocumentDesignSelectionBase />
  </MoniteScopedProviders>
);

const DocumentDesignSelectionBase = () => {
  const {
    invoiceTemplates,
    defaultInvoiceTemplate,
    isLoading,
    setDefaultTemplate,
  } = useDocumentTemplatesApi();
  const { getPreview } = useDocumentTemplatePreviewLoader();

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>();

  useEffect(() => {
    setSelectedTemplate(defaultInvoiceTemplate);
  }, [defaultInvoiceTemplate]);

  return (
    <>
      <DocumentDesignSelectionHeader
        canSetDefault={defaultInvoiceTemplate?.id !== selectedTemplate?.id}
        setDefault={() =>
          selectedTemplate &&
          setDefaultTemplate(selectedTemplate.id, selectedTemplate.name)
        }
      />
      {!isLoading && (
        <Stack
          direction="row"
          sx={{ mt: '32px', justifyContent: 'space-around' }}
        >
          <Box sx={{ maxWidth: 595, width: '100%' }}>
            {selectedTemplate && (
              <DocumentDesignTemplatePreview
                template={selectedTemplate}
                getPreview={getPreview}
              />
            )}
          </Box>
          <Box sx={{ maxWidth: 420 }}>
            <DocumentDesignTemplates
              templates={invoiceTemplates}
              selectTemplate={(template) => setSelectedTemplate(template)}
              selectedTemplateId={selectedTemplate?.id}
              getPreview={getPreview}
            />
          </Box>
        </Stack>
      )}
    </>
  );
};
