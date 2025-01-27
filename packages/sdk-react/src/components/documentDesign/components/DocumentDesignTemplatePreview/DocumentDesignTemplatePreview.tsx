import { components } from '@/api';
import { ImageWithSkeleton } from '@/ui/imageWithSkeleton';
import { Box } from '@mui/material';

export interface DocumentDesignTemplatePreviewProps {
  template: components['schemas']['TemplateReceivableResponse'];
}

export const DocumentDesignTemplatePreview = ({
  template,
}: DocumentDesignTemplatePreviewProps) => (
  <Box sx={{ width: 595 }}>
    <ImageWithSkeleton url={template.preview?.url} alt={template.name} />
  </Box>
);
