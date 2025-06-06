import { useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { FinanceHowItWorks } from '@/components/financing/components/FinanceHowItWorks';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack, Button } from '@mui/material';

export const FinanceMenuButtons = () => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Button variant="text" onClick={() => setIsDialogOpen(true)}>
        {t(i18n)`How does invoice financing work?`}
      </Button>

      <Button
        onClick={() => startFinanceSession()}
        variant="contained"
        color="primary"
        sx={{
          px: 2.5,
          py: 1.5,

          height: 40,
        }}
      >
        {t(i18n)`Financing menu`}
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        alignDialog="right"
      >
        <FinanceHowItWorks />
      </Dialog>
    </Stack>
  );
};
