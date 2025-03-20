import { useCallback, useId, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { components } from '@/api';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { CreateInvoiceReminderDialog } from '@/components/receivables/InvoiceDetails/CreateInvoiceReminderDialog';
import { ReminderSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/RemindersSection';
import { EntitySection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/EntitySection';
import { ItemsSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/ItemsSection';
import { getUpdateInvoiceValidationSchema } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { EditInvoiceReminderDialog } from '@/components/receivables/InvoiceDetails/EditInvoiceReminderDialog';
import { useInvoiceReminderDialogs } from '@/components/receivables/InvoiceDetails/useInvoiceReminderDialogs';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMyEntity } from '@/core/queries';
import {
  useUpdateReceivable,
  useUpdateReceivableLineItems,
} from '@/core/queries/useReceivables';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  useTheme,
} from '@mui/material';

import { format } from 'date-fns';
import * as yup from 'yup';

import { ActiveInvoiceTitleTestId } from '../../CreateReceivable/components/ProductsTable.types';

type Schemas = components['schemas'];

interface EditInvoiceDetailsProps {
  invoice: Schemas['InvoiceResponsePayload'];

  /** Callback that is called when the invoice is updated */
  onUpdated: (updatedReceivable: Schemas['InvoiceResponsePayload']) => void;

  /** Callback that is called when the user cancels the editing */
  onCancel: () => void;
}

type UpdateReceivablesFormProps = yup.InferType<
  ReturnType<typeof getUpdateInvoiceValidationSchema>
>;

const EditInvoiceDetailsContent = ({
  invoice,
  onCancel,
  onUpdated,
}: EditInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();
  const {
    isLoading: isEntityLoading,
    isNonVatSupported,
    isNonCompliantFlow,
  } = useMyEntity();

  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const defaultValues = {
    /** Customer section */
    counterpart_id: invoice.counterpart_id,
    counterpart_vat_id_id: invoice.counterpart_vat_id?.id ?? '',

    default_shipping_address_id: invoice.counterpart_shipping_address?.id ?? '',
    default_billing_address_id: invoice.counterpart_billing_address?.id ?? '',

    /** Entity section */
    entity_vat_id_id: invoice.entity_vat_id?.id ?? '',
    fulfillment_date: invoice.fulfillment_date
      ? new Date(invoice.fulfillment_date)
      : null,
    purchase_order: invoice.purchase_order ?? '',

    /** Items section */
    line_items: invoice.line_items.map((lineItem) => {
      const measureUnitName = lineItem.product.measure_unit?.name;
      let measureUnitId = lineItem.product.measure_unit?.id;

      // If we have a measure unit name but no ID, try to find it in the available measure units
      if (measureUnitName && !measureUnitId && measureUnits?.data) {
        const matchedUnit = measureUnits.data.find(
          (unit) => unit.name === measureUnitName
        );
        if (matchedUnit) {
          measureUnitId = matchedUnit.id;
        }
      }

      return {
        quantity: lineItem.quantity,
        product_id: lineItem.product.id,
        vat_rate_id: lineItem.product.vat_rate.id ?? undefined,
        vat_rate_value: lineItem.product.vat_rate.value,
        product: {
          name: lineItem.product.name,
          price: lineItem.product.price,
          // Get measure_unit_id directly from the API response if available, or use the matched ID
          measure_unit_id: measureUnitId ?? undefined,
          type: lineItem.product.type || 'product',
        },
        tax_rate_value: isNonVatSupported
          ? lineItem.product.vat_rate.value / 100
          : undefined,
      };
    }),
    vat_exemption_rationale: invoice.vat_exemption_rationale ?? '',
    memo: invoice.memo ?? '',

    /** Items section */
    entity_bank_account_id: invoice.entity_bank_account?.id ?? '',
    payment_terms_id: invoice.payment_terms?.id ?? '',

    payment_reminder_id: invoice.payment_reminder_id ?? '',
    overdue_reminder_id: invoice.overdue_reminder_id ?? '',
  };

  const methods = useForm<UpdateReceivablesFormProps>({
    resolver: yupResolver(
      getUpdateInvoiceValidationSchema(
        i18n,
        isNonVatSupported,
        isNonCompliantFlow
      )
    ),
    defaultValues,
  });

  const actualCurrency = invoice.currency;

  const {
    handleSubmit,
    formState: { isDirty },
    getValues,
    setValue,
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
    updateReceivableLineItems.isPending ||
    updateReceivable.isPending ||
    isEntityLoading ||
    isMeasureUnitsLoading;

  const formName = `Monite-Form-receivablesDetailsForm-${useId()}`;

  const {
    createReminderDialog,
    editReminderDialog,
    onCreateReminder,
    onEditOverdueReminder,
    onEditPaymentReminder,
    closeCreateReminderDialog,
    closeUpdateReminderDialog,
  } = useInvoiceReminderDialogs({ getValues });

  const className = 'Monite-EditInvoiceDetails';

  const theme = useTheme();

  return (
    <>
      <DialogTitle className={className + '-Title'}>
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
      <Divider className={className + '-Divider'} />
      <DialogContent className={className + '-Content'}>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit((values) => {
              const lineItems: Schemas['UpdateLineItems'] = {
                data: values.line_items.map((lineItem) => {
                  // Check if we have a valid measure unit ID before processing
                  let measureUnitName = '';
                  if (lineItem.product.measure_unit_id) {
                    const unit = measureUnits?.data?.find(
                      (u) => u.id === lineItem.product.measure_unit_id
                    );
                    measureUnitName = unit?.name || '';
                  }

                  // Ensure we have either VAT or tax rate, but not both
                  const processedLineItem = {
                    quantity: lineItem.quantity,
                    product: {
                      name: lineItem.product.name,
                      type: lineItem.product
                        .type as Schemas['ProductServiceTypeEnum'],
                      // Keep the measure_unit_id as is since it's a valid UUID
                      measure_unit: lineItem.product.measure_unit_id
                        ? {
                            name: measureUnitName,
                          }
                        : undefined,
                      // Ensure price is in minor units
                      price: lineItem.product.price
                        ? {
                            currency: lineItem.product.price.currency ?? 'USD',
                            value: Math.round(
                              lineItem.product.price.value ?? 0
                            ), // Ensure we have whole numbers for minor units
                          }
                        : (undefined as unknown as Schemas['LineItemProductCreate']['price']),
                    },
                    // For non-VAT supported regions, use tax_rate_value and set vat_rate to null
                    ...(isNonVatSupported
                      ? {
                          tax_rate_value: Math.round(
                            (lineItem.tax_rate_value ?? 0) * 100
                          ), // Convert percentage to minor units
                        }
                      : {
                          vat_rate_id: lineItem.vat_rate_id,
                        }),
                  };

                  return processedLineItem;
                }),
              };

              const invoicePayload: Schemas['ReceivableUpdatePayload'] = {
                invoice: {
                  /** Customer section */
                  counterpart_id: values.counterpart_id,
                  counterpart_vat_id_id:
                    values.counterpart_vat_id_id || undefined,
                  currency: actualCurrency,
                  memo: values.memo,
                  vat_exemption_rationale: values.vat_exemption_rationale,
                  // @ts-expect-error - we need to send `null`, but the backend doesn't provide a correct type
                  counterpart_shipping_address_id:
                    values?.default_shipping_address_id || null,
                  counterpart_billing_address_id:
                    values?.default_billing_address_id,
                  /** We shouldn't send an empty string to the server if the value is not set */
                  entity_bank_account_id:
                    values.entity_bank_account_id || undefined,
                  payment_terms_id: values.payment_terms_id,
                  entity_vat_id_id: values.entity_vat_id_id || undefined,
                  // @ts-expect-error - we need to send `null`, but the backend doesn't provide a correct type
                  fulfillment_date: values.fulfillment_date
                    ? /**
                       * We have to change the date as Backend accepts it.
                       * There is no `time` in request, only year, month and date
                       */
                      format(values.fulfillment_date, 'yyyy-MM-dd')
                    : null,
                  // @ts-expect-error - we need to send `null`, but the backend doesn't provide a correct type
                  payment_reminder_id: values.payment_reminder_id || null,
                  // @ts-expect-error - we need to send `null`, but the backend doesn't provide a correct type
                  overdue_reminder_id: values.overdue_reminder_id || null,
                  /** !!! Note !!! Backend is not supported to edit `purchase_order` so we have to remove it */
                  // purchase_order: values.purchase_order || undefined,
                },
              };

              updateReceivableLineItems.mutate(lineItems, {
                onSuccess: () => {
                  updateReceivable.mutate(invoicePayload, {
                    onSuccess: (receivable) => {
                      onUpdated(
                        receivable as Schemas['InvoiceResponsePayload']
                      );
                    },
                    onError: (error) => {
                      console.error(
                        '[EditInvoiceDetails] Invoice update failed:',
                        error
                      );
                    },
                  });
                },
                onError: (error) => {
                  console.error(
                    '[EditInvoiceDetails] Line items update failed:',
                    error
                  );
                },
              });
            })}
            style={{ marginBottom: theme.spacing(7) }}
          >
            <Stack direction="column" spacing={4}>
              <Typography
                variant="h1"
                sx={{ mb: 2 }}
                data-testid={ActiveInvoiceTitleTestId.ActiveInvoiceTitleTestId}
              >
                {t(i18n)`Invoice`}{' '}
                <Typography component="span" variant="h1" color="textSecondary">
                  #{invoice.document_id ?? INVOICE_DOCUMENT_AUTO_ID}
                </Typography>
              </Typography>
              <ItemsSection
                isNonVatSupported={isNonVatSupported}
                actualCurrency={actualCurrency}
              />
              <EntitySection disabled={isLoading} hidden={['purchase_order']} />
              <ReminderSection
                disabled={isLoading}
                onUpdateOverdueReminder={onEditOverdueReminder}
                onUpdatePaymentReminder={onEditPaymentReminder}
                onCreateReminder={onCreateReminder}
              />
            </Stack>
            <Dialog
              className={className + '-Dialog-CancelWithoutSaving'}
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

      <CreateInvoiceReminderDialog
        open={createReminderDialog.open}
        reminderType={createReminderDialog.reminderType}
        onClose={closeCreateReminderDialog}
        onCreate={({ reminderId, reminderType }) => {
          if (reminderType === 'payment') {
            setValue('payment_reminder_id', reminderId);
          } else if (reminderType === 'overdue') {
            setValue('overdue_reminder_id', reminderId);
          }
        }}
      />

      {editReminderDialog.reminderId && (
        <EditInvoiceReminderDialog
          open={editReminderDialog.open}
          reminderId={editReminderDialog.reminderId}
          reminderType={editReminderDialog.reminderType}
          onClose={closeUpdateReminderDialog}
        />
      )}
    </>
  );
};

export const EditInvoiceDetails = (props: EditInvoiceDetailsProps) => {
  return <EditInvoiceDetailsContent {...props} />;
};
