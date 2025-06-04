import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

type DiscardChangesModalProps = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
};

export const DiscardChangesModal = ({
  open,
  onClose,
  onContinue,
}: DiscardChangesModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`You have unsaved changes`}
      maxWidth="sm"
      fullWidth
    >
      <header className="mtw:px-8 mtw:pt-8 mtw:pb-6">
        <h2 className="mtw:text-2xl mtw:font-semibold mtw:leading-8 mtw:text-neutral-10">
          {t(i18n)`You have unsaved changes`}
        </h2>
      </header>

      <DialogContent sx={{ py: 0 }}>
        <p className="mtw:text-base mtw:font-normal mtw:leading-6">{t(
          i18n
        )`Any unsaved changes will be lost.`}</p>
        <p className="mtw:text-base mtw:font-normal mtw:leading-6">{t(
          i18n
        )`Are you sure you want to quit without saving?`}</p>
      </DialogContent>

      <DialogActions sx={{ px: 4 }}>
        <Button variant="text" onClick={onClose} color="primary" autoFocus>
          {t(i18n)`Cancel`}
        </Button>
        <Button variant="contained" color="error" onClick={onContinue}>
          {t(i18n)`Quit without saving`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
