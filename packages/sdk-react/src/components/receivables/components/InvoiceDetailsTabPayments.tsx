import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Button } from '@/ui/components/button';
import { Card, CardContent } from '@/ui/components/card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useGetPaymentRecords } from '../hooks';
import { RecordManualPaymentModal } from './RecordManualPaymentModal';
import { useEntityUserById } from '@/core/queries';
import { CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/ui/loading';
import { getPaymentMethodName, PaymentMethod } from '../utils';

type InvoiceDetailsTabPaymentsProps = {
  invoice?: components['schemas']['ReceivableResponse'];
};

type PaymentCardProps = {
  issueDate?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  isExternal: boolean;
  entityUserId: string;
};

const PaymentCard = ({
  issueDate,
  totalAmount,
  currency,
  paymentMethod,
  isExternal,
  entityUserId,
}: PaymentCardProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { data: entityUser } = useEntityUserById(entityUserId);

  const getPayedByText = () => {
    if (!isExternal) {
      return getPaymentMethodName(paymentMethod, i18n);
    }

    if (!entityUser) {
      return t(i18n)`Manually recorded`;
    }

    return `${t(i18n)`Recorded by`} ${`${entityUser?.first_name ?? ''} ${
      entityUser?.last_name ?? ''
    }`}`;
  }

  return (
    <Card className="mtw:py-3 mtw:px-4 mtw:border-border">
      <CardContent className="mtw:flex mtw:items-center mtw:gap-4 mtw:px-0">
        <div className="mtw:flex mtw:flex-col mtw:gap-0.5 mtw:flex-1">
          <span className="mtw:font-medium mtw:text-sm mtw:leading-5 mtw:text-neutral-10">
            {t(i18n)`Payment received`}
          </span>
          <span className="mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-neutral-50">
            {getPayedByText()} {issueDate && `• ${i18n.date(issueDate, locale.dateFormat)}`}
          </span>
        </div>

        <div className="mtw:flex mtw:flex-col mtw:gap-0.5">
          <span className="mtw:font-medium mtw:text-sm mtw:text-right mtw:leading-5 mtw:text-neutral-10">
            {formatCurrencyToDisplay(totalAmount, currency)}
          </span>
          <span className="mtw:text-sm mtw:font-normal mtw:inline-flex mtw:items-center mtw:gap-1 mtw:leading-5 mtw:text-green-500">
            {t(i18n)`Settled`}
            <CheckCircle className="mtw:text-inherit mtw:w-3.5 mtw:h-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const InvoiceDetailsTabPayments = ({
  invoice,
}: InvoiceDetailsTabPaymentsProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { data: paymentRecords, isLoading: isLoadingPaymentRecords } = useGetPaymentRecords(invoice?.id);

  const isUncollectible = invoice?.status === 'uncollectible';
  const isIssued = invoice?.status === 'issued';
  const isOverdue = invoice?.status === 'overdue';
  const isPartiallyPaid = invoice?.status === 'partially_paid';
  const isPaid = invoice?.status === 'paid';

  const shouldShowRecordPaymentButton =
    isIssued ||
    isOverdue ||
    isPartiallyPaid;

  const shouldShowAmountPaidAndAmountDue = 
    isIssued || 
    isOverdue || 
    isPartiallyPaid || 
    isPaid || 
    (isUncollectible && paymentRecords?.data && paymentRecords?.data?.length > 0);

  function getEmptyListMessage() {
    switch (invoice?.status) {
      case 'draft':
        return t(i18n)`Issue invoice to make a payment record.`

      case 'canceled':
        return t(i18n)`Invoice was cancelled and won't be paid.`

      case 'uncollectible':
        return t(i18n)`Invoice was marked as uncollectible.`

      default:
        return t(i18n)`You can record a payment if you've already received it.`
    }
  }

  if (invoice?.type !== 'invoice') {
    return null;
  }

  if (isLoadingPaymentRecords) {
    return (
      <div className="mtw:flex mtw:justify-center mtw:items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="mtw:flex mtw:flex-col mtw:gap-4">
        <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
          {t(i18n)`Payments history`}
        </h2>

        <div className="mtw:flex mtw:flex-col mtw:gap-3">
          {paymentRecords?.data && paymentRecords?.data?.length > 0 ? (
            <>
              {paymentRecords?.data?.map((paymentRecord) => {
                return (
                  <PaymentCard
                    key={paymentRecord?.id}
                    issueDate={paymentRecord?.paid_at}
                    totalAmount={paymentRecord?.amount}
                    currency={paymentRecord?.currency}
                    paymentMethod={(paymentRecord?.payment_method ?? '') as PaymentMethod}
                    isExternal={paymentRecord?.is_external}
                    entityUserId={paymentRecord?.entity_user_id ?? ''}
                  />
                )
              })}
            </>
          ) : (
            <p className="mtw:text-sm mtw:text-neutral-50 mtw:font-normal mtw:leading-5">
              {t(i18n)`No payments have been received for this invoice.`}
              <br />
              {getEmptyListMessage()}
            </p>
          )}

          {shouldShowRecordPaymentButton && (
            <RecordManualPaymentModal invoice={invoice}>
              {({ openModal }) => (
                <Button size="sm" className="mtw:w-fit" onClick={openModal}>
                  {t(i18n)`Record payment`}
                </Button>
              )}
            </RecordManualPaymentModal>
          )}

          {shouldShowAmountPaidAndAmountDue && (
            <div className="mtw:w-full mtw:h-px mtw:bg-border" />
          )}
        </div>

        {shouldShowAmountPaidAndAmountDue && (
          <div className="mtw:flex mtw:justify-between mtw:gap-8">
            <div className="mtw:flex mtw:flex-col mtw:font-medium mtw:text-neutral-10">
              <span className="mtw:text-sm mtw:leading-5">
                {t(i18n)`Amount due`}
              </span>
              <span className="mtw:text-base mtw:leading-6">
                {formatCurrencyToDisplay(invoice?.amount_due, invoice?.currency)}
              </span>
            </div>

            <div className="mtw:flex mtw:flex-col mtw:font-medium mtw:text-neutral-10">
              <span className="mtw:text-sm mtw:leading-5 mtw:text-right">
                {t(i18n)`Amount paid`}
              </span>
              <span className="mtw:text-base mtw:leading-6 mtw:text-right">
                {formatCurrencyToDisplay(invoice?.amount_paid, invoice?.currency)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
