import { useInvoiceReminderDialogs } from '../../receivables/hooks';
import { PURCHASE_ORDER_CONSTANTS } from './consts';
import { useCreatePurchaseOrder } from './hooks/useCreatePurchaseOrder';
import { useUpdatePurchaseOrder } from './hooks/useUpdatePurchaseOrder';
import { EntitySection } from './sections/PurchaseOrderEntitySection';
import { FullfillmentSummary } from './sections/PurchaseOrderTermsSummary';
import { VendorSection } from './sections/VendorSection';
import { PurchaseOrderPreview } from './sections/components/PurchaseOrderPreview';
import { PURCHASE_ORDER_MEASURE_UNITS } from './types';
import type { CreatePurchaseOrderFormBeforeValidationProps } from './types';
import {
  type CreatePurchaseOrderFormProps,
  getCreatePurchaseOrderValidationSchema,
} from './validation';
import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { showErrorToast } from '@/components/onboarding/utils';
import { CreateInvoiceReminderDialog } from '@/components/receivables/components/CreateInvoiceReminderDialog';
import { EditInvoiceReminderDialog } from '@/components/receivables/components/EditInvoiceReminderDialog';
import { EntityProfileModal } from '@/components/receivables/components/EntityProfileModal';
import { ConfigurableItemsSection } from '@/components/shared/ItemsSection';
import { PURCHASE_ORDERS_ITEMS_CONFIG } from '@/components/shared/ItemsSection/consts';
import { TemplateSettings } from '@/components/templateSettings';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useLocalStorageFields } from '@/core/hooks/useLocalStorageFields';
import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import {
  useCounterpartById,
  useCounterpartVatList,
  useMyEntity,
} from '@/core/queries';
import { rateMajorToMinor, rateMinorToMajor } from '@/core/utils/currencies';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { vatRatePercentageToBasisPoints } from '@/core/utils/vatUtils';
import { vatRateBasisPointsToPercentage } from '@/core/utils/vatUtils';
import { MoniteCurrency } from '@/ui/Currency';
import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { AccessRestriction } from '@/ui/accessRestriction/AccessRestriction';
import { Button } from '@/ui/components/button';
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
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  Modal,
  Grid,
} from '@mui/material';
import { addDays } from 'date-fns';
import { Settings } from 'lucide-react';
import { useEffect, useId, useMemo, useState, useCallback } from 'react';
import { useForm, FormProvider, type Resolver } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type Schemas = components['schemas'];

export interface PurchaseOrderDetailsCreateProps {
  id?: never;

  /** The type of the purchase order */
  type: 'purchase_order';

  /**
   * Indicates that the purchase order has been successfuly created.
   *
   * @param {string} purchaseOrderId Purchase Order ID
   *
   * @returns {void}
   */
  onCreate?: (purchaseOrderId: string) => void;

  /**
   * Indicates that the purchase order has been successfully updated.
   *
   * @param {PurchaseOrderResponseSchema} purchaseOrder Updated Purchase Order object
   *
   * @returns {void}
   */
  onUpdate?: (
    purchaseOrder: components['schemas']['PurchaseOrderResponseSchema']
  ) => void;

  /** @see {@link CustomerTypes} */
  vendorTypes?: CustomerTypes;

  /** Existing purchase order data for edit mode */
  existingPurchaseOrder?:
    | components['schemas']['PurchaseOrderResponseSchema']
    | null;

  /** Cancel callback */
  onCancel?: () => void;
}

export const CreatePurchaseOrder = (props: PurchaseOrderDetailsCreateProps) => {
  const { i18n } = useLingui();

  return (
    <MoniteScopedProviders>
      {props.type === 'purchase_order' ? (
        <CreatePurchaseOrderBase {...props} />
      ) : (
        <AccessRestriction
          description={t(
            i18n
          )`You can not create purchase order with a type other than "${'purchase_order'}"`}
        />
      )}
    </MoniteScopedProviders>
  );
};

const CreatePurchaseOrderBase = ({
  vendorTypes,
  existingPurchaseOrder,
  onCreate,
  onUpdate,
  onCancel,
}: PurchaseOrderDetailsCreateProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

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

  const {
    isNonVatSupported,
    isLoading: isEntityLoading,
    data: entityData,
  } = useMyEntity();
  const [isEditCounterpartModalOpen, setIsEditCounterpartModalOpen] =
    useState(false);
  const [isEditCounterpartProfileOpen, setIsEditCounterpartProfileOpen] =
    useState(false);
  const fallbackCurrency: components['schemas']['CurrencyEnum'] = 'USD';
  const formDefaultValues = useMemo(() => {
    if (existingPurchaseOrder) {
      return {
        counterpart_id: existingPurchaseOrder.counterpart_id || '',
        line_items:
          existingPurchaseOrder.items?.map((item) => {
            const convertedVatRateValue = isNonVatSupported
              ? undefined
              : vatRateBasisPointsToPercentage(item.vat_rate);
            const convertedTaxRateValue = isNonVatSupported
              ? vatRateBasisPointsToPercentage(item.vat_rate)
              : undefined;

            return {
              name: item.name,
              quantity: item.quantity,
              unit: PURCHASE_ORDER_MEASURE_UNITS.includes(
                item.unit as (typeof PURCHASE_ORDER_MEASURE_UNITS)[number]
              )
                ? (item.unit as (typeof PURCHASE_ORDER_MEASURE_UNITS)[number])
                : 'unit',
              price: rateMinorToMajor(item.price),
              currency: item.currency as components['schemas']['CurrencyEnum'],
              vat_rate_value: convertedVatRateValue,
              tax_rate_value: convertedTaxRateValue,
              vat_rate_id: undefined,
            };
          }) || [],
        valid_for_days:
          existingPurchaseOrder.valid_for_days ||
          PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS,
        expiry_date: existingPurchaseOrder.valid_for_days
          ? addDays(new Date(), existingPurchaseOrder.valid_for_days)
          : undefined,
        message: existingPurchaseOrder.message || '',
        currency:
          (existingPurchaseOrder.currency as components['schemas']['CurrencyEnum']) ||
          fallbackCurrency,
        entity_vat_id_id:
          existingPurchaseOrder.entity_vat_id?.id ||
          entityVatIds?.data?.[0]?.id ||
          undefined,
        counterpart_address_id: undefined,
        project_id: existingPurchaseOrder.project_id || undefined,
        footer: '',
      };
    }

    return {
      counterpart_id: '',
      line_items: [],
      valid_for_days: PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS,
      expiry_date: undefined,
      message: '',
      currency: fallbackCurrency as components['schemas']['CurrencyEnum'],
      vat_mode: 'exclusive' as const,
      entity_vat_id_id: entityVatIds?.data?.[0]?.id || undefined,
      counterpart_address_id: undefined,
      project_id: undefined,
      footer: '',
    };
  }, [
    fallbackCurrency,
    entityVatIds?.data,
    existingPurchaseOrder,
    isNonVatSupported,
  ]);

  const methods = useForm<CreatePurchaseOrderFormProps>({
    resolver: zodResolver(
      getCreatePurchaseOrderValidationSchema(i18n, isNonVatSupported)
    ) as Resolver<CreatePurchaseOrderFormProps>,
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (existingPurchaseOrder && formDefaultValues.line_items.length > 0) {
      methods.reset(formDefaultValues);
    }
  }, [existingPurchaseOrder, formDefaultValues, methods]);

  const handleEditCounterpartProfileState = (isOpen: boolean) => {
    setIsEditCounterpartProfileOpen(isOpen);
  };

  const handleEditCounterpartModalState = (isOpen: boolean) => {
    setIsEditCounterpartModalOpen(isOpen);
  };

  const { handleSubmit, watch, getValues, setValue, formState } = methods;

  const counterpartId = watch('counterpart_id');
  const currentMessage = watch('message');
  const isEditMode = Boolean(existingPurchaseOrder);

  const initialSettingsFields = {
    isFulfillmentDateShown: false,
    isMessageShown: true,
    isFooterShown: false,
  };

  const [
    visibleSettingsFields,
    setVisibleSettingsFields,
    areFieldsAlwaysSelected,
    setAreFieldsAlwaysSelected,
  ] = useLocalStorageFields(
    'MoniteCreatePurchaseOrder',
    'formFields',
    initialSettingsFields
  );

  useEffect(() => {
    if (
      (Boolean(currentMessage) || isEditMode) &&
      !visibleSettingsFields.isMessageShown
    ) {
      setVisibleSettingsFields({
        ...visibleSettingsFields,
        isMessageShown: true,
      });
    }
  }, [
    currentMessage,
    isEditMode,
    visibleSettingsFields,
    setVisibleSettingsFields,
  ]);

  const { data: counterpartVats } = useCounterpartVatList(counterpartId);

  const createPurchaseOrder = useCreatePurchaseOrder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();

  const [actualCurrency, setActualCurrency] = useState<
    Schemas['CurrencyEnum'] | undefined
  >(settings?.currency?.default || fallbackCurrency);

  const [tempCurrency, setTempCurrency] = useState<
    Schemas['CurrencyEnum'] | undefined
  >(undefined);

  const formName = `Monite-Form-purchaseOrderDetailsForm-${useId()}`;
  const {
    createReminderDialog,
    editReminderDialog,
    closeCreateReminderDialog,
    closeUpdateReminderDialog,
  } = useInvoiceReminderDialogs({ getValues });

  const { data: counterpart } = useCounterpartById(counterpartId);

  const className = 'Monite-CreatePurchaseOrder';
  const { root } = useRootElements();

  const { isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const handleCreatePurchaseOrder = useCallback(
    (values: CreatePurchaseOrderFormProps) => {
      if (!actualCurrency) {
        showErrorToast(new Error(t(i18n)`Currency is not defined`));

        return;
      }

      const purchaseOrderPayload = {
        counterpart_id: values.counterpart_id,
        counterpart_address_id: values.counterpart_address_id,
        entity_vat_id_id: values.entity_vat_id_id || undefined,
        items: values.line_items.map((item) => {
          const quantity = Number(item.quantity);
          const price = Number(item.price);
          const vatRate = Number(
            item.vat_rate_value || item.tax_rate_value || 0
          );

          return {
            quantity: isNaN(quantity)
              ? PURCHASE_ORDER_CONSTANTS.DEFAULT_QUANTITY
              : quantity,
            name: item.name,
            unit: item.unit,
            price: isNaN(price) ? 0 : rateMajorToMinor(price),
            currency: actualCurrency,
            vat_rate: isNaN(vatRate)
              ? 0
              : vatRatePercentageToBasisPoints(vatRate),
          };
        }),
        message: values.message || '',
        valid_for_days: isNaN(Number(values.valid_for_days))
          ? PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS
          : Number(values.valid_for_days),
        currency: actualCurrency,
        project_id: values.project_id,
      };

      if (isEditMode && existingPurchaseOrder) {
        updatePurchaseOrder.mutate(
          {
            header: { 'x-monite-entity-id': entityId },
            path: { purchase_order_id: existingPurchaseOrder.id },
            body: purchaseOrderPayload,
          },
          {
            onSuccess: (updatedPurchaseOrder) => {
              if (onUpdate) {
                onUpdate(updatedPurchaseOrder);
              } else if (onCancel) {
                onCancel();
              } else {
                onCreate?.(updatedPurchaseOrder.id);
              }
            },
            onError: (error) => {
              const errorMessage = getAPIErrorMessage(i18n, error);

              showErrorToast(
                new Error(
                  errorMessage || t(i18n)`Failed to update purchase order`
                )
              );
            },
          }
        );
      } else {
        createPurchaseOrder.mutate(
          {
            header: { 'x-monite-entity-id': entityId },
            body: purchaseOrderPayload,
          },
          {
            onSuccess: (createdPurchaseOrder) => {
              onCreate?.(createdPurchaseOrder.id);
            },
            onError: (error) => {
              const errorMessage = getAPIErrorMessage(i18n, error);

              showErrorToast(
                new Error(
                  errorMessage || t(i18n)`Failed to create purchase order`
                )
              );
            },
          }
        );
      }
    },
    [
      actualCurrency,
      i18n,
      isEditMode,
      existingPurchaseOrder,
      updatePurchaseOrder,
      createPurchaseOrder,
      entityId,
      onUpdate,
      onCancel,
      onCreate,
    ]
  );

  const { control } = useForm({
    defaultValues: useMemo(
      () => ({
        items: [],
        currency: actualCurrency ?? fallbackCurrency,
      }),
      [actualCurrency]
    ),
  });

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isEnableFieldsModalOpen, setIsEnableFieldsModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [isMyEntityProfileModalOpen, setIsMyEntityProfileModalOpen] =
    useState(false);

  const handleFieldChange = useCallback(
    (fieldName: keyof typeof visibleSettingsFields, value: boolean) => {
      setVisibleSettingsFields((prev: typeof visibleSettingsFields) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    [setVisibleSettingsFields]
  );

  const handleFieldsAlwaysSelectedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAreFieldsAlwaysSelected(e.target.checked);
    },
    [setAreFieldsAlwaysSelected]
  );

  const handleCloseCurrencyModal = useCallback(() => {
    setIsCurrencyModalOpen(false);
  }, []);

  const handleOpenCurrencyModal = useCallback(() => {
    setIsCurrencyModalOpen(true);
  }, []);

  const handleCloseEnableFieldsModal = useCallback(() => {
    setIsEnableFieldsModalOpen(false);
  }, []);

  const lineItems = watch('line_items');
  const validForDays = watch('valid_for_days');
  const message = watch('message');
  const [removeItemsWarning, setRemoveItemsWarning] = useState(false);

  const handleCurrencySubmit = useCallback(() => {
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
  }, [tempCurrency, actualCurrency, lineItems, handleCloseCurrencyModal]);

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
    <Stack direction="row" className="mtw:max-h-screen mtw:overflow-hidden">
      <Box className="mtw:w-1/2 mtw:h-screen mtw:flex mtw:flex-col">
        <FullScreenModalHeader
          className={className + '-Title PurchaseOrder-Preview'}
          title={
            isEditMode
              ? t(i18n)`Edit purchase order`
              : t(i18n)`Create purchase order`
          }
          actions={
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mtw:mr-2"
                    disabled={
                      createPurchaseOrder.isPending ||
                      updatePurchaseOrder.isPending
                    }
                  >
                    <Settings />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOpenCurrencyModal}>
                    <div className="mtw:flex mtw:justify-between mtw:w-full">
                      <Typography>{t(i18n)`Currency`}</Typography>
                      <Typography>{actualCurrency}</Typography>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditTemplateModalOpen(true)}
                  >
                    <Typography>{t(i18n)`Edit template settings`}</Typography>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="default"
                key="next"
                type="submit"
                form={formName}
                disabled={
                  createPurchaseOrder.isPending || updatePurchaseOrder.isPending
                }
              >
                {t(i18n)`Save and continue`}
              </Button>
            </>
          }
          closeButtonTooltip={
            isEditMode
              ? t(i18n)`Close purchase order editing`
              : t(i18n)`Close purchase order creation`
          }
        />

        <div
          className={
            className +
            '-Content' +
            ' mtw:flex-1 mtw:overflow-auto mtw:px-8 mtw:py-4'
          }
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
                borderRadius: 2,
              }}
            >
              <Grid container alignItems="center" p={4}>
                <Grid item width="100%">
                  <Typography variant="h3" mb={3}>
                    {t(i18n)`Change document currency`}
                  </Typography>
                  <Typography variant="body2" color="black" mb={1}>
                    {t(
                      i18n
                    )`Purchase order will be issued with items in the selected currency`}
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
                        )`All items in the purchase order must be in this currency. Remove items that don't match it.`}
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
                  <Button variant="ghost" onClick={handleCloseCurrencyModal}>
                    {t(i18n)`Cancel`}
                  </Button>
                  <Button variant="default" onClick={handleCurrencySubmit}>
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
                borderRadius: 2,
              }}
            >
              <Grid container alignItems="center" p={4}>
                <Grid item width="100%">
                  <Typography variant="h3" mb={3}>
                    {t(i18n)`Enable more fields`}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-between"
                    sx={{ pb: 4 }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(0, 0, 0, 0.85)' }}
                      >
                        {t(i18n)`Message`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t(i18n)`Add a message for the vendor`}
                      </Typography>
                    </Box>
                    <Switch
                      checked={visibleSettingsFields.isMessageShown}
                      onChange={(e) =>
                        handleFieldChange('isMessageShown', e.target.checked)
                      }
                      color="primary"
                      aria-label={t(i18n)`Message`}
                    />
                  </Box>
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
                        sx={{ color: 'rgba(0, 0, 0, 0.85)' }}
                      >
                        {t(i18n)`Note to vendor`}
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
                      aria-label={t(i18n)`Note to vendor`}
                    />
                  </Box>
                  <Box sx={{ mt: 4, pt: 1 }}>
                    <FormControlLabel
                      className="mtw:ml-0"
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
                    variant="ghost"
                    onClick={handleCloseEnableFieldsModal}
                  >
                    {t(i18n)`Cancel`}
                  </Button>
                  <Button
                    variant="default"
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
              onSubmit={handleSubmit(handleCreatePurchaseOrder)}
              className="mtw:mb-14"
            >
              <Stack direction="column" spacing={7}>
                {Object.keys(formState.errors).length > 0 && (
                  <Alert severity="error">
                    {t(i18n)`Please check the form for errors and try again.`}
                  </Alert>
                )}
                <VendorSection
                  disabled={
                    createPurchaseOrder.isPending ||
                    updatePurchaseOrder.isPending
                  }
                  vendorTypes={vendorTypes}
                  isEditModalOpen={isEditCounterpartModalOpen}
                  isEditProfileOpen={isEditCounterpartProfileOpen}
                  handleEditModal={handleEditCounterpartModalState}
                  handleEditProfileState={handleEditCounterpartProfileState}
                  counterpart={counterpart}
                />

                <ConfigurableItemsSection<CreatePurchaseOrderFormBeforeValidationProps>
                  config={PURCHASE_ORDERS_ITEMS_CONFIG}
                  defaultCurrency={
                    settings?.currency?.default || fallbackCurrency
                  }
                  actualCurrency={actualCurrency}
                  isNonVatSupported={isNonVatSupported}
                />

                <Box className="mtw:w-full mtw:flex mtw:flex-col">
                  <Typography className="mtw:mb-2" variant="subtitle1">
                    {t(i18n)`Details`}
                  </Typography>

                  <FullfillmentSummary
                    disabled={
                      createPurchaseOrder.isPending ||
                      updatePurchaseOrder.isPending
                    }
                  />

                  <EntitySection
                    visibleFields={visibleSettingsFields}
                    disabled={
                      createPurchaseOrder.isPending ||
                      updatePurchaseOrder.isPending
                    }
                  />
                </Box>
              </Stack>
            </form>
          </FormProvider>
        </div>
      </Box>

      <div className="mtw:w-1/2 mtw:bg-[linear-gradient(180deg,_#F6F6F6_0%,_#E4E4FF_100%)] mtw:h-screen mtw:overflow-auto">
        <PurchaseOrderPreview
          purchaseOrderData={{
            valid_for_days: validForDays,
            line_items: lineItems || [],
            message,
          }}
          counterpart={counterpart}
          currency={
            actualCurrency || settings?.currency?.default || fallbackCurrency
          }
          isNonVatSupported={isNonVatSupported}
          entityData={entityData}
          entityVatIds={entityVatIds}
          counterpartVats={counterpartVats}
        />
      </div>
      <CreateInvoiceReminderDialog
        open={createReminderDialog.open}
        reminderType={createReminderDialog.reminderType}
        onClose={closeCreateReminderDialog}
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
          documentType="purchase_order"
        />
      )}

      {isMyEntityProfileModalOpen && (
        <EntityProfileModal
          open={isMyEntityProfileModalOpen}
          onClose={() => setIsMyEntityProfileModalOpen(false)}
        />
      )}
    </Stack>
  );
};
