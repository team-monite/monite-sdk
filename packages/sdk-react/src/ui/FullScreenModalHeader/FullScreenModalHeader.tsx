import { ReactNode } from 'react';

import { useDialog } from '@/components/Dialog';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, Stack, styled, Toolbar } from '@mui/material';

export interface FullScreenModalHeaderProps {
  /** The title of the dialog */
  title: ReactNode;
  /** Optional status chip or other element to display next to the title */
  statusElement?: ReactNode;
  /** Optional actions to display on the right side of the header. Usually buttons */
  actions?: ReactNode;
  /** Optional class name for styling */
  className?: string;
  /** Optional close button tooltip */
  closeButtonTooltip?: string;
}

export const FullScreenModalHeader = ({
  title,
  statusElement,
  actions,
  className,
  closeButtonTooltip,
}: FullScreenModalHeaderProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  return (
    <StyledToolbar className={className} disableGutters>
      {dialogContext?.isDialogContent && (
        <IconWrapper
          color="inherit"
          onClick={dialogContext.onClose}
          ariaLabelOverride={closeButtonTooltip || t(i18n)`Close modal`}
          tooltip={closeButtonTooltip || t(i18n)`Close modal`}
        >
          <CloseIcon />
        </IconWrapper>
      )}

      <Stack direction="row" spacing={2} alignItems="center" ml={2}>
        <StyledDialogTitle>{title}</StyledDialogTitle>
        {statusElement}
      </Stack>

      {actions && (
        <Stack direction="row" spacing={2} ml="auto">
          {actions}
        </Stack>
      )}
    </StyledToolbar>
  );
};

const StyledToolbar = styled(Toolbar)(() => ({
  padding: '24px 32px',
  flexShrink: 0,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  '&.MuiDialogTitle-root.MuiTypography-root': {
    ...theme.typography.h3, // MUI v5 styles DialogTitle as H6. This is a workaround to apply H3 styles
    padding: '0',
  },
}));
