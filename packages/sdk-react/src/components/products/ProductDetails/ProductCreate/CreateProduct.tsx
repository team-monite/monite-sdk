import { useId, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components/Dialog';
import { ProductDetailsCreateProps } from '@/components/products/ProductDetails/ProductDetails';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  type: 'product',
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

  const { api, queryClient } = useMoniteContext();

  const { mutate: createProduct, isPending } =
    api.products.postProducts.useMutation(undefined, {
      onSuccess: async (product) => {
        props.onCreated?.(product);
        await api.products.getProducts.invalidateQueries(queryClient);
        toast.success(t(i18n)`Product ${product.name} was created.`);
      },
      onError: () => {
        toast.error(t(i18n)`Failed to create product.`);
      },
    });

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

    return createProduct({
      body: payload,
    });
  };

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
          disabled={isPending}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};

type ProductServiceRequest = components['schemas']['ProductServiceRequest'];
