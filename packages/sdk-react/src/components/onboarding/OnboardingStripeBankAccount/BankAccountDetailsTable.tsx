import { Trans } from '@lingui/react/macro';

import { StripeBankAccountDetails } from './types';

interface BankAccountDetailsTableProps {
  bankDetails?: StripeBankAccountDetails | null;
  accountHolderName?: string;
  accountHolderType?: 'individual' | 'company';
  isConnected: boolean;
  showVerificationStatus?: boolean;
}

export function BankAccountDetailsTable({
  bankDetails,
  accountHolderName,
  accountHolderType,
  isConnected,
  showVerificationStatus = false,
}: BankAccountDetailsTableProps) {
  return (
    <div className="mtw:rounded-lg mtw:border mtw:border-gray-200 mtw:overflow-hidden">
      <div className="mtw:bg-gray-50 mtw:px-4 mtw:py-3 mtw:border-b mtw:border-gray-200">
        <h6 className="mtw:text-sm mtw:font-semibold mtw:text-gray-900">
          {isConnected ? (
            <Trans>Connected Bank Account</Trans>
          ) : (
            <Trans>Bank Account</Trans>
          )}
        </h6>
      </div>
      <div className="mtw:bg-white mtw:px-4 mtw:py-4">
        <table className="mtw:w-full mtw:text-sm">
          <tbody className="mtw:divide-y mtw:divide-gray-100">
            <tr>
              <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                <Trans>Bank Name</Trans>
              </td>
              <td className="mtw:py-2 mtw:text-gray-900">
                {bankDetails?.bank_name || <Trans>Not connected</Trans>}
              </td>
            </tr>
            <tr>
              <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                <Trans>Account Holder</Trans>
              </td>
              <td className="mtw:py-2 mtw:text-gray-900">
                {bankDetails?.account_holder_name || accountHolderName}
              </td>
            </tr>
            <tr>
              <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                <Trans>Account Type</Trans>
              </td>
              <td className="mtw:py-2 mtw:text-gray-900 mtw:capitalize">
                {bankDetails?.account_holder_type === 'individual' ? (
                  <Trans>Individual</Trans>
                ) : bankDetails?.account_holder_type === 'company' ? (
                  <Trans>Company</Trans>
                ) : accountHolderType === 'individual' ? (
                  <Trans>Individual</Trans>
                ) : (
                  <Trans>Company</Trans>
                )}
              </td>
            </tr>
            <tr>
              <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                <Trans>Account Number</Trans>
              </td>
              <td className="mtw:py-2 mtw:text-gray-900">
                {bankDetails?.last4 ? (
                  <>••••••{bankDetails.last4}</>
                ) : (
                  <Trans>Not connected</Trans>
                )}
              </td>
            </tr>
            <tr>
              <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                <Trans>Routing Number</Trans>
              </td>
              <td className="mtw:py-2 mtw:text-gray-900">
                {bankDetails?.routing_number || <Trans>Not connected</Trans>}
              </td>
            </tr>
            {showVerificationStatus && (
              <tr>
                <td className="mtw:py-2 mtw:text-gray-600 mtw:font-medium mtw:pr-4">
                  <Trans>Verification Status</Trans>
                </td>
                <td className="mtw:py-2">
                  <span className="mtw:inline-flex mtw:items-center mtw:px-2 mtw:py-0.5 mtw:rounded-full mtw:text-xs mtw:font-medium mtw:bg-green-100 mtw:text-green-800">
                    <svg
                      className="mtw:mr-1 mtw:h-3 mtw:w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Trans>Verified</Trans>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
