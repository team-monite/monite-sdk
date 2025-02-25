import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { Services } from '@/api';

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
const KANMON_CONNECT_SCRIPT_URL_PRODUCTION = `https://cdn.sandbox.kanmon.dev/scripts/v2/kanmon-connect.js`;

type startFinanceSessionOptions = {
  sessionToken?: string;
  component?: string;
};

declare global {
  interface Window {
    KANMON_CONNECT:
      | {
          start: (options: {
            connectToken: string;
            onEvent: (event: {
              eventType: string;
              data: { actionMessage: string; actionRequired: boolean };
            }) => void;
          }) => void;
          show: (options?: startFinanceSessionOptions) => void;
          stop: () => void;
        }
      | undefined;
  }
}

export const useFinancing = () => {
  const { apiUrl } = useMoniteContext();
  const [displayButtonMessage, setDisplayButtonMessage] = useState('');
  const [actionRequired, setActionRequired] = useState(false);
  const getConnectToken = useGetFinancingConnectToken();
  const { isUSEntity, isLoading: isUSEntityLoading } = useMyEntity();

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
  const [isFetchingConnectToken, setIsFetchingConnectToken] = useState(true);

  const startFinanceSession = ({
    sessionToken,
    component,
  }: startFinanceSessionOptions = {}) => {
    window?.KANMON_CONNECT?.show({ sessionToken, component });
  };

  const initialiseFinanceSdk = ({ connectToken }: { connectToken: string }) => {
    setIsInitializing(true);
    window?.KANMON_CONNECT?.start({
      connectToken,
      onEvent: (event) => {
        switch (event.eventType) {
          case 'USER_STATE_CHANGED':
            setIsInitializing(false);
            setDisplayButtonMessage(event.data.actionMessage);
            setActionRequired(event.data.actionRequired);
            break;
          default:
            setIsInitializing(false);
        }
      },
    });
  };

  const stopFinanceSession = () => {
    window?.KANMON_CONNECT?.stop();
  };

  useEffect(() => {
    const setupFinanceSdkConnection = async () => {
      try {
        if (scriptLoading || !isUSEntity) {
          return;
        }
        const response = await getConnectToken.mutateAsync();

        initialiseFinanceSdk({ connectToken: response.connect_token });
      } catch {
        // Intentionally left empty
      } finally {
        setIsFetchingConnectToken(false);
      }
    };

    setupFinanceSdkConnection();

    return () => {
      stopFinanceSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoading, isUSEntity]); // Escaped the eslint rule to avoid unnecessary dependencies from causing the hook to re-run

  const isLoading = isFetchingConnectToken || isUSEntityLoading;
  const isEnabled = isUSEntity;

  return {
    displayButtonMessage,
    actionRequired,
    startFinanceSession,
    isInitializing,
    isLoading,
    isEnabled,
  };
};
