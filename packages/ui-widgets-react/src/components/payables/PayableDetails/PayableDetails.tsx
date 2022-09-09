import React, { ReactNode, useState } from 'react';
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
  Modal,
} from '@monite/ui-kit-react';

import { PAYABLE_TAB_LIST, ROW_TO_TAG_STATUS_MAP } from '../consts';
import PayableDetailsForm from './PayableDetailsForm';

import {
  StyledContent,
  StyledHeaderActions,
  StyledHeaderContent,
  StyledLoading,
  StyledSection,
  StyledTabs,
} from './PayableDetailsStyle';

import usePayableDetails, {
  PayableDetailsPermissions,
  UsePayableDetailsProps,
} from './usePayableDetails';

import PayableDetailsInfo from './PayableDetailsInfo';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
}

const PayableDetails = ({
  id,
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
    isLoading,
    error,
    permissions,
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
    onSubmit,
    onSave,
    onReject,
    onPay,
    onApprove,
  });

  const [actions] = useState<Record<PayableDetailsPermissions, ReactNode>>({
    save: (
      <Button key={'save'} onClick={saveInvoice} color={'secondary'}>
        {t('common:save')}
      </Button>
    ),
    submit: (
      <Button key={'submit'} onClick={submitInvoice}>
        {t('common:submit')}
      </Button>
    ),
    reject: (
      <Button key={'reject'} onClick={rejectInvoice} color={'danger'}>
        {t('common:reject')}
      </Button>
    ),
    approve: (
      <Button key={'approve'} onClick={approveInvoice}>
        {t('common:approve')}
      </Button>
    ),
    pay: (
      <Button key={'pay'} onClick={payInvoice}>
        {t('common:pay')}
      </Button>
    ),
  });

  if (isLoading)
    return (
      <Modal>
        <ModalLayout fullScreen>
          <StyledLoading>
            <Spinner color={'primary'} pxSize={45} />
          </StyledLoading>
        </ModalLayout>
      </Modal>
    );

  if (error || !payable) {
    // TODO this is only example
    return (
      <Modal>
        <ModalLayout
          fullScreen
          header={
            <Header
              leftBtn={
                <IconButton onClick={onClose} color={'black'}>
                  <UMultiply size={18} />
                </IconButton>
              }
            >
              {error?.message}
            </Header>
          }
        >
          {error?.message}
        </ModalLayout>
      </Modal>
    );
  }

  return (
    <Modal>
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
                {permissions.map((permission) => actions[permission])}
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
            {payable.file && (
              <FileViewer
                name={payable.file.name}
                mimetype={payable.file.mimetype}
                url={payable.file.url}
              />
            )}
          </StyledSection>
          <StyledSection>
            {isEdit && (
              <StyledTabs>
                <Tabs>
                  <TabList>
                    {PAYABLE_TAB_LIST.map((tab) => (
                      <Tab key={tab}>{t(`payables:tabs.${tab}`)}</Tab>
                    ))}
                  </TabList>
                  {PAYABLE_TAB_LIST.map((tab) => (
                    <TabPanel key={tab} />
                  ))}
                </Tabs>
              </StyledTabs>
            )}
            {isEdit && (
              <PayableDetailsForm
                ref={formRef}
                onSubmit={onFormSubmit}
                payable={payable}
              />
            )}
            {!isEdit && <PayableDetailsInfo payable={payable} />}
          </StyledSection>
        </StyledContent>
      </ModalLayout>
    </Modal>
  );
};

export default PayableDetails;
