import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PayableStateEnum } from '@monite/js-sdk';

import {
  Button,
  Text,
  IconButton,
  ModalLayout,
  UMultiply,
  Header,
  Tag,
  TagColorType,
} from '@monite/ui';

import PdfViewer from '../../payment/PdfViewer/PdfViewer';

import PayableDetailsForm, {
  PayablesDetailsFormProps,
} from './PayableDetailsForm';

import {
  StyledContent,
  StyledHeaderActions,
  StyledHeaderContent,
  StyledSection,
} from './PayableDetailsStyle';

export interface PayablesDetailsProps extends PayablesDetailsFormProps {
  onClose: () => void;
  isLoading: boolean;
  onPay: PayablesDetailsFormProps['onSubmit'];
  onSave: PayablesDetailsFormProps['onSubmit'];
}

const payableStatus: Partial<Record<PayableStateEnum, TagColorType>> = {
  [PayableStateEnum.NEW]: 'draft',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'pending',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'pending',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'warning',
  [PayableStateEnum.REJECTED]: 'warning',
};

const PayableDetails = ({
  onSubmit,
  payable,
  tags,
  counterparts,
  onClose,
}: PayablesDetailsProps) => {
  const { t } = useTranslation();
  const [isEdit] = useState<boolean>(true);
  const formRef = useRef<HTMLFormElement>(null);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
  }, [formRef]);

  return (
    <ModalLayout
      fullScreen
      header={
        <Header
          leftBtn={
            <IconButton onClick={onClose} color={'black'}>
              <UMultiply size={18} />
            </IconButton>
          }
          actions={
            <StyledHeaderActions>
              <Button onClick={submitForm} color={'secondary'}>
                {t('common:save')}
              </Button>
              {payable.status === PayableStateEnum.NEW && (
                <Button onClick={submitForm}>{t('common:submit')}</Button>
              )}
              {payable.status === PayableStateEnum.WAITING_TO_BE_PAID && (
                <Button onClick={submitForm}>{t('common:pay')}</Button>
              )}
            </StyledHeaderActions>
          }
        >
          <StyledHeaderContent>
            <Text textSize={'h3'}>{payable.counterpart_name}</Text>
            <Tag color={payableStatus[payable.status]}>
              {t(`payables:status.${payable.status}`)}
            </Tag>
          </StyledHeaderContent>
        </Header>
      }
    >
      <StyledContent>
        <StyledSection>
          {!!payable.file && <PdfViewer file={payable.file.url} />}
        </StyledSection>
        <StyledSection sx={{ flexGrow: 1 }}>
          {isEdit && (
            <PayableDetailsForm
              ref={formRef}
              tags={tags}
              counterparts={counterparts}
              onSubmit={onSubmit}
              payable={payable}
            />
          )}
        </StyledSection>
      </StyledContent>
    </ModalLayout>
  );
};

export default PayableDetails;
