import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import { Button, Text, ModalLayout, Modal } from '@monite/ui-kit-react';

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 32px 16px 32px;
`;

const Separator = styled.div`
  margin: 24px 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.lightGrey2};
`;

const Content = styled.div`
  margin: 0px 32px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 24px 24px 24px;
`;

type ConfirmDeleteDialogueProps = {
  onClose: () => void;
  onDelete: () => void;
  name: string;
};

const ConfirmDeleteDialogue = ({
  onClose,
  onDelete,
  name,
}: ConfirmDeleteDialogueProps) => {
  const { t } = useTranslation();

  return (
    <Modal>
      <ModalLayout
        header={
          <StyledHeader>
            <Text textSize="h3">{t('counterparts:confirmDialogue.title')}</Text>
          </StyledHeader>
        }
        footer={
          <>
            <Separator />
            <ActionsWrapper>
              <Button color="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button color="danger" onClick={onDelete}>
                Delete
              </Button>
            </ActionsWrapper>
          </>
        }
      >
        <Content>
          <Text color="grey" textAlign="center">
            {t('counterparts:confirmDialogue.content', { name })}
          </Text>
        </Content>
      </ModalLayout>
    </Modal>
  );
};

export default ConfirmDeleteDialogue;
