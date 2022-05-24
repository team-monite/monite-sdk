import { useState } from 'react';

import { useDialog } from '@/components/Dialog';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { ProductDeleteModal } from '@/components/products/ProductDeleteModal';
import {
  IExistingProductDetailsProps,
  ProductDetailsView,
} from '@/components/products/ProductDetails/ProductDetails';
import { ProductEditForm } from '@/components/products/ProductDetails/ProductEditForm';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { useProductById } from '@/core/queries/useProducts';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  Typography,
} from '@mui/material';

import { ProductDetailsTableCell } from './components/ProductDetailsTableCell';
import { ProductType } from './components/ProductType';

export const ExistingProductDetails = ({
  id,
  onUpdated,
  onDeleted,
  initialView = ProductDetailsView.Read,
}: IExistingProductDetailsProps) => {
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
  const {
    data: product,
    error: productQueryError,
    isInitialLoading,
  } = useProductById(id);

  const { data: isReadAvailable, isInitialLoading: isReadAvailableLoading } =
    useIsActionAllowed({
      method: 'product',
      action: ActionEnum.READ,
    });

  const { data: user } = useEntityUserByAuthToken();
  const { data: isUpdateSupported } = useIsActionAllowed({
    method: 'product',
    action: ActionEnum.UPDATE,
    entityUserId: user?.id,
  });
  const { data: isDeleteSupported } = useIsActionAllowed({
    method: 'product',
    action: ActionEnum.DELETE,
    entityUserId: user?.id,
  });

  if (isInitialLoading || isReadAvailableLoading) {
    return <LoadingPage />;
  }

  if (!isReadAvailable) {
    return (
      <MoniteStyleProvider>
        <AccessRestriction />
      </MoniteStyleProvider>
    );
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
    <MoniteStyleProvider>
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {i18n._('Product Details')}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {dialogContext?.isDialogContent && (
            <IconButton
              aria-label={t(i18n)`Product Close`}
              onClick={dialogContext.onClose}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <Divider />
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
                  label={t(i18n)`Name:`}
                  value={product.name}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Type:`}
                  value={
                    product.type ? <ProductType type={product.type} /> : null
                  }
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Description:`}
                  value={product.description}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Unit:`}
                  value={<MeasureUnit unitId={product.measure_unit_id} />}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Price:`}
                  value={
                    product.price
                      ? formatCurrencyToDisplay(
                          product.price?.value,
                          product.price?.currency
                        )
                      : null
                  }
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Smallest amount (units):`}
                  value={product.smallest_amount}
                />
              </TableBody>
            </Table>
          </Card>
        </Box>
        <Typography variant="subtitle2">{t(i18n)`Activity`}</Typography>
        <Box mt={2}>
          <Card variant="outlined">
            <Table>
              <TableBody>
                <ProductDetailsTableCell
                  label={t(i18n)`Created at:`}
                  value={i18n.date(
                    product.created_at,
                    DateTimeFormatOptions.EightDigitDateWithTime
                  )}
                />
                <ProductDetailsTableCell
                  label={t(i18n)`Last update:`}
                  value={i18n.date(
                    product.updated_at,
                    DateTimeFormatOptions.EightDigitDateWithTime
                  )}
                />
              </TableBody>
            </Table>
          </Card>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        {isDeleteSupported && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              // @todo: Anashev - must be changed. We have to remove it directly from this component
              // onDeleted?.(product);
              setDeleteModalOpened(true);
            }}
          >
            {t(i18n)`Delete`}
          </Button>
        )}
        {isUpdateSupported && (
          <Button
            variant="outlined"
            onClick={() => setView(ProductDetailsView.Edit)}
          >
            {t(i18n)`Edit`}
          </Button>
        )}
      </DialogActions>
    </MoniteStyleProvider>
  );
};
