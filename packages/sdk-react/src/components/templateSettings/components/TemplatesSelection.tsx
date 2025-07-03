import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Typography, Grid, Button, Box } from '@mui/material';

import { TemplateOption } from './TemplateOption';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export interface TemplatesSelectionProps {
  templates: DocumentTemplate[];
  selectTemplate: (template: DocumentTemplate) => void;
  selectedTemplateId?: DocumentTemplate['id'];
  isDefaultButtonDisabled?: boolean;
  handleSetDefault?: () => void;
}

export const TemplatesSelection = ({
  templates,
  selectTemplate,
  selectedTemplateId,
  isDefaultButtonDisabled,
  handleSetDefault,
}: TemplatesSelectionProps) => {
  const { i18n } = useLingui();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box>
        <Typography
          variant="h3"
          sx={{ fontSize: '18px', fontWeight: '600' }}
        >{t(i18n)`PDF Layout`}</Typography>
        <Typography variant="body2">{t(
          i18n
        )`The setting will apply to all your future documents`}</Typography>
      </Box>

      <Grid container spacing={1}>
        {templates.map((template) => (
          <Grid item xs="auto" key={template.id}>
            <TemplateOption
              template={template}
              onSelect={() => selectTemplate(template)}
              isSelected={template.id === selectedTemplateId}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        disabled={isDefaultButtonDisabled}
        variant="contained"
        onClick={handleSetDefault}
        sx={{
          width: 'fit-content',
          minWidth: '128px',
          py: 2,
          fontSize: 14,
          fontWeight: 500,
          height: '32px',
        }}
      >
        {t(i18n)`Set as default`}
      </Button>
    </Box>
  );
};
