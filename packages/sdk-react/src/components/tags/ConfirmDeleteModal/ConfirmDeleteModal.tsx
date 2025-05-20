import { toast } from 'react-hot-toast';

import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface ConfirmDeleteModalProps {
  /** The tag what we want to delete */
  tag: { id: string; name: string };

  /**
   * Callback which fires when the user
   *  decided to close the modal
   *  or deletion was successful
   */
  onClose: () => void;

  /** Callback which fires when the tag has been deleted */
  onDelete?: (tagId: string) => void;

  modalOpened: boolean;
}

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => (
  <MoniteScopedProviders>
    <ConfirmDeleteModalBase {...props} />
  </MoniteScopedProviders>
);

const ConfirmDeleteModalBase = ({
  tag,
  onClose,
  onDelete,
  modalOpened,
}: ConfirmDeleteModalProps) => {
  const { i18n } = useLingui();
  const tag_id = tag?.id;
  const { api, queryClient } = useMoniteContext();

  const deleteTagMutation = api.tags.deleteTagsId.useMutation(
    {
      path: {
        tag_id: tag_id ?? '',
      },
    },
    {
      onSuccess: () => {
        api.tags.getTagsId.removeQueries(
          { parameters: { path: { tag_id } } },
          queryClient
        );

        return api.tags.getTags.invalidateQueries(queryClient);
      },
    }
  );

  const handleDelete = () => {
    deleteTagMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t(i18n)`Tag “${tag.name}” was deleted`);

        onClose?.();
        onDelete?.(tag.id);
      },
    });
  };

  return (
    <ConfirmationModal
      open={modalOpened}
      title={t(i18n)`Delete “${tag.name}” tag?`}
      message={t(i18n)`This action can’t be undone.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={deleteTagMutation.isPending}
    />
  );
};
