import { useLineItemSubmitCleanup } from '../../CreateReceivable/hooks/useLineItemSubmitCleanup';
import { EntitySection } from '../../CreateReceivable/sections/EntitySection';
import { ItemsSection } from '../../CreateReceivable/sections/ItemsSection';
import {
  CreateReceivablesFormBeforeValidationLineItemProps,
  getUpdateInvoiceValidationSchema,
  UpdateReceivablesFormProps,
} from '../../CreateReceivable/validation';
import { components } from '@/api';
import { CreateInvoiceReminderDialog } from '@/components/receivables/components/CreateInvoiceReminderDialog';
import { EditInvoiceReminderDialog } from '@/components/receivables/components/EditInvoiceReminderDialog';
import { RemindersSection } from '@/components/receivables/components/RemindersSection';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { useInvoiceReminderDialogs } from '@/components/receivables/hooks/useInvoiceReminderDialogs';
import { useMeasureUnitsMapping } from '@/components/receivables/hooks/useMeasureUnitsMapping';
import { useUpdateReceivable } from '@/components/receivables/hooks/useUpdateReceivable';
import { useUpdateReceivableLineItems } from '@/components/receivables/hooks/useUpdateReceivableLineItems';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartAddresses, useCounterpartById, useCounterpartVatList, useMyEntity } from '@/core/queries';
import { rateMajorToMinor } from '@/core/utils/vatUtils';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogHeader, 
  DialogClose
} from '@/ui/components/dialog';
import { Button } from '@/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react';
import { format } from 'date-fns';
import { useCallback, useId, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { InvoicePreview } from '../../CreateReceivable/sections/components/InvoicePreview';
import { useGetPaymentTerms } from '@/components/receivables/hooks/useGetPaymentTerms';
import { useGetEntityVatIds } from '@/components/receivables/hooks/useGetEntityVatIds';

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

export const EditInvoiceDetails = (props: EditInvoiceDetailsProps) => {
  return <EditInvoiceDetailsContent {...props} />;
};

const EditInvoiceDetailsContent = ({
  invoice,
  onCancel,
  onUpdated,
  isOpen,
}: EditInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();
  const { data: entityData, isLoading: isEntityLoading, isNonVatSupported } = useMyEntity();
  const { data: paymentTerms } = useGetPaymentTerms();
  const { data: entityVatIds } = useGetEntityVatIds(entityId);

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
    watch,
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

  const lineItems = watch('line_items');
  const paymentTermsId = watch('payment_terms_id');
  const fulfillmentDate = watch('fulfillment_date');
  const memo = watch('memo');
  const footer = watch('footer');
  const entityBankAccountId = watch('entity_bank_account_id');
  const vatMode = watch('vat_mode');
  const counterpartId = watch('counterpart_id');
  const billingAddressId = watch('default_billing_address_id');

  const { data: counterpart } = useCounterpartById(counterpartId);
  const { data: counterpartAddresses } = useCounterpartAddresses(counterpartId);
  const { data: counterpartVats } = useCounterpartVatList(counterpartId);
  const counterpartBillingAddress = useMemo(
    () =>
      counterpartAddresses?.data?.find(
        (address) => address.id === billingAddressId
      ),
    [billingAddressId, counterpartAddresses?.data]
  );

  return (
    <>
      <Dialog open={isOpen} modal={false}>
        <DialogContent fullScreen showCloseButton={false} className="mtw:flex">
          <div className="mtw:flex-1/2 mtw:overflow-y-auto mtw:pr-14">
            <DialogHeader className="mtw:flex-row mtw:justify-between mtw:bg-white mtw:pb-4 mtw:sticky mtw:top-0 mtw:z-9999">
              <DialogTitle className="mtw:sr-only">
                {i18n._(`Edit invoice`)}
              </DialogTitle>
              <DialogDescription className="mtw:sr-only">
                {i18n._(`Edit invoice`)}
              </DialogDescription>

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  onClick={handleCancelWithAlert}
                  disabled={isLoading}
                  aria-label={i18n._(`Close`)}
                >
                  <X />
                </Button>
              </DialogClose>

              <Button
                type="submit"
                form={formName}
                disabled={isLoading}
              >
                {i18n._(`Update`)}
              </Button>
            </DialogHeader>

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
                className="mtw:mb-14"
              >
                <div className="mtw:flex mtw:flex-col mtw:gap-8">
                  <h1 className="mtw:text-2xl mtw:font-bold">
                    {i18n._(`Invoice`)}{' '}
                    <span className="mtw:text-gray-500">
                      #{invoice.document_id ?? INVOICE_DOCUMENT_AUTO_ID}
                    </span>
                  </h1>
                  <ItemsSection
                    isNonVatSupported={isNonVatSupported}
                    actualCurrency={actualCurrency}
                    isVatSelectionDisabled
                    shouldOverrideVatRateDefaults
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
                </div>
              </form>
            </FormProvider>
          </div>

          <div className="mtw:flex-1/2 mtw:w-1/2">
            <InvoicePreview
              invoiceData={{
                payment_terms_id: paymentTermsId,
                line_items: (lineItems || []).map((item) => ({
                  ...item,
                  id: item.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                })) as CreateReceivablesFormBeforeValidationLineItemProps[],
                fulfillment_date: fulfillmentDate,
                memo,
                footer,
                entity_bank_account_id: entityBankAccountId,
                vat_mode: vatMode,
              }}
              counterpart={counterpart}
              currency={actualCurrency}
              isNonVatSupported={isNonVatSupported}
              entityData={entityData}
              address={counterpartBillingAddress}
              paymentTerms={paymentTerms}
              entityVatIds={entityVatIds}
              counterpartVats={counterpartVats}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isAlertOpen}
        title={i18n._(`Cancel without saving?`)}
        message={i18n._(`There are unsaved changes. If you leave, they will be lost.`)}
        confirmLabel={i18n._(`Yes`)}
        cancelLabel={i18n._(`No`)}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onCancel}
      />

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
