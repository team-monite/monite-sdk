import React from 'react';
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
  Tabs,
  TabList,
  Tab,
  TabPanel,
  FileViewer,
} from '@monite/ui';

import PayableDetailsForm from './PayableDetailsForm';

import {
  StyledContent,
  StyledHeaderActions,
  StyledHeaderContent,
  StyledScroll,
  StyledScrollContent,
  StyledSection,
} from './PayableDetailsStyle';

import usePayableDetails, { UsePayableDetailsProps } from './usePayableDetails';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
}

const payableStatus: Partial<Record<PayableStateEnum, TagColorType>> = {
  [PayableStateEnum.NEW]: 'draft',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'pending',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'pending',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'warning',
  [PayableStateEnum.REJECTED]: 'warning',
};

const TAB_LIST = ['document', 'payment', 'status', 'history'];

const PayableDetails = ({
  id,
  debug,
  onClose,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onPay,
}: PayablesDetailsProps) => {
  const { t } = useTranslation();
  const {
    payable,
    formRef,
    isEdit,

    permissions: { canPay, canReject, canApprove, canSave, canSubmit },

    actions: {
      onFormSubmit,
      saveInvoice,
      submitInvoice,
      rejectInvoice,
      approveInvoice,
      payInvoice,
    },
  } = usePayableDetails({
    id,
    debug,
    onSubmit,
    onSave,
    onReject,
    onPay,
    onApprove,
  });

  if (!payable) return null;

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
              {canSave && (
                <Button onClick={saveInvoice} color={'secondary'}>
                  {t('common:save')}
                </Button>
              )}
              {canReject && (
                <Button onClick={rejectInvoice} color={'danger'}>
                  {t('common:reject')}
                </Button>
              )}
              {canSubmit && (
                <Button onClick={submitInvoice}>{t('common:submit')}</Button>
              )}
              {canApprove && (
                <Button onClick={approveInvoice}>{t('common:approve')}</Button>
              )}
              {canPay && (
                <Button onClick={payInvoice}>{t('common:pay')}</Button>
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
          <StyledScrollContent>
            <StyledScroll>
              {payable.file && (
                <FileViewer
                  name={payable.file.name}
                  mimetype={payable.file.mimetype}
                  url={payable.file.url}
                />
              )}
            </StyledScroll>
          </StyledScrollContent>
        </StyledSection>
        <StyledSection>
          {isEdit && (
            <Tabs>
              <TabList>
                {TAB_LIST.map((tab) => (
                  <Tab key={tab}>{t(`payables:tabs.${tab}`)}</Tab>
                ))}
              </TabList>
              {TAB_LIST.map((tab) => (
                <TabPanel key={tab}></TabPanel>
              ))}
            </Tabs>
          )}
          {isEdit && (
            <StyledScrollContent>
              <StyledScroll>
                <PayableDetailsForm
                  debug={debug}
                  ref={formRef}
                  onSubmit={onFormSubmit}
                  payable={payable}
                />
              </StyledScroll>
            </StyledScrollContent>
          )}
        </StyledSection>
      </StyledContent>
    </ModalLayout>
  );
};

export default PayableDetails;
