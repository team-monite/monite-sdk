import { useUploadPayable } from '@/components/payables/CreatePayable/useUploadPayable';
import { useMenuButton } from '@/core/hooks';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import AddIcon from '@mui/icons-material/Add';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

interface CreatePayableButtonProps {
  isCreateAllowed: boolean;
  onOpenDetailForm: () => void;
}

export const CreatePayableButton = ({
  isCreateAllowed,
  onOpenDetailForm,
}: CreatePayableButtonProps) => {
  const { buttonProps, menuProps, open } = useMenuButton();
  const { FileInput, openFileInput } = useUploadPayable();

  // const mailboxes = useMailboxes();

  return (
    <>
      <Button
        {...buttonProps}
        variant="contained"
        disabled={!isCreateAllowed}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {t(i18n)`Create New`}
      </Button>
      <Menu {...menuProps}>
        <MenuItem onClick={onOpenDetailForm}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>{t(i18n)`New Invoice`}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            openFileInput();
          }}
        >
          <ListItemIcon>
            <DriveFolderUploadIcon />
          </ListItemIcon>
          <ListItemText>{t(i18n)`Upload File`}</ListItemText>
        </MenuItem>
      </Menu>

      <FileInput />
    </>
  );
};
