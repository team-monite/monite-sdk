import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { components, Services } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useMoniteContext } from '../context/MoniteContext';
import { useMyEntity } from './useMe';

export const FINANCING_LABEL = 'My Financing';

export const useGetFinancedInvoices = (
  query: Services['financingInvoices']['getFinancingInvoices']['types']['parameters']['query'],
  enabled = true
) => {
  const { api } = useMoniteContext();

  return api.financingInvoices.getFinancingInvoices.useQuery(
    {
      query,
    },
    { enabled }
  );
};

export const useFinanceAnInvoice = () => {
  const { api } = useMoniteContext();

  return api.financingInvoices.postFinancingInvoices.useMutation(
    {},
    {
      onError: () => {},
    }
  );
};

export const useGetFinancingConnectToken = () => {
  const { api } = useMoniteContext();

  return api.financingTokens.postFinancingTokens.useMutation(
    {},
    {
      onError: () => {},
    }
  );
};

export const useGetFinanceOffers = () => {
  const { api } = useMoniteContext();

  return api.financingOffers.getFinancingOffers.useQuery();
};

const KANMON_CONNECT_SCRIPT_URL_SANDBOX = `https://cdn.sandbox.kanmon.dev/scripts/v2/kanmon-connect.js`;
const KANMON_CONNECT_SCRIPT_URL_PRODUCTION = `https://cdn.kanmon.dev/scripts/v2/kanmon-connect.js`;

type startFinanceSessionOptions = {
  sessionToken?: string;
  component?: string;
};

export enum ApplicationState {
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
  isInitializing: boolean;
  isLoading: boolean;
  isEnabled: boolean;
  isServicing: boolean;
};

declare global {
  interface Window {
    KANMON_CONNECT:
      | {
          start: (options: {
            connectToken: string;
            onEvent: (event: {
              eventType: string;
              data: {
                actionMessage: string;
                actionRequired: boolean;
                section: string;
                userState: string;
              };
            }) => void;
          }) => void;
          show: (options?: startFinanceSessionOptions) => void;
          stop: () => void;
        }
      | undefined;
  }
}

export const startFinanceSession = ({
  sessionToken,
  component,
}: startFinanceSessionOptions = {}) => {
  window?.KANMON_CONNECT?.show({ sessionToken, component });
};

export const useFinancing = () => {
  const { apiUrl, api, queryClient, componentSettings, entityId } =
    useMoniteContext();
  const { i18n } = useLingui();
  const [buttonText, setButtonText] = useState('');
  const getConnectToken = useGetFinancingConnectToken();
  const { data: finance } = useGetFinanceOffers();
  const { isUSEntity, isLoading: isUSEntityLoading } = useMyEntity();

  const handleApplicationState = () => {
    switch (finance?.business_status) {
      case 'NEW':
      default:
        return ApplicationState.INIT;
      case 'INPUT_REQUIRED':
        return ApplicationState.IN_PROGRESS;
      case 'ONBOARDED':
        if (finance?.offers?.length === 0) {
          return ApplicationState.PENDING_APPROVAL;
        }

        if (finance?.offers?.[0]?.status === 'NEW') {
          return ApplicationState.APPROVED;
        }

        if (finance?.offers?.[0]?.status === 'EXPIRED') {
          return ApplicationState.OFFERS_EXPIRED;
        }

        if (finance?.offers?.[0]?.status === 'ACCEPTED') {
          return ApplicationState.OFFER_ACCEPTED;
        }

        return ApplicationState.SERVICING;
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

  const initialiseFinanceSdk = ({ connectToken }: { connectToken: string }) => {
    window?.KANMON_CONNECT?.start({
      connectToken,
      onEvent: (event) => {
        if (event.eventType !== 'USER_STATE_CHANGED') return;

        switch (event.data.userState) {
          case 'START_FLOW':
            setButtonText(t(i18n)`Apply for financing`);
            break;
          case 'USER_INPUT_REQUIRED':
            if (event.data.section === 'OFFER') {
              setButtonText(t(i18n)`View terms and sign`);
            } else {
              setButtonText(t(i18n)`Resume application`);
            }
            break;
          case 'WAITING_FOR_OFFERS':
            setButtonText('');
            if (
              (finance?.business_status === 'INPUT_REQUIRED' ||
                finance?.business_status === 'NEW') &&
              componentSettings?.onboarding?.onWorkingCapitalOnboardingComplete
            ) {
              componentSettings?.onboarding?.onWorkingCapitalOnboardingComplete(
                entityId
              );
            }
            break;
          case 'OFFERS_EXPIRED':
          case 'NO_OFFERS_EXTENDED':
            setButtonText('');
            break;
          case 'SERVICING':
            setButtonText(t(i18n)`Financing menu`);
            if (
              finance?.business_status === 'ONBOARDED' &&
              finance?.offers?.[0]?.status === 'NEW'
            ) {
              window.localStorage.setItem('isFinanceTabNew', 'true');
            }
            break;
          case 'VIEW_OFFERS':
          case 'OFFER_ACCEPTED':
            setButtonText(t(i18n)`View terms and sign`);
            break;
          default:
            break;
        }
        api.financingOffers.getFinancingOffers.invalidateQueries(queryClient);
      },
    });
  };

  const stopFinanceSession = () => {
    window?.KANMON_CONNECT?.stop();
  };

  useEffect(() => {
    const setupFinanceSdkConnection = async () => {
      setIsInitializing(true);
      try {
        if (scriptLoading || !isUSEntity) {
          return;
        }
        const response = await getConnectToken.mutateAsync();

        initialiseFinanceSdk({ connectToken: response.connect_token });
      } catch {
        // Intentionally left empty
      } finally {
        setIsInitializing(false);
      }
    };

    setupFinanceSdkConnection();

    return () => {
      stopFinanceSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoading, isUSEntity]);

  const isLoading = isInitializing || isUSEntityLoading;
  const isEnabled = isUSEntity;
  const isServicing =
    finance?.business_status === 'ONBOARDED' &&
    finance?.offers?.[0]?.status === 'CURRENT';
  const offer = finance?.offers?.[0];

  return {
    buttonText,
    applicationState,
    offer,
    isInitializing,
    isLoading,
    isEnabled,
    isServicing,
  };
};
