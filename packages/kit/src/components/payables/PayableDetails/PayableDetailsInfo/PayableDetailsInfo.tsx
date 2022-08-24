import React from 'react';
import { useTranslation } from 'react-i18next';
import { PayableResponseSchema } from '@monite/js-sdk';
import { Tag } from '@monite/ui';
import { formatDate, getReadableAmount } from 'core/utils';
import {
  FormSection,
  FormTitle,
  StyledInfoLabel,
  StyledInfoRow,
  StyledInfoTable,
  StyledInfoValue,
  StyledScrollContent,
  StyledInfoScroll,
} from '../PayableDetailsStyle';

export type PayablesDetailsInfoProps = {
  payable: PayableResponseSchema;
};

const PayableDetailsInfo = ({ payable }: PayablesDetailsInfoProps) => {
  const { t } = useTranslation();

  return (
    <StyledScrollContent>
      <StyledInfoScroll>
        <FormSection>
          <FormTitle textSize={'bold'}>
            {t('payables:tabPanels.document')}
          </FormTitle>

          <StyledInfoTable>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.suppliersName')}
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
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.invoiceDate')}
              </StyledInfoLabel>
              <StyledInfoValue>{formatDate(payable.issued_at)}</StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.suggestedPaymentDate')}
              </StyledInfoLabel>
              <StyledInfoValue>
                {formatDate(payable?.suggested_payment_term?.date)}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.dueDate')}</StyledInfoLabel>
              <StyledInfoValue>{formatDate(payable?.due_date)}</StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.submittedBy')}
              </StyledInfoLabel>
              <StyledInfoValue>{''}</StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.tags')}</StyledInfoLabel>
              <StyledInfoValue>
                {payable?.tags?.map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))}
              </StyledInfoValue>
            </StyledInfoRow>
          </StyledInfoTable>
        </FormSection>

        <FormSection>
          <FormTitle textSize={'bold'}>
            {t('payables:tabPanels.payment')}
          </FormTitle>
          <StyledInfoTable>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.iban')}</StyledInfoLabel>
              <StyledInfoValue>
                {payable.counterpart_account_id}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.bic')}</StyledInfoLabel>
              <StyledInfoValue>{payable.counterpart_bank_id}</StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {t('payables:details.subtotal')}
              </StyledInfoLabel>
              <StyledInfoValue>
                {payable.subtotal &&
                  payable.currency &&
                  getReadableAmount(payable.subtotal, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>
                {`${payable?.suggested_payment_term?.discount}% ${t(
                  'payables:details.tax'
                )}`}
              </StyledInfoLabel>
              <StyledInfoValue>
                {payable.tax &&
                  payable.currency &&
                  getReadableAmount(payable.tax, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledInfoLabel>{t('payables:details.total')}</StyledInfoLabel>
              <StyledInfoValue textSize={'h3'}>
                {payable.amount &&
                  payable.currency &&
                  getReadableAmount(payable.amount, payable.currency)}
              </StyledInfoValue>
            </StyledInfoRow>
          </StyledInfoTable>
        </FormSection>
      </StyledInfoScroll>
    </StyledScrollContent>
  );
};

export default PayableDetailsInfo;
