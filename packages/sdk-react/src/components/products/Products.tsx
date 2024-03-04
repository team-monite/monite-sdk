import { useCallback, useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import {
  ProductDetails,
  ProductDetailsView,
} from '@/components/products/ProductDetails/ProductDetails';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ProductServiceResponse } from '@monite/sdk-api';
import { Button, CircularProgress } from '@mui/material';

import { ProductsTable } from './ProductsTable';

export const Products = () => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isInitialLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: ActionEnum.CREATE,
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isInitialLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });

  const [selectedProductId, setSelectedProductId] = useState<
    ProductServiceResponse['id'] | undefined
  >(undefined);
  const [detailsModalOpened, setDetailsModalOpened] = useState<boolean>(false);
  const [detailsViewMode, setDetailsViewMode] = useState<ProductDetailsView>(
    ProductDetailsView.Read
  );

  const onRowClick = useCallback((product: ProductServiceResponse) => {
    setSelectedProductId(product.id);
    setDetailsModalOpened(true);
    setDetailsViewMode(ProductDetailsView.Read);
  }, []);

  const closeModal = useCallback(() => {
    setDetailsModalOpened(false);
  }, []);

  const closedModal = useCallback(() => {
    setSelectedProductId(undefined);
  }, []);

  const openCreateModal = useCallback(() => {
    setSelectedProductId(undefined);
    setDetailsModalOpened(true);
  }, []);

  const onEdit = useCallback((product: ProductServiceResponse) => {
    setSelectedProductId(product.id);
    setDetailsModalOpened(true);
    setDetailsViewMode(ProductDetailsView.Edit);
  }, []);

  const onDelete = useCallback((productId: ProductServiceResponse['id']) => {
    setSelectedProductId(productId);
  }, []);

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={
          <>
            {t(i18n)`Products`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          isCreateAllowed ? (
            <Button
              variant="contained"
              color="primary"
              onClick={openCreateModal}
            >
              {t(i18n)`Create New`}
            </Button>
          ) : null
        }
      />
      {!isReadAllowedLoading && !isReadAllowed && <AccessRestriction />}
      {isReadAllowed && (
        <ProductsTable
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDeleted={onDelete}
        />
      )}
      <Dialog
        open={detailsModalOpened && !selectedProductId}
        alignDialog="right"
        container={root}
        onClose={closeModal}
        onClosed={closedModal}
      >
        <ProductDetails onCreated={closeModal} />
      </Dialog>
      <Dialog
        open={detailsModalOpened && Boolean(selectedProductId)}
        alignDialog="right"
        container={root}
        onClose={closeModal}
        onClosed={closedModal}
      >
        <ProductDetails id={selectedProductId} initialView={detailsViewMode} />
      </Dialog>
    </MoniteStyleProvider>
  );
};
