import { Button } from '@/ui/components/button';
import { Spinner } from '@/ui/components/spinner';
import { Trans } from '@lingui/react/macro';
import { CheckCircle2 } from 'lucide-react';

export function VerificationSuccessCard() {
  return (
    <div className="mtw:mb-4 mtw:p-4 mtw:bg-green-50 mtw:border mtw:border-green-200 mtw:rounded-lg">
      <div className="mtw:flex mtw:items-start">
        <CheckCircle2 className="mtw:h-5 mtw:w-5 mtw:text-green-600 mtw:mt-0.5 mtw:flex-shrink-0" />
        <div className="mtw:ml-3">
          <h3 className="mtw:text-sm mtw:font-semibold mtw:text-green-800">
            <Trans>Verification Successful</Trans>
          </h3>
          <p className="mtw:mt-1 mtw:text-sm mtw:text-green-700">
            <Trans>
              Your bank account has been successfully verified and connected
              through Treasury.
            </Trans>
          </p>
        </div>
      </div>
    </div>
  );
}

export function VerificationInProgressCard() {
  return (
    <div className="mtw:mb-3 mtw:rounded-lg mtw:border mtw:p-6">
      <p className="mtw:text-sm mtw:mb-4">
        <Trans>
          Treasury verification in progress. Please wait while we confirm your
          bank account connection through Financial Connections...
        </Trans>
      </p>
      <div className="mtw:flex mtw:justify-center mtw:py-3">
        <Spinner size="md" />
      </div>
    </div>
  );
}

interface VerificationErrorCardProps {
  error?: string;
}

export function VerificationErrorCard({ error }: VerificationErrorCardProps) {
  return (
    <div className="mtw:mb-4 mtw:p-3 mtw:bg-red-50 mtw:text-red-800 mtw:rounded-md mtw:text-sm">
      {error ? (
        <Trans>Treasury Financial Connections verification failed. {error}</Trans>
      ) : (
        <Trans>
          Treasury bank account verification failed. This may be due to
          incorrect account information or connectivity issues. Please try again
          or contact support if the problem persists.
        </Trans>
      )}
    </div>
  );
}

interface VerificationCanceledCardProps {
  isStarting: boolean;
  startButtonText: string;
  onRetry: () => void;
}

export function VerificationCanceledCard({
  isStarting,
  startButtonText,
  onRetry,
}: VerificationCanceledCardProps) {
  return (
    <div className="mtw:mb-3 mtw:rounded-lg mtw:border mtw:p-6">
      <div className="mtw:mb-4 mtw:p-3 mtw:bg-yellow-50 mtw:text-yellow-800 mtw:rounded-md mtw:text-sm">
        <Trans>
          Treasury Financial Connections was canceled. Click "Retry" to try
          again.
        </Trans>
      </div>

      <Button
        variant="default"
        onClick={onRetry}
        disabled={isStarting}
        className="mtw:mt-2 mtw:w-full"
      >
        {startButtonText}
      </Button>
    </div>
  );
}

interface VerificationRetryCardProps {
  onRetry: () => void;
}

export function VerificationRetryCard({ onRetry }: VerificationRetryCardProps) {
  return (
    <div className="mtw:text-center mtw:py-3">
      <Button variant="outline" onClick={onRetry}>
        <Trans>Retry Verification</Trans>
      </Button>
    </div>
  );
}
