import { useDialog } from '@/components/Dialog';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, Toolbar, Typography, Button } from '@mui/material';

export interface DocumentDesignSelectionHeaderProps {
  canSetDefault?: boolean;
  setDefault: () => void;
}

export const DocumentDesignSelectionHeader = ({
  canSetDefault = false,
  setDefault,
}: DocumentDesignSelectionHeaderProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  return (
    <DialogTitle>
      <Toolbar>
        {dialogContext?.isDialogContent && (
          <IconWrapper
            onClick={dialogContext.onClose}
            ariaLabelOverride={t(i18n)`Close document design selection`}
            tooltip={t(i18n)`Close document design selection`}
            sx={{ marginRight: 3 }}
          >
            <CloseIcon />
          </IconWrapper>
        )}

        <Typography variant="h3">{t(i18n)`Document design`}</Typography>
        <Button
          disabled={!canSetDefault}
          variant="contained"
          sx={{ marginLeft: 'auto' }}
          onClick={setDefault}
        >
          {t(i18n)`Set as default`}
        </Button>
      </Toolbar>
    </DialogTitle>
  );
};
