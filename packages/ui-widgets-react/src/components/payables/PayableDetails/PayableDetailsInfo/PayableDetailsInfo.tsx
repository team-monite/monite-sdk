import React from 'react';
import { useTranslation } from 'react-i18next';
import { PayableResponseSchema } from '@team-monite/sdk-api';
import { Tag, StyledModalLayoutScrollContent } from '@team-monite/ui-kit-react';
import { formatDate } from 'core/utils';
import useCurrencies from 'core/hooks/useCurrencies';
import useOptionalFields from 'core/hooks/useOptionalFields';
import {
  FormSection,
  FormTitle,
  StyledInfoLabel,
  StyledInfoRow,
  StyledInfoTable,
  StyledInfoValue,
  StyledInfoScroll,
  StyledTags,
} from '../PayableDetailsStyle';

import { OptionalFields } from '../PayableDetails';

export type PayablesDetailsInfoProps = {
  payable: PayableResponseSchema;
  optionalFields?: OptionalFields;
};

// TODO in order to customize style rewrite with one of ui kit components (Card or List)
const PayableDetailsInfo = ({
  payable,
  optionalFields,
}: PayablesDetailsInfoProps) => {
  const { t } = useTranslation();
  const {
    showInvoiceDate,
    showSuggestedPaymentDate,
    showTags,
    showIban,
    showBic,
  } = useOptionalFields<OptionalFields>(optionalFields, {
    showInvoiceDate: true,
    showSuggestedPaymentDate: true,
    showTags: true,
    showIban: true,
    showBic: true,
  });
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <StyledModalLayoutScrollContent>
      <StyledInfoScroll>
        <FormSection>
          <FormTitle textSize={'bold'}>
            {t('payables:tabPanels.document')}
          </FormTitle>

          <StyledInfoTable>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.counterpart')}
              </StyledInfoLabel>
              <StyledInfoValue>
                {payable.counterpart_name && (
                  <Tag>{payable.counterpart_name}</Tag>
                )}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.invoiceNumber')}
              </StyledInfoLabel>
              <StyledInfoValue>{payable.document_id ?? ''}</StyledInfoValue>
            </StyledInfoRow>
            {showInvoiceDate && (
              <StyledInfoRow>
                <StyledInfoLabel>
                  {t('payables:details.invoiceDate')}
                </StyledInfoLabel>
                <StyledInfoValue>
                  {formatDate(payable.issued_at)}
                </StyledInfoValue>
              </StyledInfoRow>
            )}
            {showSuggestedPaymentDate && (
              <StyledInfoRow>
                <StyledInfoLabel>
                  {t('payables:details.suggestedPaymentDate')}
                </StyledInfoLabel>
                <StyledInfoValue>
                  {formatDate(payable?.suggested_payment_term?.date)}
                </StyledInfoValue>
              </StyledInfoRow>
            )}
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.dueDate')}</StyledInfoLabel>
              <StyledInfoValue>{formatDate(payable?.due_date)}</StyledInfoValue>
            </StyledInfoRow>
            {/*<StyledInfoRow>*/}
            {/*  <StyledInfoLabel>*/}
            {/*    {t('payables:details.submittedBy')}*/}
            {/*  </StyledInfoLabel>*/}
            {/*  <StyledInfoValue>{''}</StyledInfoValue>*/}
            {/*</StyledInfoRow>*/}
            {showTags && (
              <StyledInfoRow>
                <StyledInfoLabel>{t('payables:details.tags')}</StyledInfoLabel>
                <StyledTags>
                  {payable?.tags?.map(({ id, name }) => (
                    <Tag key={id}>{name}</Tag>
                  ))}
                </StyledTags>
              </StyledInfoRow>
            )}
          </StyledInfoTable>
        </FormSection>

        <FormSection>
          <FormTitle textSize={'bold'}>
            {t('payables:tabPanels.payment')}
          </FormTitle>
          <StyledInfoTable>
            {showIban && (
              <StyledInfoRow>
                <StyledInfoLabel>{t('payables:details.iban')}</StyledInfoLabel>
                <StyledInfoValue>
                  {payable.counterpart_account_id}
                </StyledInfoValue>
              </StyledInfoRow>
            )}
            {showBic && (
              <StyledInfoRow>
                <StyledInfoLabel>{t('payables:details.bic')}</StyledInfoLabel>
                <StyledInfoValue>{payable.counterpart_bank_id}</StyledInfoValue>
              </StyledInfoRow>
            )}
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.subtotal')}
              </StyledInfoLabel>
              <StyledInfoValue>
                {payable.subtotal &&
                  payable.currency &&
                  formatCurrencyToDisplay(payable.subtotal, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {`${
                  payable?.suggested_payment_term?.discount
                    ? `${payable?.suggested_payment_term?.discount}%`
                    : ''
                } ${t('payables:details.tax')}`}
              </StyledInfoLabel>
              <StyledInfoValue>
                {payable.tax &&
                  payable.currency &&
                  formatCurrencyToDisplay(payable.tax, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.total')}</StyledInfoLabel>
              <StyledInfoValue textSize={'h3'}>
                {payable.amount &&
                  payable.currency &&
                  formatCurrencyToDisplay(payable.amount, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
          </StyledInfoTable>
        </FormSection>
      </StyledInfoScroll>
    </StyledModalLayoutScrollContent>
  );
};

export default PayableDetailsInfo;
