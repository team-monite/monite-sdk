import React, { useState, cloneElement, ReactElement } from 'react';
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

export type OptionalFields = {
  invoiceDate?: boolean;
  suggestedPaymentDate?: boolean;
  tags?: boolean;
  iban?: boolean;
  bic?: boolean;
};

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
  optionalFields?: OptionalFields;
}

const PayableDetails = ({
  id,
  optionalFields,
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
                payable={payable}
                isFormLoading={isFormLoading}
                optionalFields={optionalFields}
              />
            )}
            {!isEdit && (
              <PayableDetailsInfo
                payable={payable}
                optionalFields={optionalFields}
              />
            )}
          </StyledSection>
        </StyledContent>
      </ModalLayout>
    </Modal>
  );
};

export default PayableDetails;
