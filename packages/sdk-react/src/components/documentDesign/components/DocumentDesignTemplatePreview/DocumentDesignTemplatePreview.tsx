import { components } from '@/api';
import { Box, Skeleton } from '@mui/material';

export interface DocumentDesignTemplatePreviewProps {
  template: components['schemas']['TemplateReceivableResponse'];
}

export const DocumentDesignTemplatePreview = ({
  template,
}: DocumentDesignTemplatePreviewProps) => {
  return (
    <Box sx={{ width: 595, height: 835, position: 'relative' }}>
      {!template && (
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: '100%' }}
        />
      )}

      {template && (
        <img
          src={template?.preview?.url as string}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid  #E1E5EA',
          }}
        />
      )}
    </Box>
  );
};
