import { INVOICE_DOCUMENT_AUTO_ID } from '../consts';
import { InvoiceRecurrenceIterationStatusChip } from './InvoiceRecurrenceIterationStatusChip';
import { InvoiceStatusChip } from './InvoiceStatusChip';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useGetReceivableById } from '@/core/queries/useGetReceivableById';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { twMerge } from 'tailwind-merge';

type IterationInvoiceProps = {
  iteration: components['schemas']['RecurrenceIteration'];
  invoice: components['schemas']['ReceivableResponse'];
  i18n: I18n;
  onRowClick?: (invoiceId: string) => void;
};

const IterationInvoice = ({
  iteration,
  invoice,
  i18n,
  onRowClick,
}: IterationInvoiceProps) => {
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { data: iterationInvoice } = useGetReceivableById(
    iteration?.issued_invoice_id ?? '',
    Boolean(iteration?.issued_invoice_id)
  );
  const enableRowClick = Boolean(iterationInvoice);

  return (
    <tr
      className={twMerge(
        'mtw:border-t mtw:border-border',
        enableRowClick && 'mtw:hover:cursor-pointer'
      )}
      {...(enableRowClick &&
        onRowClick && {
          onClick: () => onRowClick(iterationInvoice?.id ?? ''),
        })}
    >
      <td className="mtw:text-left mtw:h-9 mtw:py-2 mtw:pr-2 mtw:text-sm mtw:leading-5 mtw:font-normal">
        {iteration?.issued_invoice_id
          ? iterationInvoice?.document_id
          : INVOICE_DOCUMENT_AUTO_ID}
      </td>
      <td className="mtw:text-left mtw:h-9 mtw:py-2 mtw:px-2">
        {iterationInvoice ? (
          <InvoiceStatusChip status={iterationInvoice?.status} />
        ) : (
          <InvoiceRecurrenceIterationStatusChip status={iteration.status} />
        )}
      </td>
      <td className="mtw:text-left mtw:h-9 mtw:py-2 mtw:px-2 mtw:text-sm mtw:leading-5 mtw:font-normal">
        {i18n.date(iteration?.issue_at, locale.dateFormat)}
      </td>
      <td className="mtw:text-right mtw:h-9 mtw:py-2 mtw:pl-2 mtw:text-sm mtw:leading-5 mtw:font-normal">
        {iterationInvoice ? (
          <>
            {formatCurrencyToDisplay(
              iterationInvoice?.total_amount,
              iterationInvoice?.currency
            )}
          </>
        ) : (
          <>
            {formatCurrencyToDisplay(invoice?.total_amount, invoice?.currency)}
          </>
        )}
      </td>
    </tr>
  );
};

type InvoiceDetailsTabScheduledInvoicesProps = {
  invoice: components['schemas']['ReceivableResponse'];
  recurrence: components['schemas']['RecurrenceResponse'];
  openInvoiceDetails?: (invoiceId: string) => void;
};

export const InvoiceDetailsTabScheduledInvoices = ({
  invoice,
  recurrence,
  openInvoiceDetails,
}: InvoiceDetailsTabScheduledInvoicesProps) => {
  const { i18n } = useLingui();

  return (
    <table>
      <thead>
        <tr>
          <th className="mtw:text-left mtw:h-10 mtw:pr-2 mtw:text-sm mtw:font-medium mtw:leading-5">{t(
            i18n
          )`Invoice number`}</th>
          <th className="mtw:text-left mtw:h-10 mtw:px-2 mtw:text-sm mtw:font-medium mtw:leading-5">{t(
            i18n
          )`Status`}</th>
          <th className="mtw:text-left mtw:h-10 mtw:px-2 mtw:text-sm mtw:font-medium mtw:leading-5">{t(
            i18n
          )`Date`}</th>
          <th className="mtw:text-right mtw:h-10 mtw:pl-2 mtw:text-sm mtw:font-medium mtw:leading-5">{t(
            i18n
          )`Amount`}</th>
        </tr>
      </thead>
      <tbody>
        {recurrence?.iterations?.map((iteration, index) => {
          return (
            <IterationInvoice
              key={t(i18n)`iteration-${iteration?.iteration}-${index}`}
              iteration={iteration}
              invoice={invoice}
              i18n={i18n}
              onRowClick={openInvoiceDetails}
            />
          );
        })}
      </tbody>
    </table>
  );
};
