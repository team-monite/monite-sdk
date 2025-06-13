import { memo } from 'react';

import { useDialog } from '@/components/Dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import {
  Breadcrumbs,
  DialogTitle,
  Divider,
  Grid,
  styled,
  Typography,
} from '@mui/material';

import { IconWrapper } from '../iconWrapper';

type BaseDialogHeaderProps = {
  /** The title to display in the header */
  title: string;
  /** Whether to show a divider below the header */
  showDivider?: boolean;
};

type PrimaryLevelDialogHeaderProps = BaseDialogHeaderProps & {
  /** The title of the previous level (secondary level only) */
  previousLevelTitle?: never;
  /** The tooltip for the close button */
  closeButtonTooltip?: string;
  /** Whether this is a secondary level dialog (secondary level only) */
  secondaryLevel?: never;
  /** The callback for navigating back when clicking on the previous level title (secondary level only) */
  closeSecondaryLevelDialog?: never;
};

type SecondaryLevelDialogHeaderProps = BaseDialogHeaderProps & {
  /** Whether this is a secondary level dialog */
  secondaryLevel?: boolean;
  /** The title of the previous level */
  previousLevelTitle?: string;
  /** The tooltip for the close button (primary level only) */
  closeButtonTooltip?: never;
  /** The callback for navigating back when clicking on the previous level title */
  closeSecondaryLevelDialog?: () => void;
};

type DialogHeaderProps =
  | PrimaryLevelDialogHeaderProps
  | SecondaryLevelDialogHeaderProps;

const DialogHeaderBreadcrumbs = memo(
  ({
    previousLevelTitle,
    onPreviousLevelClick,
    title,
  }: {
    previousLevelTitle: string;
    title: string;
    onPreviousLevelClick?: () => void;
  }) => (
    <Breadcrumbs
      color="inherit"
      separator={<ArrowForwardIcon fontSize="small" color="disabled" />}
      sx={{ padding: 3 }}
      aria-label="breadcrumb"
    >
      <Typography
        onClick={onPreviousLevelClick}
        sx={{
          cursor: onPreviousLevelClick ? 'pointer' : 'default',
        }}
      >
        {previousLevelTitle}
      </Typography>
      <Typography>{title}</Typography>
    </Breadcrumbs>
  )
);

/**
 * DialogHeader renders the header section of a dialog/modal with support for two levels of dialogs:
 * 1. Primary level: Shows a title and close (X) button
 * 2. Secondary level: Can have two layouts:
 *    - If passed previousLevelTitle, shows breadcrumb navigation with previous level title and current title
 *    - Else, shows only the current title
 *
 * Note: For secondary level dialogs, the close (X) button is not shown. A cancel button is expected to be
 * present in the dialog content (for example, with the DialogFooter component).
 *
 * @component
 * @example
 * ```tsx
 * <DialogHeader
 *   title="Edit addresss"
 *   previousLevelTitle="Counterpart"
 * />
 * ```
 */
export const DialogHeader = memo(
  ({
    title,
    secondaryLevel = false,
    previousLevelTitle,
    closeButtonTooltip,
    showDivider = true,
    closeSecondaryLevelDialog,
  }: DialogHeaderProps) => {
    const { i18n } = useLingui();
    const dialogContext = useDialog();

    const showCloseButton = dialogContext?.isDialogContent && !secondaryLevel;
    const closeButtonLabel = closeButtonTooltip || t(i18n)`Close dialog`;

    return (
      <>
        <Grid container alignItems="center">
          <Grid item xs={11}>
            {secondaryLevel && previousLevelTitle ? (
              <DialogHeaderBreadcrumbs
                previousLevelTitle={previousLevelTitle}
                title={title}
                onPreviousLevelClick={closeSecondaryLevelDialog}
              />
            ) : (
              <StyledDialogTitle variant="h3">{title}</StyledDialogTitle>
            )}
          </Grid>
          <Grid item xs={1}>
            {showCloseButton && (
              <IconWrapper
                color="inherit"
                onClick={dialogContext.onClose}
                ariaLabelOverride={closeButtonLabel}
                tooltip={closeButtonLabel}
              >
                <CloseIcon />
              </IconWrapper>
            )}
          </Grid>
        </Grid>
        {showDivider && <Divider />}
      </>
    );
  }
);

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  '&.MuiDialogTitle-root.MuiTypography-root': {
    ...theme.typography.h3, // MUI v5 styles DialogTitle as H6. This is a workaround to apply H3 styles
    padding: theme.spacing(3),
  },
}));
