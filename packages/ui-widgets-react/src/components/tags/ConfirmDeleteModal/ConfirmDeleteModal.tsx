import React, { useCallback } from 'react';
import { Button, Modal, ModalLayout, Text } from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useDeleteTag } from 'core/queries';

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

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 24px 24px 24px;
`;

const Content = styled.div`
  margin: 0 32px;
`;

interface Props {
  tag: { id: string; name: string };
  onClose: () => void;
  onDelete: () => void;
}

// TODO make a common dialogue component
const ConfirmDeleteModal = ({ tag, onClose, onDelete }: Props) => {
  const { t } = useTranslation();
  const deleteTagMutation = useDeleteTag();

  const handleDelete = useCallback(async () => {
    await deleteTagMutation.mutateAsync(tag.id, {
      onSuccess: () => {
        toast.success(
          t('tags:messages.deleteSuccess', {
            name: tag.name,
          })
        );

        onClose && onClose();
      },
    });

    onDelete && onDelete();
  }, [deleteTagMutation]);

  return (
    <Modal onClose={onClose}>
      <ModalLayout
        header={
          <StyledHeader>
            <Text textSize="h3">
              {t('tags:confirmDeleteDialogue.title', {
                name: tag.name,
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
                onClick={handleDelete}
                disabled={deleteTagMutation.isLoading}
                isLoading={deleteTagMutation.isLoading}
              >
                {t('common:delete')}
              </Button>
            </ActionsWrapper>
          </>
        }
      >
        <Content>
          <Text color="grey" textAlign="center">
            {t('tags:confirmDeleteDialogue.content')}
          </Text>
        </Content>
      </ModalLayout>
    </Modal>
  );
};

export default ConfirmDeleteModal;
