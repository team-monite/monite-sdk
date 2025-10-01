import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/ui/components/dialog';
import { XIcon } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

interface TreasuryTermsAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export const TreasuryTermsAcceptanceModal = ({
  open,
  onAccept,
  onClose,
  isProcessing,
}: TreasuryTermsAcceptanceModalProps) => {
  const { i18n } = useLingui();
  
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="mtw:sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mtw:text-center">
            <Trans>Accept attaching bank account</Trans>
          </DialogTitle>
        </DialogHeader>
        <div className="mtw:space-y-3 mtw:text-sm mtw:text-foreground/90">
          <p className="mtw:leading-6">
            <Trans>
              By clicking "Accept", you authorize Monite to debit the bank account
              specified above for any amount owed for charges arising from your
              use of Monite's services and/or purchase of products from Monite,
              pursuant to Monite's website and terms, until this authorization is
              revoked. You may amend or cancel this authorization at any time by
              providing notice to Monite with 30 (thirty) days notice.
            </Trans>
          </p>
          <p className="mtw:leading-6">
            <Trans>
              If you use Monite's services or purchase additional products
              periodically pursuant to Monite's terms, you authorize Monite to
              debit your bank account periodically. Payments that fall outside of
              the regular debits authorized above will only be debited after your
              authorization is obtained.
            </Trans>
          </p>
        </div>
        <div className="mtw:flex mtw:justify-center mtw:pt-5">
          <Button
            onClick={onAccept}
            disabled={isProcessing}
            className="mtw:min-w-[120px]"
          >
            {isProcessing ? t(i18n)`Processing...` : t(i18n)`Accept`}
          </Button>
        </div>
        <DialogClose className="mtw:absolute mtw:left-4 mtw:top-4 mtw:rounded-xs mtw:text-muted-foreground mtw:opacity-70 mtw:transition-opacity hover:mtw:opacity-100">
          <XIcon className="mtw:size-4" />
          <span className="mtw:sr-only"><Trans>Close</Trans></span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
