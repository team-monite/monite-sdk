import { StripeBankAccountDetails } from './types';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/components/dialog';
import { Trans } from '@lingui/react/macro';
import { CheckCircle2, Landmark, Info } from 'lucide-react';
import { useState } from 'react';

interface TreasuryBankAccountConfirmationModalProps {
  open: boolean;
  bankAccountDetails: StripeBankAccountDetails;
  isLoading?: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const TreasuryBankAccountConfirmationModal = ({
  open,
  bankAccountDetails,
  isLoading = false,
  onAccept,
  onCancel,
}: TreasuryBankAccountConfirmationModalProps) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isAccepting) onCancel();
      }}
    >
      <DialogContent className="mtw:sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <div className="mtw:flex mtw:items-center mtw:gap-2">
              <CheckCircle2 className="mtw:text-green-600 mtw:size-5" />
              <span className="mtw:text-base mtw:font-semibold">
                <Trans>Bank Account Connected</Trans>
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mtw:mb-3">
          <p className="mtw:text-sm mtw:text-muted-foreground">
            <Trans>
              Your bank account has been successfully connected through Stripe
              Financial Connections. Please review the details below and confirm
              to complete the setup.
            </Trans>
          </p>
        </div>
        <div className="mtw:border mtw:rounded-md mtw:overflow-hidden mtw:mb-3">
          <div className="mtw:bg-gray-50 mtw:px-3 mtw:py-2 mtw:flex mtw:items-center mtw:gap-2">
            <Landmark className="mtw:size-4" />
            <span className="mtw:text-sm mtw:font-medium">
              <Trans>Connected Bank Account</Trans>
            </span>
          </div>
          <div className="mtw:p-3">
            <dl className="mtw:m-0">
              {bankAccountDetails.bank_name && (
                <div className="mtw:mb-2">
                  <dt className="mtw:text-sm mtw:text-muted-foreground mtw:font-medium">
                    <Trans>Bank Name</Trans>
                  </dt>
                  <dd className="mtw:text-sm mtw:text-foreground mtw:m-0">
                    {bankAccountDetails.bank_name}
                  </dd>
                </div>
              )}
              {bankAccountDetails.account_holder_name && (
                <div className="mtw:mb-2">
                  <dt className="mtw:text-sm mtw:text-muted-foreground mtw:font-medium">
                    <Trans>Account Holder</Trans>
                  </dt>
                  <dd className="mtw:text-sm mtw:text-foreground mtw:m-0">
                    {bankAccountDetails.account_holder_name}
                  </dd>
                </div>
              )}
              {bankAccountDetails.account_holder_type && (
                <div className="mtw:mb-2">
                  <dt className="mtw:text-sm mtw:text-muted-foreground mtw:font-medium">
                    <Trans>Account Type</Trans>
                  </dt>
                  <dd className="mtw:text-sm mtw:text-foreground mtw:m-0 mtw:capitalize">
                    {bankAccountDetails.account_holder_type}
                  </dd>
                </div>
              )}
              {bankAccountDetails.last4 && (
                <div className="mtw:mb-2">
                  <dt className="mtw:text-sm mtw:text-muted-foreground mtw:font-medium">
                    <Trans>Account Number</Trans>
                  </dt>
                  <dd className="mtw:text-sm mtw:text-foreground mtw:m-0">
                    ••••••{bankAccountDetails.last4}
                  </dd>
                </div>
              )}
              {bankAccountDetails.routing_number && (
                <div className="mtw:mb-0">
                  <dt className="mtw:text-sm mtw:text-muted-foreground mtw:font-medium">
                    <Trans>Routing Number</Trans>
                  </dt>
                  <dd className="mtw:text-sm mtw:text-foreground mtw:m-0">
                    {bankAccountDetails.routing_number}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        <div className="mtw:flex mtw:gap-2 mtw:p-3 mtw:bg-blue-50 mtw:rounded-md mtw:mb-2">
          <Info className="mtw:size-4 mtw:text-blue-600 mtw:mt-0.5" />
          <p className="mtw:text-sm mtw:text-blue-800">
            <Trans>
              By accepting, you confirm that this bank account belongs to your
              organization and authorize its use for Treasury transactions.
            </Trans>
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel} disabled={isAccepting}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAccepting || isLoading}
            className="mtw:min-w-[120px]"
          >
            {isAccepting ? (
              <Trans>Accepting...</Trans>
            ) : (
              <Trans>Accept & Continue</Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
