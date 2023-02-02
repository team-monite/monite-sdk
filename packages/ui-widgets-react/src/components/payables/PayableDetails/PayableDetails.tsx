import React, { useState, useEffect, cloneElement, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Text,
  IconButton,
  ModalLayout,
  UMultiply,
  Header,
  Tag,
  FileViewer,
  Loading,
  Modal,
} from '@team-monite/ui-kit-react';

import { ROW_TO_TAG_STATUS_MAP } from '../consts';
import PayableDetailsForm from './PayableDetailsForm';

import {
  StyledContent,
  StyledHeaderActions,
  StyledHeaderContent,
  StyledSection,
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
  onCancel,
  onApprove,
  onPay,
}: PayablesDetailsProps) => {
  const { t } = useTranslation();
  const {
    payable,
    formRef,
    isEdit,
    isLoading,
    isFormLoading,
    isButtonLoading,
    error,
    permissions,
    actions: {
      saveInvoice,
      submitInvoice,
      rejectInvoice,
      approveInvoice,
      cancelInvoice,
      payInvoice,
    },
  } = usePayableDetails({
    id,
    onSubmit,
    onSave,
    onReject,
    onCancel,
    onPay,
    onApprove,
  });

  const [isInvoiceSubmitting, setIsInvoiceSubmitting] = useState(false);

  useEffect(() => {
    if (isInvoiceSubmitting) {
      formRef.current?.dispatchEvent(
        new Event('submit', {
          bubbles: true,
        })
      );
    }
  }, [isInvoiceSubmitting]);

  const [actions] = useState<Record<PayableDetailsPermissions, ReactElement>>({
    save: (
      <Button
        key={'save'}
        color={'secondary'}
        type="submit"
        form="payableDetailsForm"
      >
        {t('common:save')}
      </Button>
    ),
    submit: (
      <Button
        key={'submit'}
        onClick={(e) => {
          e.preventDefault();
          setIsInvoiceSubmitting(true);
        }}
      >
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
    cancel: (
      <Button key={'cancel'} onClick={cancelInvoice} color={'danger'}>
        {t('common:cancel')}
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
          <Loading />
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
                {permissions.map((permission) =>
                  cloneElement(actions[permission], {
                    isLoading: isButtonLoading,
                    disabled: isButtonLoading,
                  })
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
            {payable.file && (
              <FileViewer
                name={payable.file.name}
                mimetype={payable.file.mimetype}
                url={payable.file.url}
              />
            )}
          </StyledSection>
          <StyledSection>
            {/* Uncomment when history and status tabs will be added */}
            {/* {isEdit && (
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
            )} */}
            {isEdit && (
              <PayableDetailsForm
                ref={formRef}
                saveInvoice={saveInvoice}
                isInvoiceSubmitting={isInvoiceSubmitting}
                setIsInvoiceSubmitting={setIsInvoiceSubmitting}
                submitInvoice={submitInvoice}
                payable={payable}
                isFormLoading={isFormLoading}
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
