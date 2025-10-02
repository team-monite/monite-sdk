import { useGetPaymentRecords } from '../hooks/useGetPaymentRecords';
import { useGetReceivables } from '../hooks/useGetReceivables';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { twMerge } from 'tailwind-merge';

const SummaryLine = ({
  label,
  value,
  isBold,
}: {
  label: string;
  value: string | null;
  isBold?: boolean;
}) => {
  return (
    <li
      className={twMerge(
        'mtw:w-full mtw:flex mtw:gap-4 mtw:justify-between mtw:text-neutral-50 mtw:font-normal mtw:text-sm mtw:leading-5',
        isBold && 'mtw:font-medium mtw:text-neutral-10'
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </li>
  );
};

type InvoiceDetailsSummaryProps = {
  invoice: components['schemas']['ReceivableResponse'];
};

export const InvoiceDetailsSummary = ({
  invoice,
}: InvoiceDetailsSummaryProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { locale } = useMoniteContext();
  const { data: paymentRecords } = useGetPaymentRecords(invoice?.id);

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

  const isPaid = invoice?.status === 'paid';
  const isPartiallyPaid = invoice?.status === 'partially_paid';
  const isCanceled = invoice?.status === 'canceled';
  const shouldShowExtraPaymentDetails = isPaid || isPartiallyPaid || isCanceled;

  return (
    <ul className="mtw:w-full mtw:flex mtw:flex-col mtw:gap-2">
      <SummaryLine
        label={t(i18n)`Subtotal`}
        value={formatCurrencyToDisplay(
          invoice?.subtotal ?? 0,
          invoice?.currency
        )}
      />

      <li className="mtw:flex mtw:flex-col mtw:gap-1">
        {invoice?.total_vat_amounts?.map((vatRate) => {
          return (
            <div
              key={vatRate?.id}
              className="mtw:w-full mtw:flex mtw:gap-4 mtw:justify-between mtw:text-neutral-50 mtw:font-normal mtw:text-sm mtw:leading-5"
            >
              <span>{t(i18n)`Total tax (${rateMinorToMajor(
                vatRate?.value
              )}%)`}</span>
              <span>
                {formatCurrencyToDisplay(
                  vatRate?.amount ?? 0,
                  invoice?.currency
                )}
              </span>
            </div>
          );
        })}
      </li>

      <SummaryLine
        label={t(i18n)`Total (${invoice?.currency})`}
        value={formatCurrencyToDisplay(
          invoice?.total_amount ?? 0,
          invoice?.currency
        )}
        isBold
      />

      {shouldShowExtraPaymentDetails && (
        <>
          {paymentRecords?.data?.map((paymentRecord) => {
            return (
              <SummaryLine
                key={paymentRecord?.id}
                label={
                  paymentRecord?.paid_at
                    ? t(
                        i18n
                      )`Amount paid on ${i18n.date(paymentRecord?.paid_at, locale.dateTimeFormat)}`
                    : t(i18n)`Amount paid`
                }
                value={formatCurrencyToDisplay(
                  paymentRecord?.amount ?? 0,
                  invoice?.currency
                )}
              />
            );
          })}

          {creditNoteQuery?.data?.map((creditNote) => {
            return (
              <SummaryLine
                key={creditNote?.id}
                label={
                  creditNote?.issue_date
                    ? t(
                        i18n
                      )`Credit applied on ${i18n.date(creditNote?.issue_date, locale.dateTimeFormat)}`
                    : t(i18n)`Credit applied`
                }
                value={formatCurrencyToDisplay(
                  creditNote?.total_amount ?? 0,
                  invoice?.currency
                )}
              />
            );
          })}

          <SummaryLine
            label={t(i18n)`Amount due (${invoice?.currency})`}
            value={formatCurrencyToDisplay(
              invoice?.amount_due ?? 0,
              invoice?.currency
            )}
            isBold
          />
        </>
      )}
    </ul>
  );
};
