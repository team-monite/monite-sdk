import { LoadingSpinner } from '../loading';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode } from 'react';

type BaseConfirmationModalProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  container?: Element;
};

type MessageConfirmationModalProps = BaseConfirmationModalProps & {
  message: string;
  children?: never;
};

type ChildrenConfirmationModalProps = BaseConfirmationModalProps & {
  message?: never;
  children: ReactNode;
};

type ConfirmationModalProps =
  | MessageConfirmationModalProps
  | ChildrenConfirmationModalProps;

export const ConfirmationModal = ({
  open,
  title,
  message,
  children,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  container,
  isLoading = false,
}: ConfirmationModalProps) => {
  const { i18n } = useLingui();

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      aria-label={t(i18n)`Confirmation dialog`}
    >
      <DialogContent
        container={container as HTMLElement}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{message ? message : children}</DialogDescription>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading && (
              <LoadingSpinner className="mtw:w-5 mtw:h-5 mtw:border-inherit mtw:border-t-transparent" />
            )}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
