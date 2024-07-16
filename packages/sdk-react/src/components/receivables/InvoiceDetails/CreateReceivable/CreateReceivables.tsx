import React, { useId, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { useDialog } from '@/components';
import { InvoiceDetailsCreateProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCounterpartAddresses } from '@/core/queries';
import { useEntitySettings } from '@/core/queries/useEntities';
import { useCreateReceivable } from '@/core/queries/useReceivables';
import { LoadingPage } from '@/ui/loadingPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { format } from 'date-fns';

import { CustomerSection } from './sections/CustomerSection';
import { EntitySection } from './sections/EntitySection';
import { ItemsSection } from './sections/ItemsSection';
import { PaymentSection } from './sections/PaymentSection';
import {
  getCreateInvoiceValidationSchema,
  CreateReceivablesFormProps,
} from './validation';

/**
 * A component for creating new Receivable
 * Supported only `invoice` type
 */
export const CreateReceivables = (props: InvoiceDetailsCreateProps) => (
  <MoniteScopedProviders>
    <CreateReceivablesBase {...props} />
  </MoniteScopedProviders>
);

const CreateReceivablesBase = (props: InvoiceDetailsCreateProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const methods = useForm<CreateReceivablesFormProps>({
    resolver: yupResolver(getCreateInvoiceValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        counterpart_id: '',
        counterpart_contact: '',
        counterpart_vat_id_id: '',
        payment_terms_id: '',
        default_shipping_address_id: '',
        default_billing_address_id: '',
        fulfillment_date: null,
        purchase_order: '',
        entity_vat_id_id: '',
        line_items: [],
        entity_bank_account_id: '',
        type: props.type,
      }),
      [props.type]
    ),
  });

  const { handleSubmit, watch } = methods;

  const counterpartId = watch('counterpart_id');

  const { data: counterpartAddresses } = useCounterpartAddresses(counterpartId);

  const createReceivable = useCreateReceivable();
  const { data: settings, isLoading: isSettingsLoading } = useEntitySettings();

  const [actualCurrency, setActualCurrency] = useState<
    components['schemas']['CurrencyEnum'] | undefined
  >(settings?.currency?.default);

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-receivablesDetailsForm-${useId()}`;

  if (isSettingsLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <DialogTitle>
        <Toolbar>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext?.onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
          <Box sx={{ marginLeft: 'auto' }}>
            <Button
              variant="contained"
              key="next"
              color="primary"
              type="submit"
              form={formName}
              disabled={createReceivable.isPending}
            >{t(i18n)`Create`}</Button>
          </Box>
        </Toolbar>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit((values) => {
              if (values.type !== 'invoice') {
                throw new Error('`type` except `invoice` is not supported yet');
              }

              if (!actualCurrency) {
                throw new Error('`actualCurrency` is not defined');
              }

              const billingAddressId = values.default_billing_address_id;
              const counterpartBillingAddress =
                counterpartAddresses?.data?.find(
                  (address) => address.id === billingAddressId
                );

              if (!counterpartBillingAddress) {
                throw new Error('`Billing address` is not provided');
              }

              const shippingAddressId = values.default_shipping_address_id;

              const counterpartShippingAddress =
                counterpartAddresses?.data?.find(
                  (address) => address.id === shippingAddressId
                );

              const invoicePayload: components['schemas']['ReceivableFacadeCreateInvoicePayload'] =
                {
                  type: values.type,
                  counterpart_id: values.counterpart_id,
                  counterpart_vat_id_id:
                    values.counterpart_vat_id_id || undefined,
                  counterpart_billing_address: {
                    country: counterpartBillingAddress.country,
                    city: counterpartBillingAddress.city,
                    postal_code: counterpartBillingAddress.postal_code,
                    state: counterpartBillingAddress.state,
                    line1: counterpartBillingAddress.line1,
                    line2: counterpartBillingAddress.line2,
                  },
                  counterpart_shipping_address: counterpartShippingAddress
                    ? {
                        country: counterpartShippingAddress.country,
                        city: counterpartShippingAddress.city,
                        postal_code: counterpartShippingAddress.postal_code,
                        state: counterpartShippingAddress.state,
                        line1: counterpartShippingAddress.line1,
                        line2: counterpartShippingAddress.line2,
                      }
                    : undefined,

                  /** We shouldn't send an empty string to the server if the value is not set */
                  entity_bank_account_id:
                    values.entity_bank_account_id || undefined,
                  payment_terms_id: values.payment_terms_id,
                  line_items: values.line_items.map((item) => ({
                    quantity: item.quantity,
                    product_id: item.product_id,
                    vat_rate_id: item.vat_rate_id,
                  })),
                  vat_exemption_rationale: values.vat_exemption_rationale,
                  entity_vat_id_id: values.entity_vat_id_id || undefined,
                  fulfillment_date: values.fulfillment_date
                    ? /**
                       * We have to change the date as Backend accepts it.
                       * There is no `time` in request, only year, month and date
                       */
                      format(values.fulfillment_date, 'yyyy-MM-dd')
                    : undefined,
                  purchase_order: values.purchase_order || undefined,
                  currency: actualCurrency,
                };

              createReceivable.mutate(invoicePayload, {
                onSuccess: (createdReceivable) => {
                  props.onCreate?.(createdReceivable.id);
                },
              });
            })}
          >
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {t(i18n)`Create Invoice`}
              </Typography>
              <Stack direction="column" spacing={4}>
                <CustomerSection disabled={createReceivable.isPending} />
                <EntitySection disabled={createReceivable.isPending} />
                <ItemsSection
                  defaultCurrency={settings?.currency?.default}
                  actualCurrency={actualCurrency}
                  onCurrencyChanged={setActualCurrency}
                />
                <PaymentSection disabled={createReceivable.isPending} />
              </Stack>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
    </>
  );
};
