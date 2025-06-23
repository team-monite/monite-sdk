import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface PayableDetailsForceActionDialogProps {
  open: boolean;
  type: 'approve' | 'reject';
  onClose: () => void;
  onConfirm: () => void;
}

export const PayableDetailsForceActionDialog = ({
  open,
  type,
  onClose,
  onConfirm,
}: PayableDetailsForceActionDialogProps) => {
  const { i18n } = useLingui();
  const isApprove = type === 'approve';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      container={() => document.body}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ p: '16px !important' }}>
        <Typography variant="h5" fontWeight={600}>
          {isApprove
            ? t(i18n)`Force Approve bill?`
            : t(i18n)`Force Reject bill?`}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 2, pb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {isApprove
            ? t(
                i18n
              )`The bill status will change to Approved, skipping the approval flow.`
            : t(
                i18n
              )`The bill status will change to Rejected, skipping the approval flow.`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 0, pt: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            textTransform: 'none',
            fontSize: '16px',
          }}
        >
          {t(i18n)`Cancel`}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isApprove ? 'primary' : 'error'}
        >
          {isApprove ? t(i18n)`Force Approve` : t(i18n)`Force Reject`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
