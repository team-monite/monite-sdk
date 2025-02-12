import { useEffect, useState } from 'react';

import { components } from '@/api';
import { FileViewer } from '@/ui/FileViewer';
import { Box, Skeleton } from '@mui/material';

export interface DocumentDesignTemplatePreviewProps {
  template: components['schemas']['TemplateReceivableResponse'];
  getPreview: (id: string) => Promise<string>;
}

export const DocumentDesignTemplatePreview = ({
  template,
  getPreview,
}: DocumentDesignTemplatePreviewProps) => {
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    const waitForPreview = async () => {
      setPreview(await getPreview(template.id));
    };

    waitForPreview();
  }, [template, getPreview]);

  return (
    <Box sx={{ width: 595, height: 835, position: 'relative' }}>
      {!preview && (
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: '100%' }}
        />
      )}
      {preview && (
        <FileViewer
          mimetype="application/pdf"
          url={preview}
          pdfHeight={'100%'}
          showPdfToolbar={0}
        />
      )}
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
        }}
      />
    </Box>
  );
};
