import { useState, useCallback } from 'react';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { useStripeBankAccountAPI } from './useStripeBankAccountAPI';
import type {
  StripeBankAccountVerificationComponentDataResponse,
  VerificationStatusResponse
} from './types';

export function useStripeBankAccountVerification() {
  const { i18n } = useLingui();
  const { startVerification: apiStartVerification, getVerificationStatus: apiGetVerificationStatus } = useStripeBankAccountAPI();
  const [isStarting, setIsStarting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [componentData, setComponentData] = useState<StripeBankAccountVerificationComponentDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startVerification = useCallback(async () => {
    setIsStarting(true);
    setError(null);

    try {
      const data = await apiStartVerification();
      setComponentData(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : t(i18n)`Failed to start bank account verification`;
      setError(message);
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [apiStartVerification, i18n]);

  const checkVerificationStatus = useCallback(
    async (setupIntentId: string): Promise<VerificationStatusResponse | null> => {
      setIsChecking(true);
      setError(null);

      try {
        const status = await apiGetVerificationStatus(setupIntentId);
        return status;
      } catch (err) {
        const message = err instanceof Error ? err.message : t(i18n)`Failed to check verification status`;
        setError(message);
        return null;
      } finally {
        setIsChecking(false);
      }
    },
    [apiGetVerificationStatus, i18n]
  );

  const reset = useCallback(() => {
    setComponentData(null);
    setError(null);
  }, []);

  return {
    startVerification,
    checkVerificationStatus,
    isStarting,
    isChecking,
    componentData,
    error,
    reset,
  };
}