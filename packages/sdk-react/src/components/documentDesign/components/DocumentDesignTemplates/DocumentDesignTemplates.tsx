import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Typography, Grid } from '@mui/material';

import { DocumentDesignTemplate } from '../DocumentDesignTemplate/DocumentDesignTemplate';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export interface DocumentDesignTemplatesProps {
  templates: DocumentTemplate[];
  selectTemplate: (template: DocumentTemplate) => void;
  selectedTemplateId?: DocumentTemplate['id'];
  getPreview: (id: string) => Promise<string>;
}

export const DocumentDesignTemplates = ({
  templates,
  selectTemplate,
  selectedTemplateId,
  getPreview,
}: DocumentDesignTemplatesProps) => {
  const { i18n } = useLingui();

  return (
    <>
      <Typography variant="h3" sx={{ fontSize: '30px', fontWeight: '500' }}>{t(
        i18n
      )`Document templates`}</Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>{t(
        i18n
      )`The template you set as the default will apply to all documents you issue in the future.`}</Typography>
      <Grid container sx={{ marginTop: 3 }} spacing={2}>
        {templates.map((template) => (
          <Grid item xs={4} key={template.id}>
            <DocumentDesignTemplate
              template={template}
              onSelect={() => selectTemplate(template)}
              isSelected={template.id === selectedTemplateId}
              getPreview={getPreview}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
