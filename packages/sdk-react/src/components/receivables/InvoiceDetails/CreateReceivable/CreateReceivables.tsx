import { useEffect, useId, useMemo, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

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
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartVatList,
  useMyEntity,
} from '@/core/queries';
import { useCreateReceivable } from '@/core/queries/useReceivables';
import { MoniteCurrency } from '@/ui/Currency';
import { IconWrapper } from '@/ui/iconWrapper';
import { LoadingPage } from '@/ui/loadingPage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Modal,
  Popper,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import { format } from 'date-fns';

import { ActiveInvoiceTitleTestId } from './components/ProductsTable.types';
import { FullfillmentSummary } from './sections/components/Billing/FullfillmentSummary';
import { YourVatDetailsForm } from './sections/components/Billing/YourVatDetailsForm';
import { InvoicePreview } from './sections/components/InvoicePreview';
import { CustomerSection } from './sections/CustomerSection';
import { EntitySection } from './sections/EntitySection';
import { ItemsSection } from './sections/ItemsSection';
//import { VatAndTaxValidator } from './sections/VatAndTaxValidator'; BE is pending
import {
  getCreateInvoiceValidationSchema,
  CreateReceivablesFormProps,
  CreateReceivablesProductsFormProps,
  getCreateInvoiceProductsValidationSchema,
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

const saveFieldsToLocalStorage = (fields: any) => {
  try {
    window.localStorage.setItem('formFields', JSON.stringify(fields));
  } catch (error) {
    console.error('Failed to save fields to local storage:', error);
  }
};

const clearFieldsFromLocalStorage = () => {
  try {
    window.localStorage.removeItem('formFields');
  } catch (error) {
    console.error('Failed to clear fields from local storage:', error);
  }
};

const loadFieldsFromLocalStorage = () => {
  try {
    const storedFields = window.localStorage.getItem('formFields');
    return storedFields ? JSON.parse(storedFields) : null;
  } catch (error) {
    console.error('Failed to load fields from local storage:', error);
    return null;
  }
};

const CreateReceivablesBase = ({
  type,
  onCreate,
  customerTypes,
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

  const initialSettingsFields = {
    isFulfillmentDateShown: false,
    isPurchaseOrderShown: false,
    isTermsAndConditionsShown: false,
  };

  const [visibleSettingsFields, setVisibleSettingsFields] = useState(
    initialSettingsFields
  );

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

  const [tempCurrency, setTempCurrency] = useState<
    components['schemas']['CurrencyEnum'] | undefined
  >(undefined);

  const [counterpartBillingAddress, setCounterpartBillingAddress] =
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
  }, [counterpartAddresses, getValues]);

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

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);

  const className = 'Monite-CreateReceivable';
  const handleCreateReceivable = (values: CreateReceivablesFormProps) => {
    console.log('got here');
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

    const filteredLineItems = values.line_items.filter((item) => {
      return item.name?.trim() !== '';
    });

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
      line_items: filteredLineItems.map((item) => ({
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

  const { control } = useForm<CreateReceivablesProductsFormProps>({
    resolver: yupResolver(getCreateInvoiceProductsValidationSchema(i18n)),
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

  const [areFieldsAlwaysSelected, setAreFieldsAlwaysSelected] = useState(() => {
    try {
      return window.localStorage.getItem('areFieldsAlwaysSelected') === 'true';
    } catch (error) {
      console.warn('areFieldsAlwaysSelected not found:', error);
      return false;
    }
  });

  useEffect(() => {
    if (areFieldsAlwaysSelected) {
      const storedFields = loadFieldsFromLocalStorage();
      if (storedFields) {
        setVisibleSettingsFields(storedFields);
      }
    }
  }, [areFieldsAlwaysSelected]);

  const handleFieldsAlwaysSelectedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;
    setAreFieldsAlwaysSelected(isChecked);
    window.localStorage.setItem('areFieldsAlwaysSelected', String(isChecked));

    if (isChecked) {
      saveFieldsToLocalStorage(fields);
    } else {
      clearFieldsFromLocalStorage();
    }
  };

  const handleFieldChange = (fieldName: string, value: boolean) => {
    const updatedFields = { ...visibleSettingsFields, [fieldName]: value };
    setVisibleSettingsFields(updatedFields);

    if (areFieldsAlwaysSelected) {
      saveFieldsToLocalStorage(updatedFields);
    }
  };

  const handleCloseCurrencyModal = () => {
    setIsCurrencyModalOpen(false);
    setAnchorEl(null);
  };

  const handleCloseEnableFieldsModal = () => {
    setIsEnableFieldsModalOpen(false);
    setAnchorEl(null);
  };

  const lineItems = watch('line_items');
  const [removeItemsWarning, setRemoveItemsWarning] = useState(false);

  const handleCurrencySubmit = () => {
    if (tempCurrency !== actualCurrency) {
      const validLineItems = lineItems.filter((item) => {
        return item.name?.trim() !== '';
      });

      if (validLineItems.length) {
        setRemoveItemsWarning(true);
      } else {
        setRemoveItemsWarning(false);
        setActualCurrency(tempCurrency);
        handleCloseCurrencyModal();
      }
    } else {
      setRemoveItemsWarning(false);
      setTempCurrency(actualCurrency);
      handleCloseCurrencyModal();
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSettings = (event: any) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  if (isSettingsLoading || isEntityLoading) {
    return <LoadingPage />;
  }

  return (
    <Stack direction="row" maxHeight={'100vh'} sx={{ overflow: 'hidden' }}>
      <DialogContent className={className + '-Content'} sx={{ width: '50%' }}>
        <DialogTitle className={className + '-Title Invoice-Preview'}>
          <Toolbar>
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
                variant="outlined"
                color="primary"
                type="submit"
                sx={{ marginRight: '.5em' }}
                onClick={(event) => {
                  event.preventDefault();
                  handleSettings(event);
                }}
                form={formName}
                disabled={createReceivable.isPending}
              >
                <SettingsOutlinedIcon />
              </Button>
              <Popper
                anchorEl={anchorEl}
                container={root}
                keepMounted
                placement="bottom-end"
                open={Boolean(anchorEl)}
              >
                <Card
                  sx={{
                    padding: '1em',
                    marginTop: '.5em',
                    boxShadow: '0px 4px 16px 0px #0F0F0F29',
                    width: '240px',
                  }}
                >
                  <MenuItem
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    onClick={() => setIsCurrencyModalOpen(true)}
                  >
                    <Typography>{t(i18n)`Currency`}</Typography>
                    <Typography>{actualCurrency}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setIsEnableFieldsModalOpen(true)}>
                    <Typography>{t(i18n)`Enable more fields`}</Typography>
                  </MenuItem>

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
                            hideLabel
                            // @ts-expect-error
                            onChange={(event, value, reason, details) => {
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
                                )`All items in the invoice must be in this currency. Remove items that don’t match it.`}
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
                          <Button
                            variant="text"
                            onClick={handleCloseCurrencyModal}
                          >
                            {t(i18n)`Cancel`}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleCurrencySubmit}
                          >
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
                              checked={
                                visibleSettingsFields.isFulfillmentDateShown
                              }
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
                              checked={
                                visibleSettingsFields.isPurchaseOrderShown
                              }
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
                          {/* terms and conditions */}
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
                                {t(i18n)`Terms and conditions`}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {t(
                                  i18n
                                )`You can include details about the warranty, insurance, liability, late payment fees and any other important notes`}
                              </Typography>
                            </Box>
                            <Switch
                              checked={
                                visibleSettingsFields.isTermsAndConditionsShown
                              }
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
                          <Button
                            variant="text"
                            onClick={handleCloseEnableFieldsModal}
                          >
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
                </Card>
              </Popper>

              <Button
                variant="contained"
                key="next"
                color="primary"
                type="submit"
                form={formName}
                disabled={createReceivable.isPending}
              >{t(i18n)`Save and continue`}</Button>
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
              <Box>
                <Typography
                  sx={{ mt: 8, mb: 5 }}
                  data-testid={
                    ActiveInvoiceTitleTestId.ActiveInvoiceTitleTestId
                  }
                  variant="h3"
                >{t(i18n)`Create invoice`}</Typography>

                <CustomerSection
                  disabled={createReceivable.isPending}
                  counterpart={counterpart}
                  counterpartVats={counterpartVats}
                  isCounterpartVatsLoading={isCounterpartVatsLoading}
                  isCounterpartLoading={isCounterpartLoading}
                  customerTypes={customerTypes}
                />
              </Box>

              <ItemsSection
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
                  isFieldShown={visibleSettingsFields.isFulfillmentDateShown}
                  refetch={refetchPaymentTerms}
                  disabled={createReceivable.isPending}
                />
              </Box>
              <Box>
                <EntitySection
                  visibleFields={visibleSettingsFields}
                  disabled={createReceivable.isPending}
                />
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
          overflow: 'auto',
        }}
      >
        <InvoicePreview
          watch={watch}
          counterpart={counterpart}
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
