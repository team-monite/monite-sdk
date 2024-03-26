import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  EntityOnboardingDataRequest,
  EntityOnboardingDataResponse,
} from '@monite/sdk-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ErrorType } from './types';

export const useUpdateEntityOnboardingData = () => {
  const { monite } = useMoniteContext();

  return useMutation<
    EntityOnboardingDataResponse,
    ErrorType,
    EntityOnboardingDataRequest
  >((payload) =>
    monite.api.entity.patchOnboardingData(monite.entityId, payload)
  );
};
