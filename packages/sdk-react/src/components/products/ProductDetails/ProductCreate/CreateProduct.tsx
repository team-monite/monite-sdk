import { useCallback, useId, useMemo, useRef } from 'react';

import { useDialog } from '@/components/Dialog';
import { ProductDetailsCreateProps } from '@/components/products/ProductDetails/ProductDetails';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { useCreateProduct } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ProductServiceRequest, ProductServiceTypeEnum } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import { ProductForm } from '../components/ProductForm';
import { IProductFormSubmitValues, ProductFormValues } from '../validation';

const initialValues: ProductFormValues = {
  name: '',
  type: ProductServiceTypeEnum.PRODUCT,
  units: '',
  smallestAmount: undefined,
  pricePerUnit: undefined,
  currency: undefined,
  description: undefined,
};

export const CreateProduct = (props: ProductDetailsCreateProps) => (
  <MoniteScopedProviders>
    <CreateProductBase {...props} />
  </MoniteScopedProviders>
);

const CreateProductBase = (props: ProductDetailsCreateProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { formatToMinorUnits } = useCurrencies();

  const defaultValues = useMemo(
    () => ({ ...initialValues, ...props.defaultValues }),
    [props.defaultValues]
  );

  const productCreateMutation = useCreateProduct();

  const createProduct = useCallback(
    (req: ProductServiceRequest) => {
      productCreateMutation.mutate(req, {
        onSuccess: (product) => {
          props.onCreated?.(product);
        },
      });
    },
    [productCreateMutation, props]
  );

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

    return createProduct(payload);
  };

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const productFormId = `Monite-ProductForm-${useId()}`;

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {t(i18n)`Create New Product`}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {dialogContext?.isDialogContent && (
            <IconButton
              aria-label={t(i18n)`Create New Product Close`}
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
        {dialogContext && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={dialogContext.onClose}
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button
          variant="outlined"
          type="submit"
          form={productFormId}
          disabled={productCreateMutation.isPending}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
