import { Button } from '@/ui/components/button';

import { BankAccountDetailsTable } from './BankAccountDetailsTable';

interface InitialVerificationViewProps {
  accountHolderName: string;
  accountHolderType: 'individual' | 'company';
  isStarting: boolean;
  startButtonText: string;
  onStartVerification: () => void;
}

export function InitialVerificationView({
  accountHolderName,
  accountHolderType,
  isStarting,
  startButtonText,
  onStartVerification,
}: InitialVerificationViewProps) {
  return (
    <div className="mtw:mb-3 mtw:rounded-lg mtw:border mtw:p-6">
      <BankAccountDetailsTable
        accountHolderName={accountHolderName}
        accountHolderType={accountHolderType}
        isConnected={false}
      />

      <Button
        variant="default"
        onClick={onStartVerification}
        disabled={isStarting}
        className="mtw:mt-4 mtw:w-full"
      >
        {startButtonText}
      </Button>
    </div>
  );
}
