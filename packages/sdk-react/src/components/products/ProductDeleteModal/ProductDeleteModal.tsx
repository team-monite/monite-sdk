'use client';

import { ExistingProductDetailsProps } from '@/components/products/ProductDetails/ProductDetails';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useDeleteProduct, useProductById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Skeleton,
} from '@mui/material';

type OptionalValues = Partial<Pick<ExistingProductDetailsProps, 'id'>>;

type IProductDeleteModalProps = Pick<ExistingProductDetailsProps, 'onDeleted'> &
  OptionalValues & {
    /** Is the modal open */
    open: boolean;

    /** Callback which fires when the user decided to close the modal or deletion was sucsessful */
    onClose: () => void;
  };

export const ProductDeleteModal = ({
  id,
  open,
  onClose,
  onDeleted,
}: IProductDeleteModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { data: product, isLoading } = useProductById(id);

  const deleteProductMutation = useDeleteProduct();

  return (
    <Dialog
      open={open && Boolean(id)}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Products delete confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">
        {!product ? <Skeleton /> : t(i18n)`Delete Product "${product.name}"?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(i18n)`This action can't be undone.`}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={deleteProductMutation.isPending || isLoading}
          onClick={() => {
            deleteProductMutation.mutate(id!, {
              onSuccess: () => {
                onClose();
                onDeleted?.(id!);
              },
            });
          }}
          autoFocus
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
