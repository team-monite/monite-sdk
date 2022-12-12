import React from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Modal,
  ModalLayout,
  Text,
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';

const StyledHeader = styled(Box)`
  padding: 32px 32px 16px;
`;

interface Props {
  onClose?: () => void;
}
const CreateTagModal = ({ onClose }: Props) => {
  const { t } = useComponentsContext();

  return (
    <Modal onClose={onClose}>
      <ModalLayout
        header={
          <StyledHeader>
            <Text textSize="h3" textAlign="center">
              {t('tags:createNewTag')}
            </Text>
          </StyledHeader>
        }
        footer={
          <>
            <Button color="secondary" onClick={onClose}>
              {t('common:cancel')}
            </Button>
            <Button>{t('common:create')}</Button>
          </>
        }
      >
        CreateTagModal
      </ModalLayout>
    </Modal>
  );
};

export default CreateTagModal;
