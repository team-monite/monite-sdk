import { useCallback, useId, useRef } from 'react';

import { useDialog } from '@/components/Dialog';
import { ExistingProductDetailsProps } from '@/components/products/ProductDetails/ProductDetails';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import {
  useMeasureUnits,
  useProductById,
  useUpdateProduct,
} from '@/core/queries';
import { CenteredContentBox } from '@/ui/box';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CurrencyEnum,
  ProductServiceRequest,
  ProductServiceTypeEnum,
} from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { ProductForm } from '../components/ProductForm';
import { IProductFormSubmitValues } from '../validation';

type IProductEditFormProps = Pick<
  ExistingProductDetailsProps,
  'id' | 'onUpdated'
> & {
  /**
   * Callback called when the user clicks on `Cancel` button
   *  or the user successfily updated the product
   */
  onCanceled: () => void;
};

export const ProductEditForm = (props: IProductEditFormProps) => (
  <MoniteScopedProviders>
    <ProductEditFormBase {...props} />
  </MoniteScopedProviders>
);

const ProductEditFormBase = (props: IProductEditFormProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { formatToMinorUnits, formatFromMinorUnits } = useCurrencies();

  const {
    data: product,
    error: productQueryError,
    isLoading,
  } = useProductById(props.id);
  const { isLoading: isMeasureUnitsLoading } = useMeasureUnits();

  const productUpdateMutation = useUpdateProduct('id' in props ? props.id : '');

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const productFormId = `Monite-ProductForm-${useId()}`;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (productQueryError || !product) {
    return (
      <>
        <Grid container alignItems="center">
          <Grid item xs={11}>
            <Typography variant="h3" sx={{ padding: 3 }}>
              {t(i18n)`Edit Product`}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {dialogContext?.isDialogContent && (
              <IconButton
                aria-label={t(i18n)`Edit Product Close`}
                onClick={dialogContext.onClose}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Divider />
        <CenteredContentBox>
          <Stack alignItems="center" spacing={2}>
            <Box>
              <SearchOffIcon fontSize="large" color="error" />
            </Box>
            <Stack alignItems="center" spacing={1}>
              <Typography>{t(
                i18n
              )`Something went wrong. Please try again`}</Typography>
            </Stack>
          </Stack>
        </CenteredContentBox>
      </>
    );
  }

  const defaultValues = {
    name: product.name,
    type: product.type ?? ProductServiceTypeEnum.PRODUCT,
    units: product.measure_unit_id,
    smallestAmount: product.smallest_amount,
    pricePerUnit:
      formatFromMinorUnits(
        product.price?.value as number,
        product.price?.currency as CurrencyEnum
      ) ?? undefined,
    currency: product.price?.currency,
    description: product.description ?? '',
  };

  const handleSubmit = async (values: IProductFormSubmitValues) => {
    const payload: ProductServiceRequest = {
      name: values.name,
      type: values.type,
      measure_unit_id: values.units,
      smallest_amount: values.smallestAmount,
      price: {
        value:
          formatToMinorUnits(values.pricePerUnit, values.currency) ??
          values.pricePerUnit,
        currency: values.currency,
      },
      description: values.description,
    };

    return productUpdateMutation.mutate(payload, {
      onSuccess: (product) => {
        props.onUpdated?.(product);
        // TODO: Restore `props.onCanceled()` in onSuccess to switch details dialog from edit to read mode,
        // or introduce a new variable (e.g., `viewMode`, `isEdit`) to handle this transition.
        // see: https://github.com/team-monite/monite-sdk/pull/101#discussion_r1630759805
        props.onCanceled();
      },
    });
  };

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {t(i18n)`Edit Product`}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {dialogContext?.isDialogContent && (
            <IconButton
              aria-label={t(i18n)`Edit Product Close`}
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
        <ProductForm
          formId={productFormId}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={props.onCanceled}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          type="submit"
          form={productFormId}
          disabled={productUpdateMutation.isPending || isMeasureUnitsLoading}
        >
          {t(i18n)`Update`}
        </Button>
      </DialogActions>
    </>
  );
};
