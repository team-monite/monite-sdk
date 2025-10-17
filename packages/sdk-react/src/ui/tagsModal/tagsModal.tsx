import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { TagsAutocomplete } from '@/ui/TagsAutocomplete';
import { Dialog } from '@/ui/Dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useState } from 'react';

export type TagsModalProps = {
  opened: boolean;
  value: components['schemas']['TagReadSchema'][];
  updateTags?: (tags: components['schemas']['TagReadSchema'][]) => void;
  onClose: () => void;
};

export const TagsModal = ({
  opened,
  onClose,
  value,
  updateTags,
}: TagsModalProps) => {
  const { root } = useRootElements();
  const { i18n } = useLingui();
  const [updatedValue, setUpdatedValue] = useState(value);

  const handleTagsChange = (
    newTags: components['schemas']['TagReadSchema'][]
  ) => {
    setUpdatedValue(newTags);
  };

  const onUpdate = () => {
    updateTags?.(updatedValue);
    onClose();
  };

  return (
    <Dialog open={opened} onClose={onClose} container={root} fullWidth>
      <DialogTitle>{t(i18n)`Edit tags`}</DialogTitle>
      <DialogContent dividers>
        <TagsAutocomplete value={updatedValue} onChange={handleTagsChange} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={onClose}
        >{t(i18n)`Cancel`}</Button>
        <Button
          variant="contained"
          onClick={onUpdate}
        >{t(i18n)`Update`}</Button>
      </DialogActions>
    </Dialog>
  );
};
