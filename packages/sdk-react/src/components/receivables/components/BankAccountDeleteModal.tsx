import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, Dialog, Typography } from '@mui/material';

interface BankAccountDeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  handleDelete: () => void;
}

export const BankAccountDeleteModal = ({
  open,
  isDeleting,
  onClose,
  handleDelete,
}: BankAccountDeleteModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Bank account delete confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <Box px={4} pt={4} pb={3}>
        <Typography
          variant="h3"
          fontWeight={600}
          fontSize={24}
          lineHeight="32px"
        >
          {t(i18n)`Delete bank account?`}
        </Typography>
      </Box>
      <Box px={4}>
        <Typography variant="body1">
          {t(
            i18n
          )`Draft or already issued invoices will keep this bank account. If required, you will need to manually update those invoices with new account information.`}
        </Typography>
      </Box>

      <Box
        height={96}
        px={4}
        pt={2}
        pb={2}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button variant="text" onClick={onClose} color="primary">{t(
          i18n
        )`Cancel`}</Button>
        <Button
          variant="contained"
          color="error"
          disabled={isDeleting}
          onClick={handleDelete}
          autoFocus
        >{t(i18n)`Delete`}</Button>
      </Box>
    </Dialog>
  );
};
