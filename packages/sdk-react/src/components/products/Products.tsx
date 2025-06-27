import { useCallback, useState } from 'react';

import { components } from '@/api';
import { ManageMeasureUnits } from '@/components/products/ProductDetails/components/ManageMeasureUnits';
import {
  ProductDetails,
  ProductDetailsView,
} from '@/components/products/ProductDetails/ProductDetails';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import { Dialog } from '@/ui/Dialog';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';

import { ProductsTable } from './ProductsTable';

export const Products = () => (
  <MoniteScopedProviders>
    <ProductsBase />
  </MoniteScopedProviders>
);

const ProductsBase = () => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: 'read',
      entityUserId: user?.id,
    });

  const [selectedProductId, setSelectedProductId] = useState<
    ProductServiceResponse['id'] | undefined
  >(undefined);
  const [detailsModalOpened, setDetailsModalOpened] = useState<boolean>(false);
  const [detailsViewMode, setDetailsViewMode] = useState<ProductDetailsView>(
    ProductDetailsView.Read
  );
  const [measureUnitsModalOpened, setMeasureUnitsModalOpened] =
    useState<boolean>(false);

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
    <>
      <PageHeader
        title={
          <>
            {t(i18n)`Products & Services`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setMeasureUnitsModalOpened(true)}
              className="mtw:mr-2"
            >
              {t(i18n)`Manage measure units`}
            </Button>
            <Button
              size="lg"
              disabled={!isCreateAllowed}
              onClick={openCreateModal}
            >
              {t(i18n)`Create new`}
            </Button>
          </>
        }
      />
      {!isReadAllowedLoading && !isReadAllowed && <AccessRestriction />}
      {isReadAllowed && (
        <ProductsTable
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDeleted={onDelete}
          openCreateModal={openCreateModal}
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
      <Dialog
        open={measureUnitsModalOpened}
        alignDialog="right"
        container={root}
        onClose={() => setMeasureUnitsModalOpened(false)}
      >
        <ManageMeasureUnits
          handleClose={() => setMeasureUnitsModalOpened(false)}
        />
      </Dialog>
    </>
  );
};

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
