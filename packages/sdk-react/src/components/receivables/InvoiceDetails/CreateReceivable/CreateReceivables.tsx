import { RecurrenceSection } from '../../components/RecurrenceSection';
import {
  useGetEntityBankAccounts,
  useGetInvoiceRequiredFields,
  useInvoiceReminderDialogs,
} from '../../hooks';
import { useLineItemSubmitCleanup } from './hooks/useLineItemSubmitCleanup';
import { EntitySection } from './sections/EntitySection';
import { ItemsSection } from './sections/ItemsSection';
import { FullfillmentSummary } from './sections/components/Billing/FullfillmentSummary';
import { InvoicePreview } from './sections/components/InvoicePreview';
import {
  type CreateReceivablesFormProps,
  type CreateReceivablesProductsFormProps,
  type CreateReceivablesFormBeforeValidationLineItemProps,
  getCreateInvoiceValidationSchema,
  getCreateInvoiceProductsValidationSchema,
} from './validation';
import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { showErrorToast } from '@/components/onboarding/utils';
import { BankAccountFormDialog } from '@/components/receivables/components/BankAccountFormDialog';
import { BankAccountSection } from '@/components/receivables/components/BankAccountSection';
import { CreateInvoiceReminderDialog } from '@/components/receivables/components/CreateInvoiceReminderDialog';
import { CustomerSection } from '@/components/receivables/components/CustomerSection';
import { EditInvoiceReminderDialog } from '@/components/receivables/components/EditInvoiceReminderDialog';
import { EntityProfileModal } from '@/components/receivables/components/EntityProfileModal';
import { RemindersSection } from '@/components/receivables/components/RemindersSection';
import { useCreateReceivable } from '@/components/receivables/hooks/useCreateReceivable';
import { useCreateRecurrence } from '@/components/receivables/hooks/useCreateRecurrence';
import { TemplateSettings } from '@/components/templateSettings';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useLocalStorageFields } from '@/core/hooks/useLocalStorageFields';
import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartContactList,
  useCounterpartVatList,
  useMyEntity,
} from '@/core/queries';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { rateMajorToMinor } from '@/core/utils/vatUtils';
import { MoniteCurrency } from '@/ui/Currency';
import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { AccessRestriction } from '@/ui/accessRestriction/AccessRestriction';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { LoadingPage } from '@/ui/loadingPage';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Grid,
  Modal,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type Schemas = components['schemas'];

export interface InvoiceDetailsCreateProps {
  id?: never;

  /** The type of the receivable */
  type: components['schemas']['ReceivableResponse']['type'];

  /**
   * Indicates that the invoice has been successfuly created.
   *
   * @param {string} receivableId Invoice ID
   *
   * @returns {void}
   */
  onCreate?: (receivableId: string) => void;
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
}

/**
 * A component for creating a new Receivable
 * Supported only `invoice` type
 */
export const CreateReceivables = (props: InvoiceDetailsCreateProps) => {
  const { i18n } = useLingui();

  return (
    <MoniteScopedProviders>
      {props.type === 'invoice' ? (
        <CreateReceivablesBase {...props} />
      ) : (
        <AccessRestriction
          description={t(
            i18n
          )`You can not create receivable with a type other than “${'invoice'}”`}
        />
      )}
    </MoniteScopedProviders>
  );
};

const CreateReceivablesBase = ({
  type,
  customerTypes,
  onCreate,
}: InvoiceDetailsCreateProps) => {
  const { i18n } = useLingui();
  const { api, entityId, componentSettings, queryClient } = useMoniteContext();
  const [isRecurrenceEnabled, setIsRecurrenceEnabled] = useState(false);
  const hasInitiallySetDefaultBank = useRef(false);
  const enableEntityBankAccount = Boolean(
    componentSettings?.receivables?.enableEntityBankAccount
  );
  const {
    data: paymentTerms,
    isLoading: isPaymentTermsLoading,
    refetch: refetchPaymentTerms,
  } = api.paymentTerms.getPaymentTerms.useQuery();
  const { data: entityVatIds, error: vatIdsError } =
    api.entities.getEntitiesIdVatIds.useQuery(
      {
        path: { entity_id: entityId },
      },
      {
        enabled: !!entityId,
      }
    );

  if (vatIdsError) {
    const message = getAPIErrorMessage(i18n, vatIdsError);

    if (message) {
      toast.error(message);
    }
  }

  const { data: settings, isLoading: isSettingsLoading } =
    api.entities.getEntitiesIdSettings.useQuery({
      path: { entity_id: entityId },
    });

  const { data: bankAccounts } = useGetEntityBankAccounts(
    undefined,
    enableEntityBankAccount
  );
  const {
    isNonVatSupported,
    isLoading: isEntityLoading,
    data: entityData,
  } = useMyEntity();
  const [isEditCounterpartModalOpen, setIsEditCounterpartModalOpen] =
    useState(false);
  const [isEditCounterpartProfileOpen, setIsEditCounterpartProfileOpen] =
    useState(false);
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState('');
  const fallbackCurrency = 'USD';

  const methods = useForm<CreateReceivablesFormProps>({
    resolver: zodResolver(
      getCreateInvoiceValidationSchema(
        i18n,
        isNonVatSupported,
        enableEntityBankAccount,
        isRecurrenceEnabled
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
        memo: t(
          i18n
        )`Dear client, as discussed, please find attached our invoice:`,
        footer: '',
        vat_mode: settings?.vat_mode ?? 'exclusive',
        recurrence_start_date: undefined,
        recurrence_end_date: undefined,
        recurrence_issue_mode: 'first_day',
      }),
      [type, i18n, settings?.vat_mode]
    ),
  });

  const handleEditCounterpartProfileState = (isOpen: boolean) => {
    setIsEditCounterpartProfileOpen(isOpen);
  };

  const handleEditCounterpartModalState = (isOpen: boolean) => {
    setIsEditCounterpartModalOpen(isOpen);
  };

  const {
    handleSubmit,
    watch,
    getValues,
    setValue,
    clearErrors,
    getFieldState,
    formState,
  } = methods;

  const { registerLineItemCleanupFn, runLineItemCleanup } =
    useLineItemSubmitCleanup();

  const counterpartId = watch('counterpart_id');

  const initialSettingsFields = {
    isFulfillmentDateShown: false,
    isPurchaseOrderShown: false,
    isTermsAndConditionsShown: false,
    isFooterShown: false,
  };

  const [
    visibleSettingsFields,
    setVisibleSettingsFields,
    areFieldsAlwaysSelected,
    setAreFieldsAlwaysSelected,
  ] = useLocalStorageFields(
    'MoniteCreateReceivables',
    'formFields',
    initialSettingsFields
  );

  const { data: counterpart } = useCounterpartById(counterpartId);
  const { data: counterpartAddresses } = useCounterpartAddresses(counterpartId);
  const { data: counterpartVats } = useCounterpartVatList(counterpartId);
  const { data: counterpartContacts } =
    useCounterpartContactList(counterpartId);

  const billingAddressId = watch('default_billing_address_id');
  const counterpartBillingAddress = useMemo(
    () =>
      counterpartAddresses?.data?.find(
        (address) => address.id === billingAddressId
      ),
    [billingAddressId, counterpartAddresses?.data]
  );

  const { mutateAsync: createReceivable, isPending: isPendingReceivable } =
    useCreateReceivable();
  const { mutate: createRecurrence, isPending: isActivatingRecurrence } =
    useCreateRecurrence();
  const isCreatingReceivable = isPendingReceivable || isActivatingRecurrence;

  const { data: requiredFields } = useGetInvoiceRequiredFields({
    entity_vat_id_id: entityVatIds?.data?.[0]?.id || undefined,
    counterpart_billing_address_id:
      (counterpart?.id === counterpartId && billingAddressId) || undefined,
    counterpart_country:
      (counterpartBillingAddress?.id === billingAddressId &&
        counterpartBillingAddress?.country) ||
      undefined,
    counterpart_id: counterpartId || undefined,
    counterpart_type:
      (counterpart?.id === counterpartId && counterpart?.type) || undefined,
    counterpart_vat_id_id:
      (counterpart?.id === counterpartId && counterpartVats?.data?.[0]?.id) ||
      undefined,
  });

  const entityVatId = watch('entity_vat_id_id');
  const counterpartVatId = watch('counterpart_vat_id_id');
  const isCounterpartTaxIdRequired =
    requiredFields?.counterpart?.tax_id?.required;
  const isCounterpartVatIdRequired =
    requiredFields?.counterpart?.vat_id?.required;
  const isEntityTaxIdRequired = requiredFields?.entity?.tax_id?.required;
  const isEntityVatIdRequired = requiredFields?.entity?.vat_id?.required;

  const handleEntityVatTaxIdWarnings = () => {
    if (!requiredFields) return null;

    let message = '';

    if (
      isEntityTaxIdRequired &&
      !isEntityVatIdRequired &&
      !entityData?.tax_id
    ) {
      message = t(i18n)`Set your entity's Tax ID to issue invoice`;
    }

    if (!isEntityTaxIdRequired && isEntityVatIdRequired && !entityVatId) {
      message = t(i18n)`Set your entity's VAT ID to issue invoice`;
    }

    if (
      isEntityTaxIdRequired &&
      isEntityVatIdRequired &&
      !entityVatId &&
      !entityData?.tax_id
    ) {
      message = t(i18n)`Set your entity's VAT ID and Tax ID to issue invoice`;
    }

    if (!message) return null;

    return (
      <Alert severity="error" sx={{ mb: 5 }}>
        <div className="mtw:flex mtw:flex-col mtw:items-start mtw:gap-2">
          <span>{message}</span>

          <button
            className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
            type="button"
            onClick={() => setIsMyEntityProfileModalOpen(true)}
          >
            {t(i18n)`Edit profile`}
          </button>
        </div>
      </Alert>
    );
  };

  const handleCounterpartVatTaxIdWarnings = () => {
    if (!requiredFields) return null;

    let message: string | null = null;

    if (
      isCounterpartTaxIdRequired &&
      !isCounterpartVatIdRequired &&
      !counterpart?.tax_id
    ) {
      message = t(i18n)`Set a Tax ID for this customer to issue invoice`;
    }

    if (
      !isCounterpartTaxIdRequired &&
      isCounterpartVatIdRequired &&
      !counterpartVatId
    ) {
      message = t(i18n)`Set a VAT ID for this customer to issue invoice`;
    }

    if (
      isCounterpartTaxIdRequired &&
      isCounterpartVatIdRequired &&
      !counterpartVatId &&
      !counterpart?.tax_id
    ) {
      message = t(
        i18n
      )`Set a VAT ID and Tax ID for this customer to issue invoice`;
    }

    if (!message) return null;

    return (
      <Alert severity="error" sx={{ mb: 5 }}>
        <div className="mtw:flex mtw:flex-col mtw:items-start mtw:gap-2">
          <span>{message}</span>

          <button
            className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
            type="button"
            onClick={() => handleEditCounterpartModalState(true)}
          >
            {t(i18n)`Edit customer`}
          </button>
        </div>
      </Alert>
    );
  };

  const [actualCurrency, setActualCurrency] = useState<
    Schemas['CurrencyEnum'] | undefined
  >(settings?.currency?.default || fallbackCurrency);

  const [tempCurrency, setTempCurrency] = useState<
    Schemas['CurrencyEnum'] | undefined
  >(undefined);

  const formName = `Monite-Form-receivablesDetailsForm-${useId()}`;

  // this is a workaround until we refactor this component, this component
  // should be broken down into multiple pieces to better position the logic to avoid these workarounds
  useEffect(() => {
    if (
      enableEntityBankAccount &&
      actualCurrency &&
      bankAccounts &&
      !hasInitiallySetDefaultBank.current
    ) {
      const preselectedAccount = bankAccounts?.data?.find(
        (bank) =>
          bank?.currency === actualCurrency && bank?.is_default_for_currency
      );
      setValue('entity_bank_account_id', preselectedAccount?.id ?? '');
      hasInitiallySetDefaultBank.current = true;
    }
  }, [actualCurrency, setValue, bankAccounts, enableEntityBankAccount]);

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

  const className = 'Monite-CreateReceivable';

  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const handleCreateReceivable = async (values: CreateReceivablesFormProps) => {
    const customerHasRemindersEnabled =
      counterpart && counterpart?.reminders_enabled;
    const customerDefaultEmail =
      counterpart &&
      counterpartContacts?.find((contact) => contact.is_default)?.email;
    const validReminderEmail = customerDefaultEmail ? customerDefaultEmail : counterpartContacts && counterpartContacts?.length > 0 ? 
      counterpartContacts?.[0]?.email : counterpart && 'organization' in counterpart ? counterpart?.organization?.email : undefined;
    const customerHasDefaultEmail = Boolean(validReminderEmail);

    if (values.type !== 'invoice') {
      showErrorToast(new Error('`type` except `invoice` is not supported yet'));
      return;
    }

    if (
      isEntityTaxIdRequired &&
      !isEntityVatIdRequired &&
      !entityData?.tax_id
    ) {
      showErrorToast(new Error("Set your entity's Tax ID to issue invoice"));
      return;
    }

    if (
      !isEntityTaxIdRequired &&
      isEntityVatIdRequired &&
      !values.entity_vat_id_id
    ) {
      showErrorToast(new Error("Set your entity's VAT ID to issue invoice"));
      return;
    }

    if (
      isEntityTaxIdRequired &&
      isEntityVatIdRequired &&
      !values.entity_vat_id_id &&
      !entityData?.tax_id
    ) {
      showErrorToast(
        new Error("Set your entity's VAT ID and Tax ID to issue invoice")
      );
      return;
    }

    if (
      isCounterpartTaxIdRequired &&
      !isCounterpartVatIdRequired &&
      !counterpart?.tax_id
    ) {
      showErrorToast(
        new Error('Set a Tax ID for this customer to issue invoice')
      );
      return;
    }

    if (
      !isCounterpartTaxIdRequired &&
      isCounterpartVatIdRequired &&
      !values.counterpart_vat_id_id
    ) {
      showErrorToast(
        new Error('Set a VAT ID for this customer to issue invoice')
      );
      return;
    }

    if (
      isCounterpartTaxIdRequired &&
      isCounterpartVatIdRequired &&
      !values.counterpart_vat_id_id &&
      !counterpart?.tax_id
    ) {
      showErrorToast(
        new Error('Set a VAT ID and Tax ID for this customer to issue invoice')
      );
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

    if (
      !customerHasRemindersEnabled &&
      customerHasDefaultEmail &&
      (values.payment_reminder_id || values.overdue_reminder_id)
    ) {
      showErrorToast(
        new Error(
          'Payment reminders are disabled for this customer. Please enable them in the customer details or turn them off.'
        )
      );
      return;
    }

    if (
      !customerHasDefaultEmail &&
      customerHasRemindersEnabled &&
      (values.payment_reminder_id || values.overdue_reminder_id)
    ) {
      showErrorToast(
        new Error(
          'No email address is added for the selected customer. Please add it to the customer details or turn off the reminders.'
        )
      );
      return;
    }

    if (
      !customerHasRemindersEnabled &&
      !customerHasDefaultEmail &&
      (values.payment_reminder_id || values.overdue_reminder_id)
    ) {
      showErrorToast(
        new Error(
          'Reminders are disabled for this customer, and no email address has been added for it. Please update the details or turn off reminders.'
        )
      );
      return;
    }

    const shippingAddressId = values.default_shipping_address_id;

    const counterpartShippingAddress = counterpartAddresses?.data?.find(
      (address) => address.id === shippingAddressId
    );

    const invoicePayload: Omit<
      Schemas['ReceivableFacadeCreateInvoicePayload'],
      'is_einvoice'
    > = {
      type: values.type,
      counterpart_id: values.counterpart_id,
      counterpart_vat_id_id: values.counterpart_vat_id_id || undefined,
      counterpart_billing_address_id: counterpartBillingAddress?.id,
      counterpart_shipping_address_id: counterpartShippingAddress?.id,

      entity_bank_account_id: values.entity_bank_account_id || undefined,
      payment_terms_id: values.payment_terms_id,
      line_items: values.line_items.map((item) => ({
        quantity: item.quantity,
        product: {
          name: item.product.name,
          price: {
            currency: item.product.price
              .currency as components['schemas']['CurrencyEnum'],
            value: item.product.price.value,
          },
          measure_unit: item.product.measure_unit_id
            ? {
                name:
                  measureUnits?.data?.find(
                    (unit) => unit.id === item.product.measure_unit_id
                  )?.name || '',
              }
            : undefined,
          type: 'product',
        },
        ...(isNonVatSupported
          ? {
              tax_rate_value:
                item?.tax_rate_value !== null &&
                item?.tax_rate_value !== undefined
                  ? rateMajorToMinor(item.tax_rate_value)
                  : undefined,
            }
          : { vat_rate_id: item.vat_rate_id }),
      })),
      memo: values.memo,
      footer: values.footer,
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
      tag_ids: [], // TODO: add support for tags, ideally should be values.tags?.map((tag) => tag.id),
      vat_mode: values.vat_mode || 'exclusive',
    };

    const { id: receivableId } = await createReceivable(
      invoicePayload as Schemas['ReceivableFacadeCreateInvoicePayload'],
      {
        onSuccess: async (createdReceivable) => {
          if (!isRecurrenceEnabled) {
            await api.receivables.getReceivables.invalidateQueries(queryClient);
            onCreate?.(createdReceivable.id);
          }
        },
      }
    );

    if (isRecurrenceEnabled) {
      createRecurrence(
        {
          body: {
            invoice_id: receivableId,
            frequency: 'month',
            interval: 1,
            start_date: values.recurrence_start_date
              ? format(new Date(values.recurrence_start_date), 'yyyy-MM-dd')
              : undefined,
            end_date: values.recurrence_end_date
              ? format(new Date(values.recurrence_end_date), 'yyyy-MM-dd')
              : undefined,
            automation_level: 'issue',
          },
        },
        {
          onSuccess: () => {
            onCreate?.(receivableId);
          },
        }
      );
    }
  };

  const { control } = useForm<CreateReceivablesProductsFormProps>({
    resolver: zodResolver(getCreateInvoiceProductsValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        items: [],
        currency: actualCurrency ?? fallbackCurrency,
      }),
      [actualCurrency]
    ),
  });

  const { root } = useRootElements();

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isEnableFieldsModalOpen, setIsEnableFieldsModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [isMyEntityProfileModalOpen, setIsMyEntityProfileModalOpen] =
    useState(false);

  const handleFieldChange = (fieldName: string, value: boolean) => {
    setVisibleSettingsFields({ ...visibleSettingsFields, [fieldName]: value });
  };

  const handleFieldsAlwaysSelectedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAreFieldsAlwaysSelected(e.target.checked);
  };

  const handleCloseCurrencyModal = () => {
    setIsCurrencyModalOpen(false);
  };

  const handleCloseEnableFieldsModal = () => {
    setIsEnableFieldsModalOpen(false);
  };

  const lineItems = watch('line_items');
  const entityBankAccountId = watch('entity_bank_account_id');
  const paymentTermsId = watch('payment_terms_id');
  const fulfillmentDate = watch('fulfillment_date');
  const memo = watch('memo');
  const footer = watch('footer');
  const vatMode = watch('vat_mode');
  const bankAccountField = getFieldState('entity_bank_account_id');
  const [removeItemsWarning, setRemoveItemsWarning] = useState(false);

  const handleCurrencySubmit = () => {
    if (tempCurrency !== actualCurrency) {
      const validLineItems = lineItems.filter((item) => {
        return item.product?.name?.trim() !== '';
      });

      if (validLineItems.length) {
        setRemoveItemsWarning(true);
      } else {
        const newAccounts = bankAccounts?.data?.reduce<{
          newDefault: components['schemas']['EntityBankAccountResponse'] | null;
          currentlySelected:
            | components['schemas']['EntityBankAccountResponse']
            | null;
        }>(
          (acc, bankAccount) => {
            if (bankAccount?.id === entityBankAccountId) {
              acc.currentlySelected = bankAccount;
            }

            if (
              bankAccount?.currency === tempCurrency &&
              bankAccount?.is_default_for_currency
            ) {
              acc.newDefault = bankAccount;
            }

            return acc;
          },
          { newDefault: null, currentlySelected: null }
        );

        setRemoveItemsWarning(false);
        setActualCurrency(tempCurrency);
        handleCloseCurrencyModal();

        if (
          newAccounts?.newDefault &&
          newAccounts?.currentlySelected?.id !== newAccounts.newDefault.id &&
          newAccounts?.currentlySelected?.is_default_for_currency
        ) {
          setValue('entity_bank_account_id', newAccounts?.newDefault?.id);
        }
      }
    } else {
      setRemoveItemsWarning(false);
      setTempCurrency(actualCurrency);
      handleCloseCurrencyModal();
    }
  };

  const handleSelectBankAfterDeletion = (bankId: string) => {
    setValue('entity_bank_account_id', bankId);
  };

  const handleCloseForm = () => {
    setIsBankFormOpen(false);
    if (selectedBankId) setSelectedBankId('');
  };

  const handleOnBankAccountCreation = (newBankAccountId: string) => {
    setIsBankFormOpen(false);
    setValue('entity_bank_account_id', newBankAccountId);
  };

  useEffect(() => {
    if (entityBankAccountId && bankAccountField?.invalid) {
      clearErrors('entity_bank_account_id');
    }
  }, [entityBankAccountId, bankAccountField, clearErrors]);

  useEffect(() => {
    if (entityBankAccountId && bankAccounts?.data) {
      const selectedBankAccount = bankAccounts.data.find(
        (bank) => bank.id === entityBankAccountId
      );

      if (!selectedBankAccount?.currency) return;

      const newCurrency = selectedBankAccount.currency;

      if (newCurrency !== actualCurrency) {
        setActualCurrency(newCurrency);
      }
    }
  }, [entityBankAccountId, bankAccounts?.data, actualCurrency]);

  useEffect(() => {
    if (entityVatIds && entityVatIds.data.length > 0) {
      setValue('entity_vat_id_id', entityVatIds.data[0].id);
    }
  }, [entityVatIds, setValue]);

  const { currencyGroups, isLoadingCurrencyGroups } =
    useProductCurrencyGroups();

  if (isSettingsLoading || isEntityLoading || isMeasureUnitsLoading) {
    return <LoadingPage />;
  }

  return (
    <Stack direction="row" maxHeight={'100vh'} sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FullScreenModalHeader
          className={className + '-Title Invoice-Preview'}
          title={t(i18n)`Create invoice`}
          actions={
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginRight: '.5em' }}
                    disabled={isCreatingReceivable}
                  >
                    <SettingsOutlinedIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsCurrencyModalOpen(true)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography>{t(i18n)`Currency`}</Typography>
                      <Typography>{actualCurrency}</Typography>
                    </Box>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditTemplateModalOpen(true)}
                  >
                    <Typography>{t(i18n)`Edit template settings`}</Typography>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEnableFieldsModalOpen(true)}
                  >
                    <Typography>{t(i18n)`Enable more fields`}</Typography>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsMyEntityProfileModalOpen(true)}
                  >
                    <Typography>{t(i18n)`My entity profile`}</Typography>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="contained"
                key="next"
                color="primary"
                type="submit"
                form={formName}
                disabled={isCreatingReceivable}
              >
                {isRecurrenceEnabled
                  ? t(i18n)`Activate`
                  : t(i18n)`Save and continue`}
              </Button>
            </>
          }
          closeButtonTooltip={t(i18n)`Close invoice creation`}
        />

        <DialogContent
          className={className + '-Content'}
          sx={{ overflow: 'auto', flex: 1 }}
        >
          {/* Currency Modal */}
          <Modal
            open={isCurrencyModalOpen}
            container={root}
            onClose={handleCloseCurrencyModal}
          >
            <Box
              sx={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 8,
              }}
            >
              <Grid container alignItems="center" p={4}>
                <Grid item width="100%">
                  <Typography variant="h3" mb={3.5}>
                    {t(i18n)`Change document currency`}
                  </Typography>
                  <Typography variant="body2" color="black" mb={1}>
                    {t(
                      i18n
                    )`Invoice will be issued with items in the selected currency`}
                  </Typography>
                  <MoniteCurrency
                    size="small"
                    name="currency"
                    control={control}
                    defaultValue={actualCurrency}
                    hideLabel
                    groups={currencyGroups}
                    disabled={isLoadingCurrencyGroups}
                    onChange={(_event, value) => {
                      if (
                        value &&
                        !Array.isArray(value) &&
                        typeof value !== 'string'
                      ) {
                        setTempCurrency(value.code);
                      }
                    }}
                  />
                  {removeItemsWarning && (
                    <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="inherit">
                        {t(
                          i18n
                        )`All items in the invoice must be in this currency. Remove items that don't match it.`}
                      </Typography>
                    </Alert>
                  )}
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    justifySelf: 'flex-end',
                    marginLeft: 'auto',
                    gap: '1rem',
                    minHeight: 96,
                  }}
                >
                  <Button variant="text" onClick={handleCloseCurrencyModal}>
                    {t(i18n)`Cancel`}
                  </Button>
                  <Button variant="contained" onClick={handleCurrencySubmit}>
                    {t(i18n)`Save`}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          {/* Enable Fields Modal */}
          <Modal
            open={isEnableFieldsModalOpen}
            container={root}
            onClose={handleCloseEnableFieldsModal}
          >
            <Box
              sx={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 8,
              }}
            >
              <Grid container alignItems="center" p={4}>
                <Grid item width="100%">
                  <Typography variant="h3" mb={3.5}>
                    {t(i18n)`Enable more fields`}
                  </Typography>
                  {/* fulfillment date */}
                  <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-between"
                    sx={{
                      pb: 4,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.84)' }}
                      >
                        {t(i18n)`Fulfillment date`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t(
                          i18n
                        )`Add a date when the product will be delivered or the service provided`}
                      </Typography>
                    </Box>
                    <Switch
                      checked={visibleSettingsFields.isFulfillmentDateShown}
                      onChange={(e) =>
                        handleFieldChange(
                          'isFulfillmentDateShown',
                          e.target.checked
                        )
                      }
                      color="primary"
                      aria-label={t(i18n)`Fulfillment date`}
                    />
                  </Box>
                  {/* purchase order */}
                  <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-between"
                    sx={{
                      pb: 4,
                      pt: 4,
                      borderTop: 'solid 1px rgba(0, 0, 0, 0.13)',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.84)' }}
                      >
                        {t(i18n)`Purchase order`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t(
                          i18n
                        )`You can add a document number to have it in the PDF`}
                      </Typography>
                    </Box>
                    <Switch
                      checked={visibleSettingsFields.isPurchaseOrderShown}
                      onChange={(e) =>
                        handleFieldChange(
                          'isPurchaseOrderShown',
                          e.target.checked
                        )
                      }
                      color="primary"
                      aria-label={t(i18n)`Purchase order`}
                    />
                  </Box>
                  {/* note to customer (footer) */}
                  <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-between"
                    sx={{
                      pb: 4,
                      pt: 4,
                      borderTop: 'solid 1px rgba(0, 0, 0, 0.13)',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.84)' }}
                      >
                        {t(i18n)`Note to customer`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t(
                          i18n
                        )`Add a note that will be displayed below the line items`}
                      </Typography>
                    </Box>
                    <Switch
                      checked={visibleSettingsFields.isFooterShown}
                      onChange={(e) =>
                        handleFieldChange('isFooterShown', e.target.checked)
                      }
                      color="primary"
                      aria-label={t(i18n)`Note to customer`}
                    />
                  </Box>
                  {/* terms and conditions */}
                  <Box
                    sx={{
                      display: 'none', //change to flex when backend is ready
                      pb: 4,
                      pt: 4,
                      alignItems: 'start',
                      justifyContent: 'space-between',
                      borderTop: 'solid 1px rgba(0, 0, 0, 0.13)',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.84)' }}
                      >
                        {t(i18n)`Terms and conditions`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t(
                          i18n
                        )`You can include details about the warranty, insurance, liability, late payment fees and any other important notes`}
                      </Typography>
                    </Box>
                    <Switch
                      checked={visibleSettingsFields.isTermsAndConditionsShown}
                      onChange={(e) =>
                        handleFieldChange(
                          'isTermsAndConditionsShown',
                          e.target.checked
                        )
                      }
                      color="primary"
                      aria-label={t(i18n)`Terms and conditions`}
                    />
                  </Box>
                  {/* always show */}
                  <Box
                    sx={{
                      marginTop: 4,
                      paddingTop: 1,
                    }}
                  >
                    <FormControlLabel
                      sx={{ ml: 0 }} //reset mui style
                      control={
                        <Checkbox
                          edge="start"
                          checked={areFieldsAlwaysSelected}
                          onChange={handleFieldsAlwaysSelectedChange}
                          disableRipple
                        />
                      }
                      label={t(
                        i18n
                      )`Always display selected fields on the form (where available)`}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    justifySelf: 'flex-end',
                    marginLeft: 'auto',
                    gap: '1rem',
                    minHeight: 96,
                  }}
                >
                  <Button variant="text" onClick={handleCloseEnableFieldsModal}>
                    {t(i18n)`Cancel`}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCloseEnableFieldsModal}
                  >
                    {t(i18n)`Save`}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <FormProvider {...methods}>
            <form
              id={formName}
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                runLineItemCleanup();
                await handleSubmit(handleCreateReceivable)(e);
              }}
              style={{ marginBottom: theme.spacing(7) }}
            >
              <Stack direction="column" spacing={7}>
                <Box>
                  {Boolean(formState?.errors?.default_billing_address_id) && (
                    <Alert severity="error" sx={{ mb: 5 }}>
                      <div className="mtw:flex mtw:flex-col mtw:items-start mtw:gap-2">
                        <span>
                          {
                            formState?.errors?.default_billing_address_id
                              ?.message
                          }
                        </span>

                        <button
                          className="mtw:underline mtw:p-0 mtw:border-none mtw:outline-none mtw:hover:cursor-pointer mtw:transition-all mtw:hover:opacity-80"
                          type="button"
                          onClick={() => handleEditCounterpartModalState(true)}
                        >
                          {t(i18n)`Edit customer`}
                        </button>
                      </div>
                    </Alert>
                  )}

                  {handleEntityVatTaxIdWarnings()}

                  {handleCounterpartVatTaxIdWarnings()}

                  <CustomerSection
                    disabled={isCreatingReceivable}
                    customerTypes={customerTypes}
                    isEditModalOpen={isEditCounterpartModalOpen}
                    isEditProfileOpen={isEditCounterpartProfileOpen}
                    handleEditModal={handleEditCounterpartModalState}
                    handleEditProfileState={handleEditCounterpartProfileState}
                    counterpart={counterpart}
                  />
                </Box>

                <ItemsSection
                  registerLineItemCleanupFn={registerLineItemCleanupFn}
                  defaultCurrency={
                    settings?.currency?.default || fallbackCurrency
                  }
                  actualCurrency={actualCurrency}
                  isNonVatSupported={isNonVatSupported}
                />

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography sx={{ mb: 2 }} variant="subtitle1">
                    {t(i18n)`Terms`}
                  </Typography>

                  <FullfillmentSummary
                    paymentTerms={paymentTerms}
                    isPaymentTermsLoading={isPaymentTermsLoading}
                    isFieldShown={visibleSettingsFields.isFulfillmentDateShown}
                    refetch={refetchPaymentTerms}
                    disabled={isCreatingReceivable}
                  />

                  {enableEntityBankAccount && (
                    <BankAccountSection
                      entityCurrency={actualCurrency}
                      disabled={isCreatingReceivable}
                      handleOpenBankModal={(id?: string) => {
                        setIsBankFormOpen(true);
                        if (id) setSelectedBankId(id);
                      }}
                    />
                  )}
                </Box>
                <Box>
                  <RemindersSection
                    disabled={isCreatingReceivable}
                    onUpdateOverdueReminder={onEditOverdueReminder}
                    onUpdatePaymentReminder={onEditPaymentReminder}
                    onCreateReminder={onCreateReminder}
                    handleEditCounterpartModal={handleEditCounterpartModalState}
                    handleEditProfileState={handleEditCounterpartProfileState}
                  />

                  <EntitySection
                    visibleFields={visibleSettingsFields}
                    disabled={isCreatingReceivable}
                  />

                  <RecurrenceSection
                    isRecurrenceEnabled={isRecurrenceEnabled}
                    toggleRecurrence={() => {
                      setIsRecurrenceEnabled((prevState) => {
                        const nextState = !prevState;

                        if (!nextState) {
                          clearErrors([
                            'recurrence_issue_mode',
                            'recurrence_start_date',
                            'recurrence_end_date',
                          ]);
                          setValue('recurrence_start_date', undefined, {
                            shouldDirty: false,
                          });
                          setValue('recurrence_end_date', undefined, {
                            shouldDirty: false,
                          });
                        }
                        return nextState;
                      });
                    }}
                  />
                </Box>
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
      </Box>

      <Box
        width="50%"
        sx={{
          background: 'linear-gradient(180deg, #F6F6F6 0%, #E4E4FF 100%)',
          height: '100vh',
          overflow: 'auto',
        }}
      >
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
          currency={
            actualCurrency || settings?.currency?.default || fallbackCurrency
          }
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

      {isEditTemplateModalOpen && (
        <TemplateSettings
          isDialog
          isOpen={isEditTemplateModalOpen}
          handleCloseDialog={() => setIsEditTemplateModalOpen(false)}
        />
      )}

      {isMyEntityProfileModalOpen && (
        <EntityProfileModal
          open={isMyEntityProfileModalOpen}
          onClose={() => setIsMyEntityProfileModalOpen(false)}
        />
      )}

      {enableEntityBankAccount && isBankFormOpen && (
        <BankAccountFormDialog
          isOpen={isBankFormOpen}
          entityBankAccountId={selectedBankId}
          bankAccounts={bankAccounts?.data ?? []}
          onCancel={handleCloseForm}
          onCreate={handleOnBankAccountCreation}
          onUpdate={handleCloseForm}
          onDelete={handleCloseForm}
          handleClose={handleCloseForm}
          handleSelectBankAfterDeletion={handleSelectBankAfterDeletion}
        />
      )}
    </Stack>
  );
};
