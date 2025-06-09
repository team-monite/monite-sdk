import { useState } from 'react';

import { useDialog } from '@/components/Dialog';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { ProductDeleteModal } from '@/components/products/ProductDeleteModal';
import {
  ExistingProductDetailsProps,
  ProductDetailsView,
} from '@/components/products/ProductDetails/ProductDetails';
import { ProductEditForm } from '@/components/products/ProductDetails/ProductEditForm';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Card,
  DialogContent,
  Table,
  TableBody,
  Typography,
} from '@mui/material';

import { ProductDetailsTableCell } from './components/ProductDetailsTableCell';
import { ProductType } from './components/ProductType';

export const ExistingProductDetails = (props: ExistingProductDetailsProps) => (
  <MoniteScopedProviders>
    <ExistingProductDetailsBase {...props} />
  </MoniteScopedProviders>
);

const ExistingProductDetailsBase = ({
  id,
  onUpdated,
  onDeleted,
  initialView = ProductDetailsView.Read,
}: ExistingProductDetailsProps) => {
  const { i18n } = useLingui();
  /**
   * In which mode the product details are displayed
   * It might be `read` - when the user is only viewing the product details
   *  or `edit` - when the user is editing the product details
   */
  const [view, setView] = useState<ProductDetailsView>(initialView);

  /** Is the deleting modal opened? */
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const dialogContext = useDialog();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { api, locale } = useMoniteContext();
  const {
    data: product,
    error: productQueryError,
    isLoading,
  } = api.products.getProductsId.useQuery({
    path: { product_id: id },
  });

  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: 'read',
      entityUserId: user?.id,
    });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'product',
    action: 'update',
    entityUserId: user?.id,
  });

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'product',
    action: 'delete',
    entityUserId: user?.id,
  });

  if (isLoading || isReadAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isReadAllowed) {
    return <AccessRestriction />;
  }

  if (productQueryError || !product) {
    return (
      <NotFound
        title={t(i18n)`Product not found`}
        description={t(i18n)`There is no product by provided id: ${id}`}
      />
    );
  }

  if (view === ProductDetailsView.Edit) {
    return (
      <ProductEditForm
        id={id}
        onUpdated={onUpdated}
        onCanceled={() => {
          setView(ProductDetailsView.Read);
        }}
      />
    );
  }

  return (
    <MoniteScopedProviders>
      <DialogHeader
        title={product.name}
        closeButtonTooltip={t(i18n)`Close product details`}
      />
      <DialogContent>
        <ProductDeleteModal
          id={id}
          open={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
          }}
          onDeleted={(productId) => {
            dialogContext?.onClose?.();
            onDeleted?.(productId);
          }}
        />
        <Box mb={3}>
          <Card variant="outlined">
            <Table>
              <TableBody>
                <ProductDetailsTableCell
                  label={t(i18n)`Name`}
                  value={product.name}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Description`}
                  value={product.description}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Type`}
                  value={
                    product.type ? <ProductType type={product.type} /> : null
                  }
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Unit`}
                  value={
                    product.measure_unit_id ? (
                      <MeasureUnit unitId={product.measure_unit_id} />
                    ) : (
                      '—'
                    )
                  }
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Minimum quantity`}
                  value={product.smallest_amount}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Price per unit`}
                  value={
                    product.price
                      ? formatCurrencyToDisplay(
                          product.price?.value,
                          product.price?.currency
                        )
                      : null
                  }
                />
              </TableBody>
            </Table>
          </Card>
        </Box>
        <Typography variant="subtitle1">{t(i18n)`History`}</Typography>
        <Box mt={2}>
          <Card variant="outlined">
            <Table>
              <TableBody>
                <ProductDetailsTableCell
                  label={t(i18n)`Created on`}
                  value={i18n.date(product.created_at, locale.dateTimeFormat)}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Last update`}
                  value={i18n.date(product.updated_at, locale.dateTimeFormat)}
                />
              </TableBody>
            </Table>
          </Card>
        </Box>
      </DialogContent>
      <DialogFooter
        primaryButton={{
          label: t(i18n)`Edit`,
          onClick: () => setView(ProductDetailsView.Edit),
          isDisabled: !isUpdateAllowed,
        }}
        deleteButton={{
          label: t(i18n)`Delete`,
          onClick: () => setDeleteModalOpened(true),
          isDisabled: !isDeleteAllowed,
        }}
      />
    </MoniteScopedProviders>
  );
};
