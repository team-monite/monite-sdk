import { usePurchaseOrderById } from '../hooks/usePurchaseOrderById';
import {
  DeliveryMethod,
  ExistingPurchaseOrderDetailsView,
  useExistingPurchaseOrderDetails,
} from './useExistingPurchaseOrderDetails';
import { components } from '@/api';
import { useDialog } from '@/components';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { EditPurchaseOrderDetails } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/EditPurchaseOrderDetails';
import { EmailPurchaseOrderDetails } from '@/components/payables/PurchaseOrders/EmailPurchaseOrderDetails';
import { Overview } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/Overview';
import { PurchaseOrderDeleteModal } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/PurchaseOrderDeleteModal';
import { PurchaseOrderPDFViewer } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/PurchaseOrderPDFViewer';
import { SubmitPurchaseOrder } from '@/components/payables/PurchaseOrders/ExistingPurchaseOrderDetails/components/SubmitPurchaseOrder';
import { PurchaseOrderStatusChip } from '@/components/payables/PurchaseOrders/PurchaseOrderStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { X, Trash2, Download, ChevronRight, Mail, MoreVertical } from 'lucide-react';
import {
  Alert,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import { useState, useTransition } from 'react';
import { Button } from '@/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/components/dropdown-menu';

enum PurchaseOrderDetailsPresentation {
  Overview = 'overview',
  Email = 'email',
}

export interface ExistingPurchaseOrderDetailsProps {
  /** Purchase Order ID */
  id: string;
  /** Callback fired when the purchase order is updated */
  onUpdate?: (
    purchaseOrderId: string,
    purchaseOrder: components['schemas']['PurchaseOrderResponseSchema']
  ) => void;
  /** Callback fired when the purchase order is deleted */
  onDelete?: (purchaseOrderId: string) => void;
  /** Callback fired when email is sent */
  onSendEmail?: (purchaseOrderId: string) => void;
}

export const ExistingPurchaseOrderDetails = (
  props: ExistingPurchaseOrderDetailsProps
) => (
  <MoniteScopedProviders>
    <ExistingPurchaseOrderDetailsBase {...props} />
  </MoniteScopedProviders>
);

const ExistingPurchaseOrderDetailsBase = (
  props: ExistingPurchaseOrderDetailsProps
) => {
  const { i18n } = useLingui();

  const [presentation, setPresentation] =
    useState<PurchaseOrderDetailsPresentation>(
      PurchaseOrderDetailsPresentation.Overview
    );
    
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.Email
  );
  const dialogContext = useDialog();
  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } =
    usePurchaseOrderById(props.id);

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'payables_purchase_order',
    action: 'update',
    entityUserId: purchaseOrder?.created_by_user_id,
  });

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  const { loading, buttons, callbacks, view } = useExistingPurchaseOrderDetails(
    {
      purchaseOrderId: props.id,
      purchaseOrder,
      deliveryMethod,
    }
  );

  const [isViewChanging, startViewChange] = useTransition();

  if (isPurchaseOrderLoading || isViewChanging) {
    return <LoadingPage />;
  }

  if (!purchaseOrder) {
    return (
      <NotFound
        title={t(i18n)`Purchase order not found`}
        description={t(
          i18n
        )`There is no purchase order by provided id: ${props.id}`}
      />
    );
  }

  if (view === ExistingPurchaseOrderDetailsView.Edit) {
    return (
      <EditPurchaseOrderDetails
        purchaseOrder={purchaseOrder}
        onUpdated={(updatedPurchaseOrder) => {
          startViewChange(callbacks.handleChangeViewPurchaseOrder);
          props.onUpdate?.(updatedPurchaseOrder.id, updatedPurchaseOrder);
        }}
        onCancel={() =>
          startViewChange(callbacks.handleChangeViewPurchaseOrder)
        }
      />
    );
  }

  const documentId = purchaseOrder.document_id ?? t(i18n)`PO-auto`;

  if (presentation === PurchaseOrderDetailsPresentation.Email) {
    return (
      <EmailPurchaseOrderDetails
        purchaseOrderId={purchaseOrder.id}
        isOpen={true}
        onClose={() => {
          setPresentation(PurchaseOrderDetailsPresentation.Overview);
        }}
        mode={purchaseOrder.status === 'draft' ? 'issue_and_send' : 'send'}
      />
    );
  }

  const className = 'Monite-ExistingPurchaseOrderDetails';

  return (
    <>
      <PurchaseOrderDeleteModal
        id={props.id}
        open={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
        }}
        onDelete={props.onDelete}
      />

      <DialogTitle className={className + '-Title'}>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {dialogContext && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={dialogContext?.onClose}
                    aria-label="close"
                    disabled={loading}
                  >
                    <X />
                  </IconButton>
                )}

                <h3 className="mtw:text-[28px] mtw:leading-[34px] mtw:font-semibold">
                  {t(
                    i18n
                  )`Purchase order ${documentId} to ${getCounterpartName(purchaseOrder.counterpart) || t(i18n)`Vendor`}`}
                </h3>
                <PurchaseOrderStatusChip status={purchaseOrder.status} />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
                {buttons.isDeleteButtonVisible && (
                  <Button
                    variant="ghost"
                    className="mtw:text-red-600 hover:mtw:text-red-700"
                    onClick={() => setDeleteModalOpened(true)}
                    disabled={buttons.isDeleteButtonDisabled}
                  >{t(i18n)`Delete`}</Button>
                )}
                {buttons.isEditButtonVisible && (
                  <Button
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault();
                      startViewChange(callbacks.handleChangeViewPurchaseOrder);
                    }}
                    disabled={loading}
                  >{t(i18n)`Edit`}</Button>
                )}
                {buttons.isMoreButtonVisible && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" disabled={loading}>
                        {t(i18n)`More`}
                        <MoreVertical className="mtw:ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {purchaseOrder.status === 'draft' && (
                        <>
                          {purchaseOrder.file_url && (
                            <DropdownMenuItem
                              onClick={() => {
                                callbacks.handleDownloadPDF();
                              }}
                            >
                              <Download size={16} />
                              <span className="mtw:ml-2">{t(i18n)`Download PDF`}</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteModalOpened(true);
                            }}
                            disabled={buttons.isDeleteButtonDisabled}
                          >
                            <Trash2 size={16} />
                            <span className="mtw:ml-2">{t(i18n)`Delete`}</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      {purchaseOrder.status === 'issued' && (
                        <DropdownMenuItem
                          onClick={() => {
                            setPresentation(
                              PurchaseOrderDetailsPresentation.Email
                            );
                          }}
                        >
                          <Mail size={16} />
                          <span className="mtw:ml-2">{t(i18n)`Send email`}</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {buttons.isDownloadPDFButtonVisible && (
                  <Button
                    variant="outline"
                    onClick={callbacks.handleDownloadPDF}
                    disabled={buttons.isDownloadPDFButtonDisabled}
                  >
                    {buttons.isDownloadPDFButtonDisabled ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Download size={16} />
                    )}
                    <span className="mtw:ml-2">{t(i18n)`Download PDF`}</span>
                  </Button>
                )}
                {buttons.isComposeEmailButtonVisible && (
                  <Button
                    variant="default"
                    onClick={(event) => {
                      event.preventDefault();
                      setPresentation(PurchaseOrderDetailsPresentation.Email);
                    }}
                    disabled={loading}
                  >
                    {t(i18n)`Compose email`}
                    <ChevronRight className="mtw:ml-2" />
                  </Button>
                )}
                {buttons.isIssueButtonVisible && (
                  <Button
                    variant="default"
                    onClick={callbacks.handleIssueOnly}
                    disabled={loading}
                  >{t(i18n)`Issue`}</Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent
        className={className + '-Content'}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid container columnSpacing={4} height="100%">
          <Grid item container xs={6} height="100%">
            <PurchaseOrderPDFViewer purchaseOrderId={props.id} />
          </Grid>
          <Grid
            item
            xs={6}
            flexDirection="column"
            height="100%"
            overflow="auto"
          >
            <Stack spacing={4}>
              {!isUpdateAllowed ? (
                <Alert severity="info">{t(
                  i18n
                )`You don't have permission to issue this document. Please, contact your system administrator for details.`}</Alert>
              ) : (
                (buttons.isIssueButtonVisible ||
                  buttons.isComposeEmailButtonVisible) && (
                  <SubmitPurchaseOrder
                    deliveryMethod={deliveryMethod}
                    onDeliveryMethodChanged={setDeliveryMethod}
                    disabled={loading}
                  />
                )
              )}
              <Overview purchaseOrder={purchaseOrder} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};
