import { useState, useTransition } from 'react';

import { TemplateSettings } from '@/components';
import {
  InvoiceRecurrenceStatusChip,
  InvoiceStatusChip,
} from '@/components/receivables/components';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { EditInvoiceDetails } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/EditInvoiceDetails';
import { EmailInvoiceDetails } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/EmailInvoiceDetails';
import { InvoiceCancelModal } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoiceCancelModal';
import { InvoiceDeleteModal } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoiceDeleteModal';
import { InvoicePDFViewer } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoicePDFViewer';
import { InvoiceRecurrenceCancelModal } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/InvoiceRecurrenceCancelModal';
import { Overview } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/Overview';
import { SubmitInvoice } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/SubmitInvoice';
import { ExistingReceivableDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { useReceivableById } from '@/core/queries/useReceivables';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/MailOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Alert,
  Button,
  DialogContent,
  Grid,
  Stack,
  CircularProgress,
} from '@mui/material';

import { useRecurrenceByInvoiceId } from './components/ReceivableRecurrence/useInvoiceRecurrence';
import { RecordManualPaymentModal } from './components/TabPanels/PaymentTabPanel/RecordManualPaymentModal';
import {
  DeliveryMethod,
  ExistingInvoiceDetailsView,
  useExistingInvoiceDetails,
} from './useExistingInvoiceDetails';

enum InvoiceDetailsPresentation {
  Overview = 'overview',
  Email = 'email',
}

export const ExistingInvoiceDetails = (
  props: ExistingReceivableDetailsProps
) => (
  <MoniteScopedProviders>
    <ExistingInvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const ExistingInvoiceDetailsBase = (props: ExistingReceivableDetailsProps) => {
  const { i18n } = useLingui();

  const [presentation, setPresentation] = useState<InvoiceDetailsPresentation>(
    InvoiceDetailsPresentation.Overview
  );

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.Email
  );
  const { data: receivable, isLoading: isInvoiceLoading } = useReceivableById(
    props.id
  );

  const { data: recurrence } = useRecurrenceByInvoiceId(props.id);

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: receivable?.entity_user_id,
  });

  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [cancelModalOpened, setCancelModalOpened] = useState<boolean>(false);
  const [editTemplateModalOpen, setEditTemplateModalOpen] =
    useState<boolean>(false);
  const [cancelRecurrenceModalOpened, setCancelRecurrenceModalOpened] =
    useState(false);

  const { loading, buttons, callbacks, view } = useExistingInvoiceDetails({
    receivableId: props.id,
    receivable,
    deliveryMethod,
  });

  const [isViewChanging, startViewChange] = useTransition();

  if (isInvoiceLoading || isViewChanging) {
    return <LoadingPage />;
  }

  if (!receivable) {
    return (
      <NotFound
        title={t(i18n)`Invoice not found`}
        description={t(i18n)`There is no invoice by provided id: ${props.id}`}
      />
    );
  }

  if (receivable.type !== 'invoice') {
    return (
      <NotFound
        title={t(i18n)`Receivable type not supported`}
        description={t(
          i18n
        )`Receivable type ${receivable.type} is not supported. Only invoice is supported.`}
      />
    );
  }

  if (view === ExistingInvoiceDetailsView.Edit) {
    return (
      <EditInvoiceDetails
        invoice={receivable}
        onUpdated={(updatedReceivable) => {
          startViewChange(callbacks.handleChangeViewInvoice);
          props.onUpdate?.(updatedReceivable.id, updatedReceivable);
        }}
        onCancel={() => startViewChange(callbacks.handleChangeViewInvoice)}
      />
    );
  }

  const documentId = receivable.document_id ?? INVOICE_DOCUMENT_AUTO_ID;

  if (presentation === InvoiceDetailsPresentation.Email) {
    return (
      <EmailInvoiceDetails
        invoiceId={props.id}
        onClose={() => {
          setPresentation(InvoiceDetailsPresentation.Overview);
        }}
        onSendEmail={props.onSendEmail}
      />
    );
  }

  const className = 'Monite-ExistingInvoiceDetails';

  const title =
    receivable.status === 'recurring'
      ? t(i18n)`Recurring invoice`
      : t(i18n)`Invoice ${documentId}`;

  const statusElement =
    receivable.status === 'recurring' ? (
      recurrence && (
        <InvoiceRecurrenceStatusChip status={recurrence.status} icon={false} />
      )
    ) : (
      <InvoiceStatusChip status={receivable.status} />
    );

  const actions = (
    <>
      {buttons.isMoreButtonVisible && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="text"
              color="primary"
              disableElevation
              disabled={loading}
              endIcon={<MoreVertIcon />}
            >
              {t(i18n)`More`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setPresentation(InvoiceDetailsPresentation.Email);
              }}
            >
              <EmailIcon fontSize="small" />
              {t(i18n)`Send invoice`}
            </DropdownMenuItem>
            {buttons.isCancelButtonVisible && (
              <DropdownMenuItem
                onClick={(event) => {
                  event.preventDefault();
                  setCancelModalOpened(true);
                }}
                disabled={buttons.isCancelButtonDisabled}
              >
                <CancelIcon fontSize="small" />
                {t(i18n)`Cancel invoice`}
              </DropdownMenuItem>
            )}
            {buttons.isEditTemplateButtonVisible && (
              <DropdownMenuItem
                onClick={(event) => {
                  event.preventDefault();
                  setEditTemplateModalOpen(true);
                }}
              >
                {t(i18n)`Edit template settings`}
              </DropdownMenuItem>
            )}
            {buttons.isDeleteButtonVisible && (
              <DropdownMenuItem
                onClick={() => setDeleteModalOpened(true)}
                disabled={buttons.isDeleteButtonDisabled}
                variant="destructive"
              >
                {t(i18n)`Delete`}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {buttons.isEditButtonVisible && (
        <Button
          variant="outlined"
          color="primary"
          onClick={(event) => {
            event.preventDefault();
            startViewChange(callbacks.handleChangeViewInvoice);
          }}
          disabled={loading}
        >
          {t(i18n)`Edit`}
        </Button>
      )}
      {buttons.isDownloadPDFButtonVisible && (
        <Button
          variant="outlined"
          color="primary"
          onClick={callbacks.handleDownloadPDF}
          disabled={buttons.isDownloadPDFButtonDisabled}
          startIcon={
            buttons.isDownloadPDFButtonDisabled ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {t(i18n)`Download PDF`}
        </Button>
      )}
      <RecordManualPaymentModal invoice={receivable}>
        {({ openModal }) => (
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            disabled={loading}
          >
            {t(i18n)`Record payment`}
          </Button>
        )}
      </RecordManualPaymentModal>
      {buttons.isComposeEmailButtonVisible && (
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => {
            event.preventDefault();
            setPresentation(InvoiceDetailsPresentation.Email);
          }}
          disabled={loading}
          endIcon={<KeyboardArrowRightIcon />}
        >
          {t(i18n)`Compose email`}
        </Button>
      )}
      {buttons.isIssueButtonVisible && (
        <Button
          variant="contained"
          color="primary"
          onClick={callbacks.handleIssueOnly}
          disabled={loading}
        >
          {t(i18n)`Issue`}
        </Button>
      )}
      {receivable.status === 'recurring' && recurrence?.status === 'active' && (
        <Button
          variant="outlined"
          color="error"
          disabled={buttons.isCancelRecurrenceButtonDisabled}
          onClick={(event) => {
            event.preventDefault();
            setCancelRecurrenceModalOpened(true);
          }}
        >
          {t(i18n)`Cancel recurrence`}
        </Button>
      )}
    </>
  );

  return (
    <>
      <InvoiceDeleteModal
        id={props.id}
        open={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
        }}
        onDelete={props.onDelete}
      />

      <InvoiceCancelModal
        invoiceId={props.id}
        open={cancelModalOpened}
        onClose={() => {
          setCancelModalOpened(false);
        }}
      />

      <InvoiceRecurrenceCancelModal
        receivableId={props.id}
        open={cancelRecurrenceModalOpened}
        onClose={() => {
          setCancelRecurrenceModalOpened(false);
        }}
      />

      {editTemplateModalOpen && (
        <TemplateSettings
          isDialog
          isOpen={editTemplateModalOpen}
          handleCloseDialog={() => setEditTemplateModalOpen(false)}
        />
      )}

      <FullScreenModalHeader
        className={className + '-Title'}
        title={title}
        statusElement={statusElement}
        actions={actions}
        closeButtonTooltip={t(i18n)`Close invoice details`}
      />

      <DialogContent
        className={className + '-Content'}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid container columnSpacing={4} height="100%">
          <Grid item container xs={6} height="100%">
            <InvoicePDFViewer receivable_id={props.id} />
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
                )`You don’t have permission to issue this document. Please, contact your system administrator for details.`}</Alert>
              ) : (
                (buttons.isIssueButtonVisible ||
                  buttons.isComposeEmailButtonVisible) && (
                  <SubmitInvoice
                    deliveryMethod={deliveryMethod}
                    onDeliveryMethodChanged={setDeliveryMethod}
                    disabled={loading}
                  />
                )
              )}
              <Overview invoice={receivable} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};
