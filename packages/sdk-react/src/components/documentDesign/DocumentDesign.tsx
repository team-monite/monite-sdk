import { useState } from 'react';

import { PageHeader } from '@/components';
import { Dialog } from '@/components/Dialog';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, Button, Stack } from '@mui/material';

import { DocumentDesignSelection } from './components/DocumentDesignSelection/DocumentDesignSelection';
import previewImg from './preview.png';

const DocumentDesignBase = () => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);

  return (
    <>
      <PageHeader title={t(i18n)`Document design`} />
      <Box
        padding={2}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(#F4F0FE, #FFFFFF)',
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: 0,
        }}
      >
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', paddingBottom: 2 }}
        >
          <Box>
            <Typography variant="h3">
              {t(i18n)`Set your document style`}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {t(i18n)`Various templates for your documents`}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={() => setIsDesignDialogOpen(true)}
            >{t(i18n)`Select template`}</Button>
          </Box>
        </Stack>
        <Box sx={{ marginRight: 6 }}>
          <img src={previewImg} />
        </Box>
      </Box>
      <Dialog
        open={isDesignDialogOpen}
        container={root}
        onClose={() => setIsDesignDialogOpen(false)}
        fullScreen
      >
        <DocumentDesignSelection />
      </Dialog>
    </>
  );
};

export const DocumentDesign = () => (
  <MoniteScopedProviders>
    <DocumentDesignBase />
  </MoniteScopedProviders>
);
