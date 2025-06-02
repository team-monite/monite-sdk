import { toast } from 'react-hot-toast';

import { ExistingProductDetailsProps } from '@/components/products/ProductDetails/ProductDetails.types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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
  const { api, queryClient } = useMoniteContext();
  const { data: product } = api.products.getProductsId.useQuery({
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
        onClose();
        onDeleted?.(id);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to delete product.`);
      },
    }
  );

  const handleDelete = () => {
    deleteProductMutation.mutate(undefined);
  };

  if (!product) {
    return null;
  }

  return (
    <ConfirmationModal
      open={open && Boolean(id)}
      title={t(i18n)`Delete “${product.name}“?`}
      message={t(
        i18n
      )`It will remain in all the documents where it is added. You can’t undo this action.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={deleteProductMutation.isPending}
    />
  );
};
