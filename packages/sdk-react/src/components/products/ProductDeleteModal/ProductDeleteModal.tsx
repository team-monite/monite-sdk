import { toast } from 'react-hot-toast';

import { ExistingProductDetailsProps } from '@/components/products/ProductDetails/ProductDetails';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
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

type ProductDeleteModalProps = Pick<
  ExistingProductDetailsProps,
  'onDeleted' | 'id'
> & {
  /** Is the modal open? */
  open: boolean;

  /** Callback which fires when the user decided to close the modal or deletion was sucsessful */
  onClose: () => void;
};

export const ProductDeleteModal = ({
  id,
  open,
  onClose,
  onDeleted,
}: ProductDeleteModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api, queryClient } = useMoniteContext();
  const { data: product, isLoading } = api.products.getProductsId.useQuery({
    path: { product_id: id },
  });

  const deleteProductMutation = api.products.deleteProductsId.useMutation(
    {
      path: {
        product_id: id,
      },
    },
    {
      onSuccess: async () => {
        await api.products.getProducts.invalidateQueries(queryClient);
        toast.success(t(i18n)`Product was deleted.`);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to delete product.`);
      },
    }
  );

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
            deleteProductMutation.mutate(undefined, {
              onSuccess: () => {
                onClose();
                onDeleted?.(id);
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
