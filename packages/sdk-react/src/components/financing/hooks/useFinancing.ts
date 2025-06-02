import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { components } from '@/api';
import {
  useGetFinancingConnectToken,
} from '@/components/financing/hooks/useGetFinancingConnectToken';
import {
  useGetFinanceOffers,
} from '@/components/financing/hooks/useGetFinanceOffers';
import {
  KanmonFinancedInvoice,
  useKanmonContext,
} from '@/core/context/KanmonContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

const KANMON_CONNECT_SCRIPT_URL_SANDBOX = `https://cdn.sandbox.kanmon.dev/scripts/v2/kanmon-connect.js`;
const KANMON_CONNECT_SCRIPT_URL_PRODUCTION = `https://cdn.kanmon.dev/scripts/v2/kanmon-connect.js`;

export enum FinancialApplicationState {
  INIT = 'init',
  IN_PROGRESS = 'in_progress',
  PENDING_APPROVAL = 'pending_approval',
  NO_OFFERS_AVAILABLE = 'no_offers',
  SERVICING = 'servicing',
  APPROVED = 'approved',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFERS_EXPIRED = 'offers_expired',
}

export type UseFinancingReturnValues = {
  buttonText: string;
  offer: components['schemas']['FinancingOffer'];
  applicationState: string;
  isLoading: boolean;
  isEnabled: boolean;
  isServicing: boolean;
};

export const useFinancing = () => {
  const { apiUrl, api, queryClient, componentSettings, entityId } =
    useMoniteContext();
  const { isKanmonInitialized, toggleKanmon, handleButtonText, buttonText } =
    useKanmonContext();
  const { i18n } = useLingui();
  const getConnectToken = useGetFinancingConnectToken();
  const { data: finance } = useGetFinanceOffers();
  const { isUSEntity } = useMyEntity();

  const handleApplicationState = () => {
    switch (finance?.business_status) {
      case 'NEW':
      default:
        return FinancialApplicationState.INIT;
      case 'INPUT_REQUIRED':
        return FinancialApplicationState.IN_PROGRESS;
      case 'ONBOARDED':
        if (finance?.offers?.length === 0) {
          return FinancialApplicationState.PENDING_APPROVAL;
        }

        if (finance?.offers?.[0]?.status === 'NEW') {
          return FinancialApplicationState.APPROVED;
        }

        if (finance?.offers?.[0]?.status === 'EXPIRED') {
          return FinancialApplicationState.OFFERS_EXPIRED;
        }

        if (finance?.offers?.[0]?.status === 'ACCEPTED') {
          return FinancialApplicationState.OFFER_ACCEPTED;
        }

        return FinancialApplicationState.SERVICING;
    }
  };

  const applicationState = handleApplicationState();

  const isProduction = (() => {
    try {
      const url = new URL(apiUrl);
      return !['api.dev.monite.com', 'api.sandbox.monite.com'].includes(
        url.hostname
      );
    } catch {
      // If URL parsing fails, default to production for safety
      return true;
    }
  })();

  const kanmonConnectScriptUrl = isProduction
    ? KANMON_CONNECT_SCRIPT_URL_PRODUCTION
    : KANMON_CONNECT_SCRIPT_URL_SANDBOX;

  const [scriptLoading] = useScript({
    src: kanmonConnectScriptUrl,
  });
  const [isInitializing, setIsInitializing] = useState(false);

  const refreshFinancedInvoices = (financedInvoice: KanmonFinancedInvoice) => {
    const newFinancedInvoice: components['schemas']['FinancingInvoice'] = {
      type: 'receivable',
      status: 'NEW',
      invoice_id: financedInvoice?.platformInvoiceId,
      document_id: financedInvoice?.platformInvoiceNumber,
      due_date: financedInvoice?.invoiceDueDate,
      issue_date: financedInvoice?.invoiceIssuedDate,
      total_amount: financedInvoice?.invoiceAmountCents,
      currency: 'USD',
      payer_type: financedInvoice?.payorType,
      payer_business_name: financedInvoice?.payorBusinessName,
      payer_first_name: financedInvoice?.payorFirstName,
      payer_last_name: financedInvoice?.payorLastName,
      requested_amount: financedInvoice?.amountRequestedForFinancingCents,
      principal_amount: financedInvoice?.principalAmountCents,
      repayment_amount: financedInvoice?.repaymentAmountCents,
      advance_amount: financedInvoice?.invoiceAdvanceAmountCents,
      advance_rate_percentage: financedInvoice?.advanceRatePercentage * 100,
      fee_amount: financedInvoice?.feeAmountCents,
      fee_percentage: financedInvoice?.transactionFeePercentage * 100,
      repayment_schedule: {
        repayment_date:
          financedInvoice?.repaymentSchedule?.schedule?.[0]?.repaymentDate,
        repayment_amount:
          financedInvoice?.repaymentSchedule?.schedule?.[0]
            ?.repaymentAmountCents,
        repayment_fee_amount:
          financedInvoice?.repaymentSchedule?.schedule?.[0]
            ?.repaymentFeeAmountCents,
        repayment_principal_amount:
          financedInvoice?.repaymentSchedule?.schedule?.[0]
            ?.repaymentPrincipalAmountCents,
      },
    };

    api.financingInvoices.getFinancingInvoices.setQueryData(
      api.financingInvoices.getFinancingInvoices.getQueryKey({
        query: {
          type: 'receivable',
          invoice_id: financedInvoice?.platformInvoiceId,
        },
      }),
      (data) => {
        return {
          ...data,
          data: [newFinancedInvoice],
        };
      },
      queryClient
    );

    api.financingInvoices.getFinancingInvoices.setQueryData(
      api.financingInvoices.getFinancingInvoices.getQueryKey({ query: {} }),
      (data) => {
        const currentData = data?.data ? data.data : [];
        return {
          ...data,
          data: [newFinancedInvoice, ...currentData],
        };
      },
      queryClient
    );
  };

  const initialiseFinanceSdk = ({ connectToken }: { connectToken: string }) => {
    window?.KANMON_CONNECT?.start({
      connectToken,
      onEvent: (event) => {
        if (
          event.eventType !== 'USER_STATE_CHANGED' &&
          event.eventType !== 'USER_CONFIRMED_INVOICE'
        )
          return;

        if (event.eventType === 'USER_CONFIRMED_INVOICE') {
          refreshFinancedInvoices(event.data.invoice);
        } else {
          switch (event.data.userState) {
            case 'START_FLOW':
              handleButtonText(t(i18n)`Apply for financing`);
              break;
            case 'USER_INPUT_REQUIRED':
              if (event.data.section === 'OFFER') {
                handleButtonText(t(i18n)`Review terms and sign`);
              } else {
                handleButtonText(t(i18n)`Resume application`);
              }
              break;
            case 'WAITING_FOR_OFFERS':
              handleButtonText('');
              if (
                (finance?.business_status === 'INPUT_REQUIRED' ||
                  finance?.business_status === 'NEW') &&
                componentSettings?.onboarding
                  ?.onWorkingCapitalOnboardingComplete
              ) {
                componentSettings?.onboarding?.onWorkingCapitalOnboardingComplete(
                  entityId
                );
              }
              break;
            case 'OFFERS_EXPIRED':
            case 'NO_OFFERS_EXTENDED':
              handleButtonText('');
              break;
            case 'SERVICING':
              handleButtonText(t(i18n)`Financing menu`);
              if (
                finance?.business_status === 'ONBOARDED' &&
                finance?.offers?.[0]?.status === 'NEW'
              ) {
                window.localStorage.setItem('isFinanceTabNew', 'true');
              }
              break;
            case 'VIEW_OFFERS':
            case 'OFFER_ACCEPTED':
              handleButtonText(t(i18n)`Review terms and sign`);
              break;
            default:
              break;
          }
          api.financingOffers.getFinancingOffers.invalidateQueries(queryClient);
        }
      },
    });
  };

  useEffect(() => {
    const setupFinanceSdkConnection = async () => {
      setIsInitializing(true);
      try {
        const response = await getConnectToken.mutateAsync();

        initialiseFinanceSdk({ connectToken: response.connect_token });
        toggleKanmon(true);
      } catch {
        // Intentionally left empty
      } finally {
        setIsInitializing(false);
      }
    };

    if (!isKanmonInitialized && !scriptLoading && isUSEntity) {
      setupFinanceSdkConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoading, isUSEntity]);

  const isLoading = scriptLoading || isInitializing;
  const isEnabled = isUSEntity;
  const isServicing =
    finance?.business_status === 'ONBOARDED' &&
    finance?.offers?.[0]?.status === 'CURRENT';
  const offer = finance?.offers?.[0];

  return {
    buttonText,
    applicationState,
    offer,
    isLoading,
    isEnabled,
    isServicing,
  };
};
