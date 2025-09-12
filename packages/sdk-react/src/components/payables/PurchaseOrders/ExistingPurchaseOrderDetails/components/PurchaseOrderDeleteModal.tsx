import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface PurchaseOrderDeleteModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
  onDelete?: (purchaseOrderId: string) => void;
}

export const PurchaseOrderDeleteModal = (
  props: PurchaseOrderDeleteModalProps
) => (
  <MoniteScopedProviders>
    <PurchaseOrderDeleteModalBase {...props} />
  </MoniteScopedProviders>
);

const PurchaseOrderDeleteModalBase = ({
  id,
  open,
  onClose,
  onDelete,
}: PurchaseOrderDeleteModalProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();
  const { root } = useRootElements();
  const [error, setError] = useState<string | null>(null);

  const deleteMutation =
    api.payablePurchaseOrders.deletePayablePurchaseOrdersId.useMutation(
      undefined,
      {
        onSuccess: () => {
          onDelete?.(id);
          onClose();
        },
        onError: (error) => {
          setError(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const handleDelete = () => {
    setError(null);
    deleteMutation.mutate({
      header: { 'x-monite-entity-id': entityId },
      path: { purchase_order_id: id },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      container={root}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t(i18n)`Delete Purchase Order`}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t(
            i18n
          )`Are you sure you want to delete this purchase order? This action cannot be undone.`}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleteMutation.isPending}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={deleteMutation.isPending}
          startIcon={
            deleteMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
