import {
  VERIFICATION_POLLING_INTERVAL_MS,
  VERIFICATION_POLLING_STALE_TIME_MS,
} from './consts';
import type {
  StripeBankAccountVerificationComponentDataResponse,
  VerificationStatusResponse,
} from './types';
import { apiVersion } from '@/api/api-version';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * React Query-based hook for Stripe bank account verification
 * Uses custom fetch implementation with proper entity ID headers since
 * the /internal endpoints are excluded from automatic header injection
 *
 * @param userCanceled - Whether the user has canceled the verification
 * @param externalSetupIntentId - Optional setup intent ID from URL redirect (for redirect recovery)
 */
export const useStripeBankAccountVerificationQuery = (
  userCanceled: boolean = false,
  externalSetupIntentId?: string | null
) => {
  const { apiUrl, fetchToken, entityId, queryClient } = useMoniteContext();

  const callInternalAPI = async <T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const tokenData = await fetchToken();
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-monite-version': apiVersion,
        'x-monite-entity-id': entityId,
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API call failed: ${response.status}`
      );
    }

    return response.json();
  };

  const startVerificationMutation = useMutation(
    {
      mutationFn: () =>
        callInternalAPI<StripeBankAccountVerificationComponentDataResponse>(
          '/internal/stripe-bank-account-verification/start',
          {
            method: 'POST',
            body: JSON.stringify({}),
          }
        ),
      onError: (error) => {
        console.error(
          'Failed to start Treasury bank account verification:',
          error
        );
      },
    },
    queryClient
  );

  // Use external setup_intent_id if provided (for redirect recovery),
  // otherwise use the one from the mutation
  const setupIntentId =
    externalSetupIntentId || startVerificationMutation.data?.setup_intent_id;

  const verificationStatusQuery = useQuery<VerificationStatusResponse>(
    {
      queryKey: ['stripe-bank-verification-status', setupIntentId],
      queryFn: () =>
        callInternalAPI<VerificationStatusResponse>(
          `/internal/stripe-bank-account-verification/status/${setupIntentId}`
        ),
      enabled: !!setupIntentId && !userCanceled,
      refetchInterval: (query) => {
        if (userCanceled) {
          return false;
        }

        const responseData = query.state.data;

        if (
          responseData?.status &&
          ['succeeded', 'failed', 'canceled'].includes(responseData.status)
        ) {
          return false;
        }
        if (
          responseData?.status &&
          [
            'requires_payment_method',
            'requires_confirmation',
            'processing',
          ].includes(responseData.status)
        ) {
          return VERIFICATION_POLLING_INTERVAL_MS;
        }
        return false;
      },
      staleTime: VERIFICATION_POLLING_STALE_TIME_MS,
      retry: (failureCount) => {
        if (failureCount < 3) {
          return true;
        }
        return false;
      },
    },
    queryClient
  );

  const reset = () => {
    startVerificationMutation.reset();
    // Note: The status query will automatically reset when the setup_intent_id changes
  };

  return {
    startVerification: startVerificationMutation.mutate,
    startVerificationAsync: startVerificationMutation.mutateAsync,
    isStarting: startVerificationMutation.isPending,
    startError: startVerificationMutation.error?.message || null,

    componentData: startVerificationMutation.data,

    verificationStatus: verificationStatusQuery.data,
    isCheckingStatus: verificationStatusQuery.isFetching,
    statusError: verificationStatusQuery.error?.message || null,

    isVerificationComplete:
      verificationStatusQuery.data?.status === 'succeeded',
    isVerificationFailed:
      verificationStatusQuery.data?.status === 'failed' ||
      verificationStatusQuery.data?.status === 'canceled',

    error:
      startVerificationMutation.error?.message ||
      verificationStatusQuery.error?.message ||
      null,

    reset,
  };
};
