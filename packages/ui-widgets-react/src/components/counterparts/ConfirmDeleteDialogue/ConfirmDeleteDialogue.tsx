import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import {
  Button,
  Text,
  ModalLayout,
  Modal,
  Spinner,
} from '@team-monite/ui-kit-react';

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 32px 32px 16px 32px;
`;

const Separator = styled.div`
  margin: 24px 0;
  height: 1px;
  background: ${({ theme }) => theme.neutral80};
`;

const Content = styled.div`
  margin: 0 32px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 24px 24px 24px;
`;

type ConfirmDeleteDialogueProps = {
  type: string;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const ConfirmDeleteDialogue = ({
  onClose,
  onDelete,
  type,
  name,
  isLoading,
}: ConfirmDeleteDialogueProps) => {
  const { t } = useTranslation();

  return (
    <Modal>
      <ModalLayout
        header={
          <StyledHeader>
            <Text textSize="h3">
              {t('counterparts:confirmDeleteDialogue.title', {
                type,
                name,
              })}
            </Text>
          </StyledHeader>
        }
        footer={
          <>
            <Separator />
            <ActionsWrapper>
              <Button color="secondary" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button
                color="danger"
                onClick={onDelete}
                disabled={isLoading}
                rightIcon={isLoading && <Spinner pxSize={16} />}
              >
                {t('common:delete')}
              </Button>
            </ActionsWrapper>
          </>
        }
      >
        <Content>
          <Text color="grey" textAlign="center">
            {t('counterparts:confirmDeleteDialogue.content')}
          </Text>
        </Content>
      </ModalLayout>
    </Modal>
  );
};

export default ConfirmDeleteDialogue;
