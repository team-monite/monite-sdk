import React from 'react';

import {
  Card,
  Text,
  Flex,
  IconButton,
  Button,
  useModal,
  FileViewer,
  Link,
  ModalLayout,
  Modal,
  UMultiply,
} from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { formatDate } from 'core/utils';

import { StyledInfoTable } from '../../payables/PayableDetails/PayableDetailsStyle';
import usePaymentDetails, { UsePayableDetailsProps } from './usePaymentDetails';
import PaymentDetailsRow from './PaymentDetailsRow';

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  gap: 16px;
  padding: 32px;
  flex-direction: column;
`;

const StyledAction = styled(Flex)`
  justify-content: space-between;
  gap: 16px;

  button,
  a {
    width: 50%;
  }
`;

const PaymentDetails = (props: UsePayableDetailsProps) => {
  const { t } = useTranslation();
  const { show, hide, isOpen } = useModal();
  const { recipient, amount, paymentReference, invoice } =
    usePaymentDetails(props);

  return (
    <StyledCard shadow>
      {isOpen && invoice && (
        <Modal>
          <ModalLayout fullHeight size={'md'}>
            <FileViewer
              rightIcon={
                <IconButton onClick={hide} color={'black'}>
                  <UMultiply size={18} />
                </IconButton>
              }
              name={invoice.file.name}
              url={invoice.file.url}
              mimetype={invoice.file.mimetype}
            />
          </ModalLayout>
        </Modal>
      )}

      <Text textSize={'h2'}>{amount}</Text>

      {invoice && (
        <StyledAction>
          <Button color={'secondary'} onClick={show}>
            {t('payment:actions.viewInvoice')}
          </Button>
          <Link
            size={'md'}
            download
            target={'_blank'}
            variant={'contained'}
            href={invoice.file.url}
            color={'secondary'}
          >
            {t('payment:actions.downloadInvoice')}
          </Link>
        </StyledAction>
      )}

      <StyledInfoTable>
        {paymentReference && (
          <PaymentDetailsRow
            label={t('payment:details.paymentReference')}
            value={paymentReference}
          />
        )}

        <PaymentDetailsRow
          label={t('payment:details.recipient')}
          value={recipient}
        />

        {invoice && (
          <PaymentDetailsRow
            label={t('payment:details.issueDate')}
            value={formatDate(invoice.issue_date, 'dd LLL yyyy')}
          />
        )}

        {invoice && (
          <PaymentDetailsRow
            label={t('payment:details.dueDate')}
            value={formatDate(invoice.due_date, 'dd LLL yyyy')}
          />
        )}
      </StyledInfoTable>
    </StyledCard>
  );
};

export default PaymentDetails;
