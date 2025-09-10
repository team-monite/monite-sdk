import { components } from '@/api';
import { FinanceInvoice } from '@/components/financing';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useGetReceivables } from '@/components/receivables/hooks/useGetReceivables';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/components/accordion';
import { Badge } from '@/ui/components/badge';
import { Card, CardContent } from '@/ui/components/card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { File } from 'lucide-react';

import { getTypeLabel } from '../utils';
import { InvoiceDetailsOverviewReminders } from './InvoiceDetailsOverviewReminders';
import { InvoiceStatusChip } from './InvoiceStatusChip';
import { InvoiceDetailsOverviewRecurrenceSection } from './InvoiceDetailsOverviewRecurrenceSection';
import { InvoiceDetailsInfoBlock } from './InvoiceDetailsInfoBlock';

type DocumentCardProps = {
  documentId: string;
  issueDate: string;
  totalAmount: number;
  currency: string;
  status: components['schemas']['ReceivablesStatusEnum'];
  type: components['schemas']['ReceivableType'];
};

const DocumentCard = ({
  documentId,
  issueDate,
  totalAmount,
  currency,
  status,
  type,
}: DocumentCardProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Card className="mtw:py-3 mtw:px-4 mtw:border-border">
      <CardContent className="mtw:flex mtw:items-center mtw:gap-2 mtw:px-0">
        <div className="mtw:flex mtw:items-center mtw:gap-3 mtw:flex-1">
          <File />
          <div className="mtw:flex mtw:flex-col mtw:gap-0.5">
            <h3 className="mtw:text-neutral-10 mtw:text-sm mtw:font-normal mtw:leading-5">
              {getTypeLabel(i18n, type)} {documentId}
            </h3>
            <p className="mtw:text-neutral-50 mtw:text-sm mtw:font-normal mtw:leading-5">
              {formatCurrencyToDisplay(totalAmount, currency)} •{' '}
              {t(i18n)`${status === 'draft' ? 'Created' : 'Issued'}`}{' '}
              {i18n.date(issueDate, locale.dateFormat)}
            </p>
          </div>
        </div>

        <InvoiceStatusChip status={status} />
      </CardContent>
    </Card>
  );
};

type InvoiceDetailsTabOverviewProps = {
  invoice?: components['schemas']['ReceivableResponse'];
  recurrence?: components['schemas']['RecurrenceResponse'];
  handleTabChange: (value: string) => void;
  openInvoiceDetails?: (invoiceId: string) => void;
};

export const InvoiceDetailsTabOverview = ({
  invoice,
  recurrence,
  handleTabChange,
  openInvoiceDetails,
}: InvoiceDetailsTabOverviewProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const isRecurringInvoice = invoice?.status === 'recurring';

  const creditNoteIds =
    invoice?.type === 'invoice'
      ? invoice?.related_documents?.credit_note_ids
      : undefined;

  const { data: creditNoteQuery } = useGetReceivables(
    {
      id__in: creditNoteIds,
      type: 'credit_note',
    },
    Boolean(creditNoteIds?.length)
  );

  if (invoice?.type !== 'invoice') {
    return null;
  }

  return (
    <>
      <div className="mtw:grid mtw:grid-cols-2 mtw:gap-4">
        <InvoiceDetailsInfoBlock
          label={t(i18n)`Customer`}
          value={invoice?.counterpart_name ?? '-'}
        />

        {recurrence && (
          <>
            <InvoiceDetailsInfoBlock
              label={t(i18n)`Payment terms`}
              value={invoice?.payment_terms?.name ?? '-'}
            />

            <InvoiceDetailsInfoBlock
              label={t(i18n)`Created`}
              value={
                recurrence?.created_at
                  ? i18n.date(invoice?.created_at, locale.dateFormat)
                  : '-'
              }
            />
          </>
        )}

        {!recurrence && (
          <>
            <InvoiceDetailsInfoBlock
              label={t(i18n)`Document number`}
              value={invoice?.document_id ?? t(i18n)`INV-auto`}
            />
            <InvoiceDetailsInfoBlock
              label={t(i18n)`Issue date`}
              value={
                invoice?.issue_date
                  ? i18n.date(invoice?.issue_date, locale.dateFormat)
                  : '-'
              }
            />
            <InvoiceDetailsInfoBlock
              label={t(i18n)`Due date`}
              value={
                invoice?.due_date
                  ? i18n.date(invoice?.due_date, locale.dateFormat)
                  : '-'
              }
              status={invoice?.status}
            />
          </>
        )}
        {invoice?.status !== 'draft' && !recurrence && (
          <InvoiceDetailsInfoBlock
            label={t(i18n)`Payment status`}
            value={t(i18n)`${formatCurrencyToDisplay(
              invoice?.amount_paid,
              invoice?.currency
            )} paid / ${formatCurrencyToDisplay(
              invoice?.amount_due,
              invoice?.currency
            )} due`}
          />
        )}
      </div>

      {recurrence && (
        <>
          <div className="mtw:w-full mtw:h-px mtw:bg-border" />

          <InvoiceDetailsOverviewRecurrenceSection 
            recurrence={recurrence} 
            isCreatedFromRecurrence={Boolean(invoice?.recurrence_id && !isRecurringInvoice)}
            openInvoiceDetails={openInvoiceDetails} 
            handleTabChange={handleTabChange} 
          />
        </>
      )}

      <FinanceInvoice invoice={invoice} />

      <Accordion type="multiple" className="mtw:w-full">
        <AccordionItem
          value="item-1"
          disabled={!creditNoteQuery?.data?.length}
          className="mtw:border-border"
        >
          <AccordionTrigger className="mtw:hover:no-underline mtw:group">
            <span className="mtw:flex mtw:items-center mtw:gap-3">
              <span className="mtw:group-hover:underline">
                {t(i18n)`Linked documents`}
              </span>

              {creditNoteQuery?.data?.length &&
                creditNoteQuery?.data?.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="mtw:h-5 mtw:min-w-5 mtw:rounded-full mtw:px-1 mtw:tabular-nums"
                  >
                    {creditNoteQuery?.data?.length}
                  </Badge>
                )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mtw:flex mtw:flex-col mtw:gap-2">
            {creditNoteQuery?.data?.map((creditNote) => (
              <DocumentCard
                key={creditNote.id}
                type={creditNote?.type}
                documentId={creditNote?.document_id ?? ''}
                issueDate={
                  creditNote?.status === 'draft'
                    ? creditNote?.created_at ?? ''
                    : creditNote?.issue_date ?? ''
                }
                totalAmount={creditNote?.total_amount ?? 0}
                currency={creditNote?.currency}
                status={creditNote?.status}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="mtw:border-border"
          disabled={
            !invoice?.payment_reminder_id && !invoice?.overdue_reminder_id
          }
        >
          <InvoiceDetailsOverviewReminders
            paymentReminderId={invoice?.payment_reminder_id}
            overdueReminderId={invoice?.overdue_reminder_id}
            invoiceId={invoice?.id}
            counterpartId={invoice?.counterpart_id}
          />
        </AccordionItem>
      </Accordion>
    </>
  );
};
