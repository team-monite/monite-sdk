import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Text,
  IconButton,
  ModalLayout,
  UMultiply,
  Header,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  FileViewer,
  Spinner,
} from '@monite/ui';

import { PAYABLE_TAB_LIST, ROW_TO_TAG_STATUS_MAP } from '../../consts';
import PayableDetailsForm from './PayableDetailsForm';

import {
  StyledContent,
  StyledHeaderActions,
  StyledHeaderContent,
  StyledLoading,
  StyledScroll,
  StyledScrollContent,
  StyledSection,
} from './PayableDetailsStyle';

import usePayableDetails, { UsePayableDetailsProps } from './usePayableDetails';
import PayableDetailsInfo from './PayableDetailsInfo';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
}

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

  if (!payable)
    return (
      <ModalLayout fullScreen>
        <StyledLoading>
          <Spinner color={'primary'} pxSize={45} />
        </StyledLoading>
      </ModalLayout>
    );

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
            <Tag color={ROW_TO_TAG_STATUS_MAP[payable.status]}>
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
                {PAYABLE_TAB_LIST.map((tab) => (
                  <Tab key={tab}>{t(`payables:tabs.${tab}`)}</Tab>
                ))}
              </TabList>
              {PAYABLE_TAB_LIST.map((tab) => (
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

          {!isEdit && (
            <StyledScrollContent>
              <StyledScroll>
                <PayableDetailsInfo payable={payable} />
              </StyledScroll>
            </StyledScrollContent>
          )}
        </StyledSection>
      </StyledContent>
    </ModalLayout>
  );
};

export default PayableDetails;
