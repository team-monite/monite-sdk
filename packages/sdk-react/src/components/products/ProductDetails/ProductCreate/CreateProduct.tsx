import { useCallback, useMemo, useRef } from 'react';

import { useDialog } from '@/components/Dialog';
import { IProductDetailsCreateProps } from '@/components/products/ProductDetails/ProductDetails';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
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

export const CreateProduct = (props: IProductDetailsCreateProps) => (
  <MoniteStyleProvider>
    <CreateProductBase {...props} />
  </MoniteStyleProvider>
);

const CreateProductBase = (props: IProductDetailsCreateProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { formatToMinorUnits } = useCurrencies();
  const formRef = useRef<HTMLFormElement>(null);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

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
          formRef={formRef}
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
          onClick={submitForm}
          disabled={productCreateMutation.isPending}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
