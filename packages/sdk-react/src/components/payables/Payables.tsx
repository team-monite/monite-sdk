import { CreatePayableMenu } from './CreatePayableMenu';
import { CustomerTypes } from '@/components/counterparts/types';
import { PayablesTabEnum } from './types';
import { PayableDetails } from '@/components/payables/PayableDetails';
import { UsePayableDetailsProps } from '@/components/payables/PayableDetails/usePayableDetails';
import { PayablesTable } from '@/components/payables/PayablesTable';
import { usePayableCallbacks } from '@/components/payables/hooks/usePayableCallbacks';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useFileInput } from '@/core/hooks';
import { useComponentSettings } from '@/core/hooks/useComponentSettings';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { Dialog } from '@/ui/Dialog';
import { PageHeader } from '@/ui/PageHeader';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/components/tabs-underline';
import { useState, lazy, Suspense } from 'react';

const PurchaseOrdersTable = lazy(() => import('@/components/payables/PurchaseOrders').then(module => ({ default: module.PurchaseOrdersTable })));
const PurchaseOrderDetails = lazy(() => import('@/components/payables/PurchaseOrders').then(module => ({ default: module.PurchaseOrderDetails })));
import { toast } from 'react-hot-toast';

export type PayablesProps = {
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
  /**
   * Enable GL code selection for payable line items.
   * When true, users can assign GL codes to individual line items.
   * GL codes are fetched from the connected accounting system.
   */
  enableGLCodes?: boolean;
} & Pick<
  UsePayableDetailsProps,
  | 'onSaved'
  | 'onCanceled'
  | 'onSubmitted'
  | 'onRejected'
  | 'onApproved'
  | 'onReopened'
  | 'onDeleted'
  | 'onPay'
  | 'onPayUS'
>;

export const Payables = (props: PayablesProps) => {
  return (
    <MoniteScopedProviders>
      <PayablesBase {...props} />
    </MoniteScopedProviders>
  );
};


const PayablesBase = ({
  customerTypes,
  enableGLCodes,
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onReopened,
  onDeleted,
  onPay,
  onPayUS,
}: PayablesProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const { componentSettings } = useComponentSettings();

  const {
    handleSaved,
    handleCanceled,
    handleSubmitted,
    handleRejected,
    handleApproved,
    handleReopened,
    handleDeleted,
    handlePay,
  } = usePayableCallbacks({
    onSaved,
    onCanceled,
    onSubmitted,
    onRejected,
    onApproved,
    onReopened,
    onDeleted,
    onPay,
  });

  const [activeTab, setActiveTab] = useState<PayablesTabEnum>(PayablesTabEnum.Bills);

  const [invoiceIdDialog, setInvoiceIdDialog] = useState<{
    invoiceId: string | undefined;
    open: boolean;
  }>({ invoiceId: undefined, open: false });

  const [purchaseOrderIdDialog, setPurchaseOrderIdDialog] = useState<{
    purchaseOrderId: string | undefined;
    open: boolean;
  }>({ purchaseOrderId: undefined, open: false });

  const closeEditDialog = () => {
    setInvoiceIdDialog((prev) => ({
      ...prev,
      open: false,
      invoiceId: undefined,
    }));
  };

  const closePurchaseOrderDialog = () => {
    setPurchaseOrderIdDialog((prev) => ({
      ...prev,
      open: false,
      purchaseOrderId: undefined,
    }));
  };

  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState(false);
  
  const [isCreatePurchaseOrderDialogOpen, setIsCreatePurchaseOrderDialogOpen] =
    useState(false);

  const { FileInput, openFileInput, checkFileError } = useFileInput();
  const payableUploadFromFileMutation =
    api.payables.postPayablesUploadFromFile.useMutation(
      {},
      {
        onSuccess: () =>
          api.payables.getPayables.invalidateQueries(queryClient),
        onError: () => {
          // This onError does nothing.
          // The actionable onError is defined in payableUploadFromFileMutation.mutateAsync().
          // Need to define this onError so that global QueryClient.mutationCache.onError is skipped.
          return;
        },
      }
    );

  const handleFileUpload = (files: File | FileList) => {
    const fileArray = files instanceof File ? [files] : Array.from(files);

    fileArray.forEach((file) => {
      const error = checkFileError(file);
      if (error) {
        toast.error(error);
        return;
      }

      toast.promise(
        payableUploadFromFileMutation.mutateAsync({
          file,
        }),
        {
          loading: t(i18n)`Uploading ${file.name}`,
          success: t(i18n)`Payable ${file.name} uploaded successfully`,
          error: (error) => getAPIErrorMessage(i18n, error),
        }
      );
    });
  };

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isCreatePurchaseOrderAllowed, isLoading: isCreatePurchaseOrderAllowedLoading } =
    useIsActionAllowed({
      method: 'payables_purchase_order',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'read',
      entityUserId: user?.id,
    });

  const { root } = useRootElements();
  const className = 'Monite-Payables-Header';
  const finalEnableGLCodes =
    enableGLCodes ?? componentSettings?.payables?.enableGLCodes ?? false;

  return (
    <>
      <PageHeader
        className={className + '-Header'}
        title={
          <>
            {t(i18n)`Bill Pay`}
            {(isReadAllowedLoading || isCreateAllowedLoading || isCreatePurchaseOrderAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <CreatePayableMenu
            isCreateAllowed={isCreateAllowed}
            isCreatePurchaseOrderAllowed={isCreatePurchaseOrderAllowed}
            onCreateInvoice={() => setIsCreateInvoiceDialogOpen(true)}
            onCreatePurchaseOrder={() => setIsCreatePurchaseOrderDialogOpen(true)}
            handleFileUpload={handleFileUpload}
            activeTab={activeTab}
          />
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as PayablesTabEnum)}
          className="mtw:w-full"
        >
          <TabsList className="mtw:mb-4">
            <TabsTrigger value={PayablesTabEnum.Bills}>
              {t(i18n)`Bills`}
            </TabsTrigger>
            <TabsTrigger value={PayablesTabEnum.PurchaseOrders}>
              {t(i18n)`Purchase orders`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={PayablesTabEnum.Bills}>
            <PayablesTable
              onRowClick={(id) => setInvoiceIdDialog({ open: true, invoiceId: id })}
              onPay={handlePay}
              onPayUS={onPayUS}
              openFileInput={openFileInput}
              setIsCreateInvoiceDialogOpen={setIsCreateInvoiceDialogOpen}
            />
          </TabsContent>

          <TabsContent value={PayablesTabEnum.PurchaseOrders}>
            <Suspense fallback={<CircularProgress />}>
              <PurchaseOrdersTable
                onRowClick={(id) => setPurchaseOrderIdDialog({ open: true, purchaseOrderId: id })}
                setIsCreatePurchaseOrderDialogOpen={setIsCreatePurchaseOrderDialogOpen}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      )}
      <FileInput
        aria-label={t(i18n)`Upload payable files`}
        multiple
        onChange={(event) => {
          const files = event.target.files;
          if (files) handleFileUpload(files);
        }}
      />
      <Dialog
        className={className + '-Dialog-PayableDetails'}
        open={invoiceIdDialog.open}
        container={root}
        onClose={closeEditDialog}
        onClosed={closeEditDialog}
        fullScreen
      >
        <PayableDetails
          id={invoiceIdDialog.invoiceId}
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
          enableGLCodes={finalEnableGLCodes}
          onClose={closeEditDialog}
          onSaved={handleSaved}
          onCanceled={handleCanceled}
          onSubmitted={handleSubmitted}
          onRejected={handleRejected}
          onApproved={handleApproved}
          onReopened={handleReopened}
          onDeleted={(payableId) => {
            handleDeleted?.(payableId);
            closeEditDialog();
            toast(t(i18n)`Bill #${payableId} has been deleted`, {
              duration: 5000,
            });
          }}
          onPay={handlePay}
          onPayUS={onPayUS}
        />
      </Dialog>

      <Dialog
        className={className + '-Dialog-CreatePayable'}
        open={isCreateInvoiceDialogOpen}
        container={root}
        onClose={() => setIsCreateInvoiceDialogOpen(false)}
        fullScreen
      >
        <PayableDetails
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
          enableGLCodes={finalEnableGLCodes}
          onClose={() => setIsCreateInvoiceDialogOpen(false)}
          onSaved={handleSaved}
        />
      </Dialog>

      <Dialog
        className={className + '-Dialog-PurchaseOrderDetails'}
        open={purchaseOrderIdDialog.open}
        container={root}
        onClose={closePurchaseOrderDialog}
        onClosed={closePurchaseOrderDialog}
        fullScreen
      >
        <Suspense fallback={<CircularProgress />}>
          <PurchaseOrderDetails
            id={purchaseOrderIdDialog.purchaseOrderId}
            onClose={closePurchaseOrderDialog}
            vendorTypes={
              customerTypes || componentSettings?.counterparts?.customerTypes
            }
          />
        </Suspense>
      </Dialog>

      <Dialog
        className={className + '-Dialog-CreatePurchaseOrder'}
        open={isCreatePurchaseOrderDialogOpen}
        container={root}
        onClose={() => setIsCreatePurchaseOrderDialogOpen(false)}
        fullScreen
      >
        <Suspense fallback={<CircularProgress />}>
          <PurchaseOrderDetails
            onClose={() => setIsCreatePurchaseOrderDialogOpen(false)}
            onSaved={(purchaseOrderId) => {
              setIsCreatePurchaseOrderDialogOpen(false);
              setPurchaseOrderIdDialog({ 
                open: true, 
                purchaseOrderId: purchaseOrderId 
              });
            }}
            vendorTypes={
              customerTypes || componentSettings?.counterparts?.customerTypes
            }
          />
        </Suspense>
      </Dialog>
    </>
  );
};
