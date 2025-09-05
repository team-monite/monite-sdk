import { EditInvoiceDetails } from '../InvoiceDetails/ExistingInvoiceDetails/components/EditInvoiceDetails';
import { EmailInvoiceDetails } from '../InvoiceDetails/ExistingInvoiceDetails/components/EmailInvoiceDetails';
import { InvoiceDetailsActions } from './InvoiceDetailsActions';
import { InvoiceDetailsTabDetails } from './InvoiceDetailsTabDetails';
import { InvoiceDetailsTabOverview } from './InvoiceDetailsTabOverview';
import { InvoiceDetailsTabPayments } from './InvoiceDetailsTabPayments';
import { InvoicePDFViewer } from './InvoicePDFViewer';
import { InvoiceStatusChip } from './InvoiceStatusChip';
import { components } from '@/api';
import { TemplateSettings } from '@/components/templateSettings';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  useComponentSettings,
  useCurrencies,
  useIsLargeDesktopScreen,
} from '@/core/hooks';
import { useGetReceivableById } from '@/core/queries/useGetReceivableById';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction/AccessRestriction';
import { DialogTitle } from '@/ui/components/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/ui/components/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/tabs';
import { LoadingSpinner } from '@/ui/loading';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo, useState } from 'react';

export interface InvoiceDetailsProps {
  open: boolean;
  onCloseInvoiceDetails: () => void;
  invoiceId: string;
  onDuplicate?: (invoiceId: string) => void;
  onMarkAsUncollectible?: (invoiceId: string) => void;
}

export const InvoiceDetails = (props: InvoiceDetailsProps) => (
  <MoniteScopedProviders>
    <InvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const InvoiceDetailsBase = ({
  open,
  onCloseInvoiceDetails,
  invoiceId,
  onDuplicate,
  onMarkAsUncollectible,
}: InvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { receivablesCallbacks } = useComponentSettings();
  const isLargeDesktop = useIsLargeDesktopScreen();
  const { data: invoice, isLoading: isLoadingInvoiceDetails } =
    useGetReceivableById(invoiceId, true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'read',
      entityUserId: invoice?.entity_user_id,
    });

  const actions = useMemo(() => {
    return {
      onEditButtonClick: () => setIsEditing(true),
      onTemplateSettingsButtonClick: () => setEditTemplateModalOpen(true),
      onIssueAndSendButtonClick: () => setShowEmail(true),
      onViewPDFButtonClick: () => setShowPDF((prevState) => !prevState),
      onDelete: () => onCloseInvoiceDetails(),
      onDuplicate: onDuplicate,
      onMarkAsUncollectible: onMarkAsUncollectible,
    };
  }, [onDuplicate, onMarkAsUncollectible, onCloseInvoiceDetails]);

  // TODO: This is a workaround until we replace all MUI with shadcn
  // If this is not done, then shadcn's overlay overrides MUI's overlay
  const isSheetOpen =
    open && !isEditing && !editTemplateModalOpen && !showEmail;
  const isPDFOpen =
    showPDF && !isEditing && !editTemplateModalOpen && !showEmail;

  const handleSheetContent = () => {
    if (isLoadingInvoiceDetails || isReadAllowedLoading) {
      return (
        <div className="mtw:flex mtw:w-full mtw:items-center mtw:justify-center mtw:h-full">
          <DialogTitle hidden>{t(i18n)`Loading invoice details`}</DialogTitle>
          <LoadingSpinner />
        </div>
      );
    }

    if (!isReadAllowed) {
      return (
        <div className="mtw:w-3/4 mtw:m-auto">
          <AccessRestriction />
        </div>
      );
    }

    if (!invoice) {
      return (
        <div className="mtw:w-3/4 mtw:m-auto">
          <DialogTitle hidden>{t(i18n)`Invoice not found`}</DialogTitle>
          <NotFound
            title={t(i18n)`Invoice not found`}
            description={t(
              i18n
            )`There is no invoice for the provided id: ${invoiceId}`}
          />
        </div>
      );
    }

    if (invoice.type !== 'invoice') {
      return (
        <div className="mtw:w-3/4 mtw:m-auto">
          <DialogTitle hidden>{t(
            i18n
          )`Receivable type not supported`}</DialogTitle>
          <NotFound
            title={t(i18n)`Receivable type not supported`}
            description={t(
              i18n
            )`Receivable type ${invoice.type} is not supported. Only invoice is supported.`}
          />
        </div>
      );
    }

    return (
      <div className="mtw:flex mtw:flex-col mtw:overflow-y-auto">
        <SheetHeader className="mtw:pl-8 mtw:gap-2 mtw:flex-row">
          <div className="mtw:flex mtw:items-center mtw:gap-2 mtw:flex-1">
            <SheetTitle className="mtw:text-xl mtw:font-semibold mtw:leading-6">
              {t(i18n)`Invoice`}
            </SheetTitle>
            <InvoiceStatusChip status={invoice?.status} />
          </div>

          <SheetDescription hidden>{t(i18n)`Invoice details`}</SheetDescription>
        </SheetHeader>

        <div className="mtw:flex mtw:flex-col mtw:gap-8">
          <section className="mtw:flex mtw:flex-col mtw:gap-5 mtw:px-8">
            <div className="mtw:flex mtw:flex-col">
              <h2 className="mtw:text-[32px] mtw:font-semibold mtw:leading-10">
                {formatCurrencyToDisplay(
                  invoice?.total_amount,
                  invoice?.currency
                )}
              </h2>
              <p className="mtw:text-sm mtw:font-medium mtw:leading-5">
                {t(i18n)`for ${invoice?.counterpart_name}`}
              </p>
            </div>

            <InvoiceDetailsActions
              invoice={invoice}
              actions={actions}
              isPDFViewerOpen={isPDFOpen}
            />
          </section>

          <section className="mtw:border-t mtw:border-neutral-80 mtw:pt-4 mtw:px-8">
            <Tabs defaultValue="overview" className="mtw:gap-8">
              <TabsList className="mtw:w-full">
                <TabsTrigger value="overview">{t(i18n)`Overview`}</TabsTrigger>
                <TabsTrigger value="details">{t(i18n)`Details`}</TabsTrigger>
                <TabsTrigger value="payments">{t(i18n)`Payments`}</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="mtw:flex mtw:flex-col mtw:gap-8"
              >
                <InvoiceDetailsTabOverview invoice={invoice} />
              </TabsContent>
              <TabsContent
                value="details"
                className="mtw:flex mtw:flex-col mtw:gap-8"
              >
                <InvoiceDetailsTabDetails invoice={invoice} />
              </TabsContent>
              <TabsContent
                value="payments"
                className="mtw:flex mtw:flex-col mtw:gap-8"
              >
                <InvoiceDetailsTabPayments invoice={invoice} />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    );
  };

  return (
    <>
      {showEmail && (
        <EmailInvoiceDetails
          invoiceId={invoice?.id ?? ''}
          onClose={() => {
            setShowEmail(false);
          }}
          onSendEmail={receivablesCallbacks?.onInvoiceSent}
          isOpen={showEmail}
        />
      )}

      {editTemplateModalOpen && (
        <TemplateSettings
          isDialog
          isOpen={editTemplateModalOpen}
          handleCloseDialog={() => setEditTemplateModalOpen(false)}
        />
      )}

      {isEditing && invoice && (
        <EditInvoiceDetails
          isOpen={isEditing}
          invoice={invoice as components['schemas']['InvoiceResponsePayload']}
          onUpdated={(updatedReceivable) => {
            setIsEditing(false);
            receivablesCallbacks?.onUpdate?.(
              updatedReceivable.id,
              updatedReceivable
            );
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      <Sheet
        open={isSheetOpen}
        modal={false}
        onOpenChange={() => {
          onCloseInvoiceDetails();
          if (showPDF) setShowPDF(false);
        }}
      >
        <SheetContent className="mtw:gap-0 mtw:pb-12">
          <SheetDescription hidden>{t(i18n)`Invoice details`}</SheetDescription>
          {handleSheetContent()}

          <Sheet open={isPDFOpen} modal={false}>
            <SheetContent
              className="mtw:w-full mtw:flex-row mtw:xl:max-w-[1200px] mtw:xl:z-1299"
              showCloseButton={false}
            >
              <SheetTitle hidden>{t(i18n)`PDF Viewer`}</SheetTitle>
              <SheetDescription hidden>{t(i18n)`PDF Viewer`}</SheetDescription>
              <div className="mtw:w-full mtw:xl:w-1/2 mtw:bg-white">
                <InvoicePDFViewer
                  receivable_id={invoice?.id ?? ''}
                  showCloseButton={!isLargeDesktop}
                  onClose={() => setShowPDF(false)}
                />
              </div>

              <div className="mtw:w-0 mtw:xl:w-1/2" />
            </SheetContent>
          </Sheet>
        </SheetContent>
      </Sheet>
    </>
  );
};
