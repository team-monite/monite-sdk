import { components } from '@/api';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  Download,
  Eye,
  EyeOff,
  FileCheck,
  Mail,
  MoreVerticalIcon,
  SquarePen,
} from 'lucide-react';

import { useDuplicateInvoice } from '../hooks/useDuplicateInvoice';
import { useGetReceivablePDFById } from '../hooks/useGetReceivablePDFById';
import { useIssueReceivableById } from '../hooks/useIssueReceivableById';
import { RecordManualPaymentModal } from './RecordManualPaymentModal';
import { toast } from 'react-hot-toast';
import { MarkAsUncollectibleModal } from './MarkAsUncollectibleModal';
import { useState } from 'react';
import { InvoiceDeleteModal } from './InvoiceDeleteModal';
import { InvoiceCancelModal } from './InvoiceCancelModal';
import { useIsMobileScreen } from '@/core/hooks/useMediaQuery';

type InvoiceDetailsActionsProps = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  actions: {
    onEditButtonClick: () => void;
    onTemplateSettingsButtonClick: () => void;
    onIssueAndSendButtonClick: () => void;
    onViewPDFButtonClick: () => void;
    onDelete: () => void;
    onDuplicate?: (invoiceId: string) => void;
    onMarkAsUncollectible?: (invoiceId: string) => void;
  };
  isPDFViewerOpen: boolean;
};

export const InvoiceDetailsActions = ({
  invoice,
  actions,
  isPDFViewerOpen,
}: InvoiceDetailsActionsProps) => {
  const { i18n } = useLingui();
  const isMobileScreen = useIsMobileScreen();
  const [markAsUncollectibleModalOpen, setMarkAsUncollectibleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const PERMISSION_ERROR_MESSAGE = t(i18n)`You don't have permission to update this document. Please, contact your system administrator for details.`;

  const { data: isUpdateAllowed, isLoading: isUpdateAllowedLoading } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: invoice?.entity_user_id,
  });

  const { refetch: downloadPdf, isLoading: isDownloadingPdf } = useGetReceivablePDFById(invoice.id, false);

  const { mutate: issueInvoice, isPending: isIssuingInvoice } =
    useIssueReceivableById(invoice.id);
  const { mutate: duplicateInvoice } = useDuplicateInvoice(actions.onDuplicate);
  
  const isDraft = invoice.status === 'draft';
  const isIssued = invoice.status === 'issued';
  const isOverdue = invoice.status === 'overdue';
  const isPartiallyPaid = invoice.status === 'partially_paid';
  const isUncollectible = invoice.status === 'uncollectible';
  const allowRecordPayment = isIssued || isOverdue || isPartiallyPaid;
  const hideSendAndPdfButtons = allowRecordPayment && isMobileScreen;

  const handleDuplicateInvoice = () => {
    duplicateInvoice({
      path: {
        receivable_id: invoice.id,
      },
    });
  };

  const handleDownloadPdf = async () => {
    const pdfLink = await downloadPdf();

    if (pdfLink.data?.file_url) {
      window.open(pdfLink.data.file_url, '_blank');
    }
  };

  const handleButtonClick = (callback: () => void) => {
    if (isUpdateAllowed) {
      callback();
    } else {
      toast.error(PERMISSION_ERROR_MESSAGE);
    }
  };

  return (
    <div className="mtw:flex mtw:items-center mtw:gap-1.5">
      {markAsUncollectibleModalOpen && (
        <MarkAsUncollectibleModal
          invoiceId={invoice?.id ?? ''}
          open={markAsUncollectibleModalOpen}
          onClose={() => setMarkAsUncollectibleModalOpen(false)}
          onMarkAsUncollectible={actions.onMarkAsUncollectible}
        />
      )}

      {deleteModalOpen && (
        <InvoiceDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          invoiceId={invoice?.id ?? ''}
          entityUserId={invoice?.entity_user_id}
          documentId={invoice?.document_id}
          onDelete={actions.onDelete}
        />
      )}

      {cancelModalOpen && (
        <InvoiceCancelModal
          invoiceId={invoice?.id ?? ''}
          open={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
        />
      )}

      {isDraft && (
        <>
          <Button 
            type="button" 
            size="sm" 
            onClick={() => handleButtonClick(actions.onIssueAndSendButtonClick)}
            disabled={isUpdateAllowedLoading}
          >
            {t(i18n)`Issue and send`}
          </Button>
          {!isMobileScreen && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isIssuingInvoice || isUpdateAllowedLoading}
                onClick={() => handleButtonClick(issueInvoice)}
              >
                <FileCheck /> {t(i18n)`Issue`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick(actions.onEditButtonClick)}
                disabled={isUpdateAllowedLoading}
              >
                <SquarePen /> {t(i18n)`Edit`}
              </Button>
            </>
          )}
        </>
      )}
      {allowRecordPayment && (
        <RecordManualPaymentModal invoice={invoice}>
          {({ openModal }) => (
            <Button type="button" size="sm" disabled={isUpdateAllowedLoading} onClick={() => handleButtonClick(openModal)}>
              {t(i18n)`Record payment`}
            </Button>
          )}
        </RecordManualPaymentModal>
      )}
      {!isDraft && !isUncollectible && !hideSendAndPdfButtons && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleButtonClick(actions.onIssueAndSendButtonClick)}
          disabled={isUpdateAllowedLoading}
        >
          <Mail /> {t(i18n)`Send`}
        </Button>
      )}
      {!isDraft && !hideSendAndPdfButtons && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isDownloadingPdf}
          onClick={handleDownloadPdf}
        >
          <Download /> {t(i18n)`PDF`}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm" disabled={isUpdateAllowedLoading}>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isDraft && isMobileScreen && (
            <>
              <DropdownMenuItem disabled={isIssuingInvoice || isUpdateAllowedLoading} onClick={() => handleButtonClick(issueInvoice)}>
                {t(i18n)`Issue`}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isUpdateAllowedLoading} onClick={() => handleButtonClick(actions.onEditButtonClick)}>
                {t(i18n)`Edit`}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => handleButtonClick(handleDuplicateInvoice)}>
            {t(i18n)`Duplicate`}
          </DropdownMenuItem>
          
          {(isDraft || hideSendAndPdfButtons) && (
            <>
              <DropdownMenuItem onClick={() => handleButtonClick(actions.onIssueAndSendButtonClick)}>
                {t(i18n)`Send draft`}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPdf}>
                {t(i18n)`Download draft`}
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem onClick={actions.onTemplateSettingsButtonClick}>
            {t(i18n)`Edit template settings`}
          </DropdownMenuItem>

          {isDraft && (
            <DropdownMenuItem
              onClick={() => setDeleteModalOpen(true)}
              variant="destructive"
            >
              {t(i18n)`Delete`}
            </DropdownMenuItem>
          )}
          
          {(isIssued || isOverdue) && (
            <DropdownMenuItem
              onClick={() => handleButtonClick(() => setCancelModalOpen(true))}
            >
              {t(i18n)`Cancel invoice`}
            </DropdownMenuItem>
          )}

          {isOverdue && (
            <DropdownMenuItem
              onClick={() => handleButtonClick(() => setMarkAsUncollectibleModalOpen(true))}
            >
              {t(i18n)`Mark as uncollectible`}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="secondary"
        className="mtw:ml-auto"
        size="sm"
        onClick={actions.onViewPDFButtonClick}
      >
        {isPDFViewerOpen ? <EyeOff /> : <Eye />} {t(i18n)`PDF view`}
      </Button>
    </div>
  );
};
