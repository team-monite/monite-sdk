import { useId, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { ExistingProductDetailsProps } from '@/components/products/ProductDetails/ProductDetails';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { CenteredContentBox } from '@/ui/box';
import { DialogFooter } from '@/ui/DialogFooter/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, DialogContent, Stack, Typography } from '@mui/material';

import { ProductCancelEditModal } from '../../ProductCancelEditModal';
import { ManageMeasureUnitsForm } from '../components/ManageMeasureUnitsForm';
import { ProductForm } from '../components/ProductForm';
import { type ProductFormValues } from '../validation';

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
  const { formatToMinorUnits, formatFromMinorUnits } = useCurrencies();

  const { api, queryClient } = useMoniteContext();

  const [cancelEditModalOpened, setCancelEditModalOpened] =
    useState<boolean>(false);
  const [manageMeasureUnits, setManageMeasureUnits] = useState<boolean>(false);

  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const {
    data: product,
    error: productQueryError,
    isLoading,
  } = api.products.getProductsId.useQuery({ path: { product_id: props.id } });

  const { isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const productUpdateMutation = api.products.patchProductsId.useMutation(
    { path: { product_id: props.id } },
    {
      onSuccess: async (product) => {
        await api.products.getProducts.invalidateQueries(queryClient);
        await api.products.getProductsId.invalidateQueries(
          {
            parameters: { path: { product_id: product.id } },
          },
          queryClient
        );
        toast.success(
          product.type === 'product'
            ? t(i18n)`Product ${product.name} was updated.`
            : t(i18n)`Service ${product.name} was updated.`
        );
      },

      onError: () => {
        toast.error(t(i18n)`Failed to update`);
      },
    }
  );

  const productFormId = `Monite-ProductForm-${useId()}`;

  const defaultValues = useMemo(
    () => ({
      name: product?.name,
      type: product?.type || 'product',
      units: product?.measure_unit_id,
      smallestAmount: product?.smallest_amount,
      pricePerUnit:
        formatFromMinorUnits(
          product?.price?.value as number,
          product?.price?.currency as CurrencyEnum
        ) ?? undefined,
      currency: product?.price?.currency,
      description: product?.description ?? '',
    }),
    [
      product?.name,
      product?.type,
      product?.measure_unit_id,
      product?.smallest_amount,
      product?.price?.value,
      product?.price?.currency,
      product?.description,
      formatFromMinorUnits,
    ]
  );

  const handleSubmit = async (values: ProductFormValues) => {
    if (!values.name || !values.currency || values.pricePerUnit === undefined) {
      toast.error(t(i18n)`Please fill in all required fields`);
      return;
    }

    const payload: ProductServiceRequest = {
      name: values.name,
      type: values.type,
      measure_unit_id: values.units,
      smallest_amount: values.smallestAmount,
      price: {
        value:
          formatToMinorUnits(values.pricePerUnit, values.currency) ??
          values.pricePerUnit,
        currency: values.currency as CurrencyEnum,
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (productQueryError || !product) {
    return (
      <>
        <DialogHeader title={t(i18n)`Edit ${product?.type}`} />
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

  return (
    <>
      <DialogHeader
        secondaryLevel
        title={
          manageMeasureUnits
            ? t(i18n)`Manage measure units`
            : t(i18n)`Edit ${product?.type}`
        }
        previousLevelTitle={
          manageMeasureUnits ? t(i18n)`Edit ${product?.type}` : undefined
        }
        closeSecondaryLevelDialog={() => setManageMeasureUnits(false)}
      />
      <DialogContent>
        <ProductCancelEditModal
          open={cancelEditModalOpened}
          onClose={() => setCancelEditModalOpened(false)}
          onBack={props.onCanceled}
        />
        {manageMeasureUnits ? (
          <ManageMeasureUnitsForm />
        ) : (
          <ProductForm
            formId={productFormId}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            onChanged={setIsFormDirty}
            onManageMeasureUnits={() => setManageMeasureUnits(true)}
          />
        )}
      </DialogContent>
      {manageMeasureUnits ? (
        <DialogFooter
          primaryButton={{
            label: t(i18n)`Done`,
            onClick: () => setManageMeasureUnits(false),
          }}
          cancelButton={{
            onClick: () => setManageMeasureUnits(false),
          }}
        />
      ) : (
        <DialogFooter
          primaryButton={{
            label: t(i18n)`Update`,
            formId: productFormId,
            isLoading: productUpdateMutation.isPending || isMeasureUnitsLoading,
          }}
          cancelButton={{
            onClick: () =>
              isFormDirty ? setCancelEditModalOpened(true) : props.onCanceled(),
          }}
        />
      )}
    </>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
type ProductServiceRequest = components['schemas']['ProductServiceRequest'];
