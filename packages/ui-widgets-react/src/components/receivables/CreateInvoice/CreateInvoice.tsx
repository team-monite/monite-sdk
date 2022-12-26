import { useState } from 'react';
import {
  Box,
  Button,
  Header,
  IconButton,
  Modal,
  ModalLayout,
  Spinner,
  Text,
  UMultiply,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';
import InvoiceForm from './InvoiceForm';
import { StyledContent, StyledSpinnerWrapper } from './CreateInvoiceStyle';

import { RECEIVABLE_TYPES } from '../types';

type Props = {
  type: RECEIVABLE_TYPES;
  onClose: () => void;
};

const CreateInvoice = ({ type, onClose }: Props) => {
  const { t } = useComponentsContext();
  const [isCreating, setIsCreating] = useState(false);

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
              <Button
                type="submit"
                form="createInvoice"
                isLoading={isCreating}
                disabled={isCreating}
              >
                {t('common:create')}
              </Button>
            }
          />
        }
      >
        <StyledContent isLoading={isCreating}>
          {isCreating && (
            <StyledSpinnerWrapper>
              <Spinner pxSize={24} />
            </StyledSpinnerWrapper>
          )}
          <Box mb={48}>
            <Text textSize="h1">{t('receivables:newInvoice')}</Text>
          </Box>
          {(() => {
            switch (type) {
              case RECEIVABLE_TYPES.INVOICE:
                return (
                  <InvoiceForm
                    onClose={onClose}
                    setIsCreating={setIsCreating}
                  />
                );
              default:
                return null;
            }
          })()}
        </StyledContent>
      </ModalLayout>
    </Modal>
  );
};

export default CreateInvoice;
