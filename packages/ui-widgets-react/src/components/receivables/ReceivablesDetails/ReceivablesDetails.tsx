import React from 'react';
import {
  Box,
  Button,
  Header,
  IconButton,
  Modal,
  ModalLayout,
  Text,
  UMultiply,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';
import InvoiceForm from './InvoiceForm';
import { StyledContent } from './ReceivablesDetailsStyle';

import { RECEIVABLE_TYPES } from '../types';

type Props = {
  type: RECEIVABLE_TYPES;
  onClose?: () => void;
};

const ReceivablesDetails = ({ type, onClose }: Props) => {
  const { t } = useComponentsContext();

  return (
    <Modal>
      <ModalLayout
        fullScreen
        header={
          <Header
            leftBtn={
              <IconButton onClick={onClose} color="black">
                <UMultiply size={18} />
              </IconButton>
            }
            actions={
              <Button type="submit" form="createInvoice">
                {t('common:create')}
              </Button>
            }
          />
        }
      >
        <StyledContent>
          <Box mb={48}>
            <Text textSize="h1">{t('receivables:newInvoice')}</Text>
          </Box>
          {(() => {
            switch (type) {
              case RECEIVABLE_TYPES.INVOICE:
                return <InvoiceForm onClose={onClose} />;
              default:
                return null;
            }
          })()}
        </StyledContent>
      </ModalLayout>
    </Modal>
  );
};

export default ReceivablesDetails;
