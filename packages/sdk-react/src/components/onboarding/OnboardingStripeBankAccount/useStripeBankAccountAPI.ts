import { treasuryConfig } from '../services/TreasuryConfig';
import {
  StripeBankAccountVerificationComponentDataResponse,
  VerificationStatusResponse,
} from './types';
import { apiVersion } from '@/api/api-version';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCallback } from 'react';

interface UseStripeBankAccountAPIReturn {
  startVerification: () => Promise<StripeBankAccountVerificationComponentDataResponse>;
  getVerificationStatus: (
    setupIntentId: string
  ) => Promise<VerificationStatusResponse>;
}

/**
 * Custom hook for making API calls to Stripe bank account verification endpoints.
 * Uses the standard Monite request pattern with automatic header injection.
 */
export function useStripeBankAccountAPI(): UseStripeBankAccountAPIReturn {
  const { apiUrl, entityId, fetchToken } = useMoniteContext();

  const makeRequest = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const token = await fetchToken();
      const { access_token: accessToken, token_type: tokenType } = token;

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-monite-version': apiVersion,
          'x-monite-entity-id': entityId,
          Authorization: `${tokenType} ${accessToken}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `Request failed with status ${response.status}`
        );
      }

      return response.json();
    },
    [apiUrl, entityId, fetchToken]
  );

  const startVerification = useCallback(async () => {
    treasuryConfig.debug('Starting bank account verification');
    return makeRequest<StripeBankAccountVerificationComponentDataResponse>(
      '/internal/stripe-bank-account-verification/start',
      { method: 'POST', body: '{}' }
    );
  }, [makeRequest]);

  const getVerificationStatus = useCallback(
    async (setupIntentId: string) => {
      treasuryConfig.debug('Getting verification status', { setupIntentId });
      return makeRequest<VerificationStatusResponse>(
        `/internal/stripe-bank-account-verification/status/${setupIntentId}`,
        { method: 'GET' }
      );
    },
    [makeRequest]
  );

  return {
    startVerification,
    getVerificationStatus,
  };
}
