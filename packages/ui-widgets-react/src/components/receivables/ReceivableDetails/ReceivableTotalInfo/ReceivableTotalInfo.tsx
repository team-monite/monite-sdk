import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceivableResponse } from '@team-monite/sdk-api';
import { getReadableAmount } from 'core/utils';
import {
  Title,
  StyledContent,
  StyledInfoTable,
  StyledInfoRow,
  StyledInfoLabel,
  StyledInfoValue,
} from '../ReceivableDetailsStyle';

export type PayablesDetailsInfoProps = {
  receivable: ReceivableResponse;
};

const ReceivableTotalInfo = ({ receivable }: PayablesDetailsInfoProps) => {
  const { t } = useTranslation();
  const { currency, total_amount, total_vat_amount } = receivable;

  return (
    <StyledContent>
      <Title textSize={'bold'}>{t('receivables:columns.total')}</Title>
      <StyledInfoTable>
        <StyledInfoRow>
          <StyledInfoLabel>{t('receivables:subtotal')}</StyledInfoLabel>
          <StyledInfoValue>
            {currency &&
              total_vat_amount &&
              total_amount &&
              getReadableAmount(total_amount - total_vat_amount, currency)}
          </StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoLabel>{t('receivables:vat')}</StyledInfoLabel>
          <StyledInfoValue>
            {currency &&
              total_vat_amount &&
              getReadableAmount(total_vat_amount, currency)}
          </StyledInfoValue>
        </StyledInfoRow>
        <StyledInfoRow>
          <StyledInfoLabel>{t('receivables:total')}</StyledInfoLabel>
          <StyledInfoValue textSize={'h3'}>
            {currency &&
              total_amount &&
              getReadableAmount(total_amount, currency)}
          </StyledInfoValue>
        </StyledInfoRow>
      </StyledInfoTable>
    </StyledContent>
  );
};

export default ReceivableTotalInfo;
