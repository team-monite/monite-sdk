import { DialogProps as MuiDialogProps } from '@mui/material/Dialog';

type ALIGN_DIALOG_TYPES = 'left' | 'right';

declare module '@mui/material/transitions' {
  interface TransitionProps {
    alignDialog?: ALIGN_DIALOG_TYPES;
  }
}

export interface MoniteDialogProps extends MuiDialogProps {
  alignDialog?: ALIGN_DIALOG_TYPES;
  onClosed?: () => void;
}
