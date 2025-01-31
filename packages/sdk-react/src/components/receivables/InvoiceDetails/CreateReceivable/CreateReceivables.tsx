import { useEffect, useId, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { useDialog } from '@/components';
import { showErrorToast } from '@/components/onboarding/utils';
import { CreateInvoiceReminderDialog } from '@/components/receivables/InvoiceDetails/CreateInvoiceReminderDialog';
import { ReminderSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/RemindersSection';
import { EditInvoiceReminderDialog } from '@/components/receivables/InvoiceDetails/EditInvoiceReminderDialog';
import { InvoiceDetailsCreateProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { useInvoiceReminderDialogs } from '@/components/receivables/InvoiceDetails/useInvoiceReminderDialogs';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  useCounterpartAddresses,
  useCounterpartVatList,
  useMyEntity,
} from '@/core/queries';
import { useCreateReceivable } from '@/core/queries/useReceivables';
import { IconWrapper } from '@/ui/iconWrapper';
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
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import { format } from 'date-fns';

import { FullfillmentSummary } from './sections/components/Billing/FullfillmentSummary';
import { YourVatDetailsForm } from './sections/components/Billing/YourVatDetailsForm';
import { BillToSection } from './sections/components/BillToSection';
import { InvoicePreview } from './sections/components/InvoicePreview';
import { EntitySection } from './sections/EntitySection';
import { ItemsSection } from './sections/ItemsSection';
import {
  getCreateInvoiceValidationSchema,
  CreateReceivablesFormProps,
} from './validation';

/**
 * A component for creating a new Receivable
 * Supported only `invoice` type
 */
export const CreateReceivables = (props: InvoiceDetailsCreateProps) => (
  <MoniteScopedProviders>
    <CreateReceivablesBase {...props} />
  </MoniteScopedProviders>
);

const CreateReceivablesBase = ({
  type,
  onCreate,
}: InvoiceDetailsCreateProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, entityId } = useMoniteContext();
  const {
    data: paymentTerms,
    isLoading: isPaymentTermsLoading,
    refetch: refetchPaymentTerms,
  } = api.paymentTerms.getPaymentTerms.useQuery();
  const { data: entityVatIds, isLoading: isEntityVatIdsLoading } =
    api.entities.getEntitiesIdVatIds.useQuery({
      path: { entity_id: entityId },
    });
  const {
    isNonVatSupported,
    isLoading: isEntityLoading,
    isNonCompliantFlow,
    data: entityData,
  } = useMyEntity();
  const fallbackCurrency = 'USD';
  const methods = useForm<CreateReceivablesFormProps>({
    resolver: yupResolver(
      getCreateInvoiceValidationSchema(
        i18n,
        isNonVatSupported,
        isNonCompliantFlow
      )
    ),
    defaultValues: useMemo(
      () => ({
        type,
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
        overdue_reminder_id: '',
        payment_reminder_id: '',
        memo: '',
      }),
      [type]
    ),
  });

  const { handleSubmit, watch, getValues, setValue } = methods;

  const counterpartId = watch('counterpart_id');

  const { data: counterpartAddresses } = useCounterpartAddresses(counterpartId);
  const { data: counterpartVats, isLoading: isCounterpartVatsLoading } =
    useCounterpartVatList(counterpartId);

  const createReceivable = useCreateReceivable();
  const { data: settings, isLoading: isSettingsLoading } =
    api.entities.getEntitiesIdSettings.useQuery({
      path: { entity_id: entityId },
    });

  const [actualCurrency, setActualCurrency] = useState<
    components['schemas']['CurrencyEnum'] | undefined
  >(settings?.currency?.default);
  const [counterpartBillingAddress, setCounterpartBillingAddress] =
    useState<any>(null);
  const [counterpartShippingAddress, setCounterpartShippingAddress] =
    useState<any>(null);

  const formName = `Monite-Form-receivablesDetailsForm-${useId()}`;

  useEffect(() => {
    const values = getValues();
    const billingAddressId = values.default_billing_address_id;
    if (billingAddressId) {
      setCounterpartBillingAddress(
        counterpartAddresses?.data?.find(
          (address) => address.id === billingAddressId
        )
      );
    }

    const shippingAddressId = values.default_shipping_address_id;
    if (shippingAddressId) {
      setCounterpartShippingAddress(
        counterpartAddresses?.data?.find(
          (address) => address.id === shippingAddressId
        )
      );
    }
  }, [counterpartAddresses]);

  const {
    createReminderDialog,
    editReminderDialog,
    onCreateReminder,
    onEditOverdueReminder,
    onEditPaymentReminder,
    closeCreateReminderDialog,
    closeUpdateReminderDialog,
  } = useInvoiceReminderDialogs({ getValues });

  const theme = useTheme();

  if (isSettingsLoading || isEntityLoading) {
    return <LoadingPage />;
  }

  const className = 'Monite-CreateReceivable';
  const handleCreateReceivable = (values: CreateReceivablesFormProps) => {
    if (values.type !== 'invoice') {
      showErrorToast(new Error('`type` except `invoice` is not supported yet'));
      return;
    }

    if (!actualCurrency) {
      showErrorToast(new Error('`actualCurrency` is not defined'));
      return;
    }

    if (!counterpartBillingAddress) {
      showErrorToast(new Error('`Billing address` is not provided'));
      return;
    }

    const shippingAddressId = values.default_shipping_address_id;

    const counterpartShippingAddress = counterpartAddresses?.data?.find(
      (address) => address.id === shippingAddressId
    );

    const invoicePayload: Omit<
      components['schemas']['ReceivableFacadeCreateInvoicePayload'],
      'is_einvoice'
    > = {
      type: values.type,
      counterpart_id: values.counterpart_id,
      counterpart_vat_id_id: values.counterpart_vat_id_id || undefined,
      counterpart_billing_address_id: counterpartBillingAddress.id,
      counterpart_shipping_address_id: counterpartShippingAddress?.id,

      entity_bank_account_id: values.entity_bank_account_id || undefined,
      payment_terms_id: values.payment_terms_id,
      line_items: values.line_items.map((item) => ({
        quantity: item.quantity,
        product_id: item.product_id,
        ...(isNonVatSupported
          ? { tax_rate_value: (item?.tax_rate_value ?? 0) * 100 }
          : { vat_rate_id: item.vat_rate_id }),
      })),
      memo: values.memo,
      vat_exemption_rationale: values.vat_exemption_rationale,
      ...(!isNonVatSupported && values.entity_vat_id_id
        ? { entity_vat_id_id: values.entity_vat_id_id }
        : {}),
      fulfillment_date: values.fulfillment_date
        ? /**
           * We have to change the date as Backend accepts it.
           * There is no `time` in the request, only year, month and date
           */
          format(values.fulfillment_date, 'yyyy-MM-dd')
        : undefined,
      purchase_order: values.purchase_order || undefined,
      currency: actualCurrency,
      payment_reminder_id: values.payment_reminder_id || undefined,
      overdue_reminder_id: values.overdue_reminder_id || undefined,
      tag_ids: [], // TODO: add support for tags, ideally should be values.tags?.map((tag) => tag.id)
    };

    createReceivable.mutate(
      invoicePayload as components['schemas']['ReceivableFacadeCreateInvoicePayload'],
      {
        onSuccess: (createdReceivable) => {
          onCreate?.(createdReceivable.id);
        },
      }
    );
  };

  return (
    <Stack direction="row" maxHeight={'100vh'} sx={{ overflow: 'hidden' }}>
      <DialogContent className={className + '-Content'} sx={{ width: '50%' }}>
        <DialogTitle className={className + '-Title'}>
          <Toolbar sx={{ padding: 0 }}>
            {dialogContext?.isDialogContent && (
              <IconWrapper
                edge="start"
                color="inherit"
                onClick={dialogContext?.onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconWrapper>
            )}
            <Box sx={{ marginLeft: 'auto' }}>
              <Button
                variant="contained"
                key="next"
                color="primary"
                type="submit"
                form={formName}
                disabled={createReceivable.isPending}
              >{t(i18n)`Next page`}</Button>
            </Box>
          </Toolbar>
        </DialogTitle>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit(handleCreateReceivable)}
            style={{ marginBottom: theme.spacing(7) }}
          >
            <Stack direction="column" spacing={7}>
              <BillToSection
                disabled={createReceivable.isPending}
                counterpartVats={counterpartVats}
                isCounterpartVatsLoading={isCounterpartVatsLoading}
              />
              <ItemsSection
                defaultCurrency={
                  settings?.currency?.default || fallbackCurrency
                }
                actualCurrency={actualCurrency}
                onCurrencyChanged={setActualCurrency}
                isNonVatSupported={isNonVatSupported}
              />

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ mb: 2 }} variant="subtitle1">{t(
                    i18n
                  )`Details`}</Typography>
                  <YourVatDetailsForm
                    isEntityVatIdsLoading={isEntityVatIdsLoading}
                    entityVatIds={entityVatIds}
                    disabled={createReceivable.isPending}
                  />
                </Box>
                <FullfillmentSummary
                  paymentTerms={paymentTerms}
                  isPaymentTermsLoading={isPaymentTermsLoading}
                  refetch={refetchPaymentTerms}
                  disabled={createReceivable.isPending}
                />
              </Box>
              <Box>
                <EntitySection disabled={createReceivable.isPending} />
              </Box>
              <ReminderSection
                disabled={createReceivable.isPending}
                onUpdateOverdueReminder={onEditOverdueReminder}
                onUpdatePaymentReminder={onEditPaymentReminder}
                onCreateReminder={onCreateReminder}
              />
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <Box
        width="50%"
        sx={{
          background: 'linear-gradient(180deg, #F6F6F6 0%, #E4E4FF 100%)',
          height: '100vh',
        }}
      >
        <InvoicePreview
          watch={watch}
          currency={actualCurrency}
          isNonVatSupported={isNonVatSupported}
          entityData={entityData}
          address={counterpartBillingAddress}
          paymentTerms={paymentTerms}
          entityVatIds={entityVatIds}
          counterpartVats={counterpartVats}
        />
      </Box>
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
    </Stack>
  );
};
