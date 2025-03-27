import { useState } from 'react';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { TagsAutocomplete } from './TagsAutocomplete';

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

  const onUpdate = () => {
    updateTags?.(updatedValue);
    onClose();
  };

  return (
    <Dialog open={opened} onClose={onClose} container={root} fullWidth>
      <DialogTitle>{t(i18n)`Edit tags`}</DialogTitle>
      <DialogContent dividers>
        <TagsAutocomplete value={value} onChange={setUpdatedValue} />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" onClick={onClose}>{t(
          i18n
        )`Cancel`}</Button>
        <Button variant="contained" onClick={onUpdate}>{t(
          i18n
        )`Update`}</Button>
      </DialogActions>
    </Dialog>
  );
};
