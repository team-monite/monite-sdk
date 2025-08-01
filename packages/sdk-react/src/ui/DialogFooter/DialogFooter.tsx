import { useDialog } from '@/ui/Dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  CircularProgress,
  DialogActions,
  Divider,
  Stack,
} from '@mui/material';

type BaseButtonProps = {
  /** The label of the button */
  label?: string;
  /** Whether the button is disabled */
  isDisabled?: boolean;
  /** Whether the button is loading */
  isLoading?: boolean;
};

type ActionButtonProps = BaseButtonProps & {
  /** Function to be called when the button is clicked */
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
};

type SubmitButtonProps = BaseButtonProps & {
  /** The id of the form to be submitted */
  formId?: string;
};

type CancelButtonProps = {
  /** The label of the button */
  label?: string;
  /** Whether to hide the cancel button */
  hideCancel?: boolean;
  /** Function to be called when the button is clicked */
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
};

type DialogFooterProps = {
  /** Primary action button configuration (submit button or normal button). */
  primaryButton?: ActionButtonProps | SubmitButtonProps;
  /** Secondary action button configuration */
  secondaryButton?: ActionButtonProps & { onTheLeft?: boolean };
  /** Delete action button configuration */
  deleteButton?: ActionButtonProps;
  /** Cancel action button configuration */
  cancelButton?: CancelButtonProps;
  /** Whether to show a divider above the footer */
  showDivider?: boolean;
};

/**
 * DialogFooter is a flexible component for rendering dialog action buttons.
 *
 * It supports primary, secondary, delete, and cancel actions with loading states
 * and form submission capabilities.
 *
 * Layout:
 * - Left: Delete button (if configured) | Secondary button (if configured)
 * - Right: Cancel (if not hidden) | Secondary (if configured) | Primary (if configured)
 *
 * The secondary button can be placed on right (default) or left side of the footer.
 *
 * @component
 * @example
 * ```tsx
 * <DialogFooter
 *   primaryButton={{
 *     label: "Save",
 *     onClick: handleSave,
 *     isLoading: isSaving
 *   }}
 *   secondaryButton={{
 *     label: "Preview",
 *     onClick: handlePreview
 *     onTheLeft: true
 *   }}
 *   cancelButton={{
 *     onClick: handleClose
 *   }}
 *   deleteButton={{
 *     label: "Delete",
 *     onClick: handleDelete,
 *     isLoading: isDeleting
 *   }}
 * />
 * ```
 */
export const DialogFooter = ({
  deleteButton,
  primaryButton,
  secondaryButton,
  cancelButton,
  showDivider = true,
}: DialogFooterProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const isSubmitButton = (
    button: ActionButtonProps | SubmitButtonProps
  ): button is SubmitButtonProps => {
    return 'formId' in button;
  };

  return (
    <>
      {showDivider && <Divider />}
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Stack direction="row" spacing={2}>
          {deleteButton && (
            <Button
              variant="text"
              color="error"
              onClick={deleteButton.onClick}
              disabled={deleteButton.isDisabled || deleteButton.isLoading}
            >
              {deleteButton.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                deleteButton.label || t(i18n)`Delete`
              )}
            </Button>
          )}
          {secondaryButton?.onTheLeft && (
            <Button
              variant="text"
              color="primary"
              onClick={secondaryButton.onClick}
              disabled={secondaryButton.isDisabled || secondaryButton.isLoading}
            >
              {secondaryButton.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                secondaryButton.label
              )}
            </Button>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          {!cancelButton?.hideCancel && (
            <Button
              variant="text"
              color="primary"
              onClick={cancelButton?.onClick || dialogContext?.onClose}
              disabled={
                primaryButton?.isLoading ||
                secondaryButton?.isLoading ||
                deleteButton?.isLoading
              }
            >
              {cancelButton?.label || t(i18n)`Cancel`}
            </Button>
          )}
          {secondaryButton && !secondaryButton.onTheLeft && (
            <Button
              variant="text"
              color="primary"
              onClick={secondaryButton.onClick}
              disabled={secondaryButton.isDisabled || secondaryButton.isLoading}
            >
              {secondaryButton.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                secondaryButton.label
              )}
            </Button>
          )}
          {primaryButton && (
            <Button
              variant="contained"
              color="primary"
              {...(isSubmitButton(primaryButton)
                ? {
                    type: 'submit',
                    form: primaryButton.formId,
                  }
                : {
                    type: 'button',
                    onClick: primaryButton.onClick,
                  })}
              disabled={primaryButton.isDisabled || primaryButton.isLoading}
            >
              {primaryButton.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                primaryButton.label
              )}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </>
  );
};
