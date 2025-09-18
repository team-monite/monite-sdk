import { ActiveInvoiceTitleTestId } from '../../CreateReceivable/components/ProductsTable.types';
import { useLineItemSubmitCleanup } from '../../CreateReceivable/hooks/useLineItemSubmitCleanup';
import { EntitySection } from '../../CreateReceivable/sections/EntitySection';
import { ItemsSection } from '../../CreateReceivable/sections/ItemsSection';
import {
  getUpdateInvoiceValidationSchema,
  UpdateReceivablesFormProps,
} from '../../CreateReceivable/validation';
import { components } from '@/api';
import {
  RemindersSection,
  CreateInvoiceReminderDialog,
  EditInvoiceReminderDialog,
} from '@/components/receivables/components';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { useInvoiceReminderDialogs } from '@/components/receivables/hooks/useInvoiceReminderDialogs';
import { useMeasureUnitsMapping } from '@/components/receivables/hooks/useMeasureUnitsMapping';
import { useUpdateReceivable } from '@/components/receivables/hooks/useUpdateReceivable';
import { useUpdateReceivableLineItems } from '@/components/receivables/hooks/useUpdateReceivableLineItems';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import { rateMajorToMinor } from '@/core/utils/vatUtils';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { Dialog } from '@/ui/Dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useId, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type Schemas = components['schemas'];

interface EditInvoiceDetailsProps {
  invoice: Schemas['InvoiceResponsePayload'];

  /** Callback that is called when the invoice is updated */
  onUpdated: (updatedReceivable: Schemas['InvoiceResponsePayload']) => void;

  /** Callback that is called when the user cancels the editing */
  onCancel: () => void;

  /** Whether the dialog is open */
  isOpen: boolean;
}

interface ExtendedLineItem {
  quantity: number;
  product: {
    name: string;
    price?: {
      currency: components['schemas']['CurrencyEnum'];
      value: number;
    };
    measure_unit_id: string;
    measure_unit_name?: string;
    type: string;
  };
  measure_unit?: {
    name: string;
    id: null;
  };
}

const EditInvoiceDetailsContent = ({
  invoice,
  onCancel,
  onUpdated,
  isOpen,
}: EditInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { isLoading: isEntityLoading, isNonVatSupported } = useMyEntity();

  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const defaultValues = useMemo(
    () => ({
      /** Customer section */
      counterpart_id: invoice.counterpart_id,
      counterpart_vat_id_id: invoice.counterpart_vat_id?.id ?? '',

      default_shipping_address_id:
        invoice.counterpart_shipping_address?.id ?? '',
      default_billing_address_id: invoice.counterpart_billing_address?.id ?? '',

      /** Entity section */
      entity_vat_id_id: invoice.entity_vat_id?.id ?? '',
      fulfillment_date: invoice.fulfillment_date
        ? new Date(invoice.fulfillment_date)
        : null,
      purchase_order: invoice.purchase_order ?? '',
      footer: invoice.footer ?? '',

      /** Items section */
      line_items: invoice.line_items.map((lineItem) => {
        const measureUnitName = lineItem.product.measure_unit?.name;
        const measureUnitId = lineItem.product.measure_unit?.id;

        return {
          quantity: lineItem.quantity,
          product_id: lineItem.product.id,
          vat_rate_id: lineItem.product.vat_rate.id ?? undefined,
          vat_rate_value: lineItem.product.vat_rate.value,
          product: {
            name: lineItem.product.name,
            price:
              invoice.vat_mode === 'inclusive'
                ? lineItem.product.price_after_vat
                : lineItem.product.price,
            // Get measure_unit_id directly from the API response if available
            measure_unit_id:
              measureUnitId && measureUnitId !== '' ? measureUnitId : undefined,
            // Store the measure unit name separately for custom units
            measure_unit_name:
              !measureUnitId && measureUnitName ? measureUnitName : undefined,
            type: lineItem.product.type || 'product',
          },
          // For custom measure units that don't have an ID but have a name
          measure_unit:
            !measureUnitId && measureUnitName
              ? { name: measureUnitName, id: null }
              : undefined,
          tax_rate_value: isNonVatSupported
            ? lineItem.product.vat_rate.value !== undefined
              ? rateMinorToMajor(lineItem.product.vat_rate.value)
              : undefined
            : undefined,
        };
      }),
      vat_exemption_rationale: invoice.vat_exemption_rationale ?? '',
      memo: invoice.memo ?? '',

      /** Payment section */
      entity_bank_account_id: invoice.entity_bank_account?.id ?? '',
      payment_terms_id: invoice.payment_terms?.id ?? '',

      /** Reminders section */
      payment_reminder_id: invoice.payment_reminder_id ?? '',
      overdue_reminder_id: invoice.overdue_reminder_id ?? '',
      vat_mode: invoice.vat_mode ?? 'exclusive',
    }),
    [invoice, isNonVatSupported]
  );

  const methods = useForm<UpdateReceivablesFormProps>({
    resolver: zodResolver(
      getUpdateInvoiceValidationSchema(i18n, isNonVatSupported)
    ),
    defaultValues,
  });

  const actualCurrency = invoice.currency;

  const {
    handleSubmit,
    formState: { isDirty },
    getValues,
    setValue,
    reset,
  } = methods;

  const { registerLineItemCleanupFn, runLineItemCleanup } =
    useLineItemSubmitCleanup();

  useMeasureUnitsMapping(measureUnits, getValues, reset);

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
    <Dialog fullScreen open={isOpen} onClose={onCancel}>
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
            onSubmit={async (e) => {
              e.preventDefault();
              runLineItemCleanup();
              await handleSubmit((values) => {
                const lineItems: Schemas['UpdateLineItems'] = {
                  data: values.line_items.map((lineItem) => {
                    const extendedLineItem =
                      lineItem as unknown as ExtendedLineItem;

                    let measureUnitName: string | undefined;

                    // Case 1: We have a valid measure_unit_id - look up its name
                    if (extendedLineItem.product.measure_unit_id) {
                      const measureUnitId =
                        extendedLineItem.product.measure_unit_id;
                      const unit = measureUnits?.data?.find(
                        (u) => u.id === measureUnitId
                      );
                      measureUnitName = unit?.name;
                    }
                    // Case 2: We have a custom measure unit name but no ID
                    else if (
                      extendedLineItem.product.measure_unit_name ||
                      extendedLineItem.measure_unit?.name
                    ) {
                      measureUnitName =
                        extendedLineItem.product.measure_unit_name ||
                        extendedLineItem.measure_unit?.name;
                    }

                    const processedLineItem = {
                      quantity: lineItem.quantity,
                      product: {
                        name: lineItem.product.name,
                        type: lineItem.product
                          .type as Schemas['ProductServiceTypeEnum'],
                        measure_unit: measureUnitName
                          ? { name: measureUnitName }
                          : undefined,
                        price: lineItem.product.price
                          ? {
                              currency: (lineItem.product.price.currency ??
                                'USD') as components['schemas']['CurrencyEnum'],
                              value: Math.round(
                                lineItem.product.price.value ?? 0
                              ),
                            }
                          : (undefined as unknown as Schemas['LineItemProductCreate']['price']),
                      },
                      // For non-VAT supported regions, use tax_rate_value
                      ...(isNonVatSupported
                        ? {
                            tax_rate_value:
                              lineItem.tax_rate_value !== undefined
                                ? rateMajorToMinor(lineItem.tax_rate_value)
                                : undefined,
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
                    });
                  },
                });
              })(e);
            }}
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
                isVatSelectionDisabled
                registerLineItemCleanupFn={registerLineItemCleanupFn}
              />
              {/** Show 'Note to customer'|'Purchase order' fields only if invoice.footer|purchase_order
               * is defined and non-empty */}
              <EntitySection
                disabled={isLoading}
                hidden={['purchase_order']}
                visibleFields={{
                  isFooterShown:
                    typeof invoice.footer === 'string' &&
                    invoice.footer?.trim() !== '',
                  isPurchaseOrderShown:
                    typeof invoice.purchase_order === 'string' &&
                    invoice.purchase_order?.trim() !== '',
                }}
              />
              <RemindersSection
                disabled={isLoading}
                onUpdateOverdueReminder={onEditOverdueReminder}
                onUpdatePaymentReminder={onEditPaymentReminder}
                onCreateReminder={onCreateReminder}
              />
            </Stack>
            <ConfirmationModal
              open={isAlertOpen}
              title={t(i18n)`Cancel without saving?`}
              message={t(
                i18n
              )`There are unsaved changes. If you leave, they will be lost.`}
              confirmLabel={t(i18n)`Yes`}
              cancelLabel={t(i18n)`No`}
              onClose={() => setIsAlertOpen(false)}
              onConfirm={onCancel}
            />
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
    </Dialog>
  );
};

export const EditInvoiceDetails = (props: EditInvoiceDetailsProps) => {
  return <EditInvoiceDetailsContent {...props} />;
};
