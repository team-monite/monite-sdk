import React, { useCallback, useId, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CustomerSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/CustomerSection';
import { EntitySection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/EntitySection';
import { ItemsSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/ItemsSection';
import { PaymentSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/PaymentSection';
import {
  getUpdateInvoiceValidationSchema,
  CreateReceivablesFormProps,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useUpdateReceivable,
  useUpdateReceivableLineItems,
} from '@/core/queries';
import { LoadingPage } from '@/ui/loadingPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CounterpartAddressResponseWithCounterpartID,
  InvoiceResponsePayload,
  ReceivableResponse,
  ReceivableUpdatePayload,
  UpdateLineItems,
} from '@monite/sdk-api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { format } from 'date-fns';

interface EditInvoiceDetailsProps {
  invoice: InvoiceResponsePayload;

  /** Callback that is called when the invoice is updated */
  onUpdated: (updatedReceivable: ReceivableResponse) => void;

  /** Callback that is called when the user cancels the editing */
  onCancel: () => void;
}

interface EditInvoiceDetailsContentProps extends EditInvoiceDetailsProps {
  counterpartAddresses:
    | Array<CounterpartAddressResponseWithCounterpartID>
    | undefined;
}

const EditInvoiceDetailsContent = ({
  invoice,
  onCancel,
  onUpdated,
  counterpartAddresses,
}: EditInvoiceDetailsContentProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  const counterpartShippingAddress = counterpartAddresses?.find((address) => {
    return (
      address.city === invoice.counterpart_shipping_address?.city &&
      address.country === invoice.counterpart_shipping_address.country &&
      address.line1 === invoice.counterpart_shipping_address.line1
    );
  });

  const methods = useForm<CreateReceivablesFormProps>({
    resolver: yupResolver(getUpdateInvoiceValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        /** Customer section */
        counterpart_id: invoice.counterpart_id,
        counterpart_contact: invoice.counterpart_contact,
        counterpart_vat_id_id: invoice.counterpart_vat_id?.id ?? '',
        default_shipping_address_id: counterpartShippingAddress?.id ?? '',
        default_billing_address_id: '',

        /** Entity section */
        entity_vat_id_id: invoice.entity_vat_id?.id ?? '',
        fulfillment_date: invoice.fulfillment_date
          ? new Date(invoice.fulfillment_date)
          : null,
        purchase_order: invoice.purchase_order ?? '',

        /** Items section */
        line_items: invoice.line_items.map((lineItem) => ({
          quantity: lineItem.quantity,
          product_id: lineItem.product.id,
          vat_rate_id: lineItem.product.vat_rate.id,
          vat_rate_value: lineItem.product.vat_rate.value,
          name: lineItem.product.name,
          price: lineItem.product.price,
          measure_unit_id: lineItem.product.measure_unit_id,
        })),
        vat_exemption_rationale: invoice.vat_exemption_rationale ?? '',

        /** Items section */
        entity_bank_account_id: invoice.entity_bank_account?.id ?? '',
        payment_terms_id: invoice.payment_terms?.id ?? '',
      }),
      [
        counterpartShippingAddress?.id,
        invoice.counterpart_contact,
        invoice.counterpart_id,
        invoice.counterpart_vat_id?.id,
        invoice.entity_bank_account?.id,
        invoice.entity_vat_id?.id,
        invoice.fulfillment_date,
        invoice.line_items,
        invoice.payment_terms?.id,
        invoice.purchase_order,
        invoice.vat_exemption_rationale,
      ]
    ),
  });

  const [actualCurrency, setActualCurrency] = useState(invoice.currency);

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleCancelWithAlert = useCallback(() => {
    /** If the form hasn't been changed, we could just cancel it */
    if (!isDirty) {
      onCancel();

      return;
    }

    /** Otherwise open cancel alert modal */
    setIsAlertOpen(true);
  }, [isDirty, onCancel]);

  const updateReceivableLineItems = useUpdateReceivableLineItems(invoice.id);
  const updateReceivable = useUpdateReceivable(invoice.id);

  const isLoading =
    updateReceivableLineItems.isPending || updateReceivable.isPending;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-receivablesDetailsForm-${useId()}`;

  return (
    <>
      <DialogTitle>
        <Toolbar>
          <Button
            variant="text"
            color={isDirty ? 'error' : 'primary'}
            onClick={handleCancelWithAlert}
            startIcon={<ArrowBackIcon />}
            disabled={isLoading}
          >{t(i18n)`Cancel`}</Button>
          <Box sx={{ marginLeft: 'auto' }}>
            <Button
              variant="contained"
              key="next"
              color="primary"
              type="submit"
              form={formName}
              disabled={isLoading}
            >{t(i18n)`Update`}</Button>
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
              const lineItems: UpdateLineItems = {
                data: values.line_items.map((lineItem) => ({
                  quantity: lineItem.quantity,
                  product_id: lineItem.product_id,
                  vat_rate_id: lineItem.vat_rate_id,
                })),
              };

              const invoicePayload: ReceivableUpdatePayload = {
                invoice: {
                  /** Customer section */
                  counterpart_id: values.counterpart_id,
                  counterpart_vat_id_id:
                    values.counterpart_vat_id_id || undefined,
                  currency: actualCurrency,
                  vat_exemption_rationale: values.vat_exemption_rationale,
                  /**
                   * Note: We shouldn't send `counterpart_billing_address`
                   *  because it's auto-selected from UI.
                   * There is no way to change it (at least right now)
                   */
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
                  entity_vat_id_id: values.entity_vat_id_id || undefined,
                  fulfillment_date: values.fulfillment_date
                    ? /**
                       * We have to change the date as Backend accepts it.
                       * There is no `time` in request, only year, month and date
                       */
                      format(values.fulfillment_date, 'yyyy-MM-dd')
                    : undefined,
                  /** !!! Note !!! Backend is not supported to edit `purchase_order` so we have to remove it */
                  // purchase_order: values.purchase_order || undefined,
                },
              };

              updateReceivableLineItems.mutate(lineItems, {
                onSuccess: () => {
                  updateReceivable.mutate(invoicePayload, {
                    onSuccess: (updatedReceivable) => {
                      onUpdated(updatedReceivable);
                    },
                  });
                },
              });
            })}
          >
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {t(i18n)`Edit invoice ${invoice.id}`}
              </Typography>
              <Stack direction="column" spacing={4}>
                <CustomerSection disabled={isLoading} />
                <EntitySection
                  disabled={isLoading}
                  hidden={['purchase_order']}
                />
                <ItemsSection
                  actualCurrency={actualCurrency}
                  onCurrencyChanged={setActualCurrency}
                />
                <PaymentSection disabled={isLoading} />
              </Stack>
            </Stack>
            <Dialog
              open={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              container={root}
              maxWidth="sm"
            >
              <DialogTitle>{t(i18n)`Cancel without saving?`}</DialogTitle>
              <DialogContent>
                <DialogContentText>{t(
                  i18n
                )`There are unsaved changes. If you leave, they will be lost.`}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => setIsAlertOpen(false)}
                >{t(i18n)`No`}</Button>
                <Button variant="contained" color="error" onClick={onCancel}>{t(
                  i18n
                )`Yes`}</Button>
              </DialogActions>
            </Dialog>
          </form>
        </FormProvider>
      </DialogContent>
    </>
  );
};

export const EditInvoiceDetails = (props: EditInvoiceDetailsProps) => {
  const { data: counterpartAddresses, isLoading } = useCounterpartAddresses(
    props.invoice.counterpart_id
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <EditInvoiceDetailsContent
      {...props}
      counterpartAddresses={counterpartAddresses}
    />
  );
};
