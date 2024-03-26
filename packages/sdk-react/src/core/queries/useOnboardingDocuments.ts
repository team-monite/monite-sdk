import type { ErrorType } from '@/core/queries/types';
import {
  AllowedCountries,
  ApiError,
  type EntityOnboardingDocumentsPayload,
  type OnboardingDocumentsDescriptions,
  type PersonOnboardingDocumentsPayload,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

export const ONBOARDING_DOCUMENT_QUERY = 'onboarding_documents';

const documentQueryKeys = {
  all: () => [ONBOARDING_DOCUMENT_QUERY],
  descriptions: (country?: AllowedCountries) =>
    country
      ? [...documentQueryKeys.all(), 'descriptions', country]
      : [...documentQueryKeys.all(), 'descriptions'],
};

export const useCreateEntityDocuments = () => {
  const { monite } = useMoniteContext();

  return useMutation<
    EntityOnboardingDocumentsPayload,
    ApiError,
    EntityOnboardingDocumentsPayload
  >({
    mutationFn: async (payload) => {
      await monite.api.onboardingDocuments.createEntityDocuments(payload);

      return payload;
    },
  });
};

export const useCreatePersonDocumentsById = () => {
  const { monite } = useMoniteContext();

  return useMutation<
    PersonOnboardingDocumentsPayload,
    ApiError,
    {
      personId: string;
      payload: PersonOnboardingDocumentsPayload;
    }
  >({
    mutationFn: async ({ personId, payload }) => {
      await monite.api.onboardingDocuments.createPersonDocumentsById(
        personId,
        payload
      );

      return payload;
    },
  });
};

export const useDocumentDescriptions = (country?: AllowedCountries) => {
  const { monite } = useMoniteContext();

  return useQuery<OnboardingDocumentsDescriptions | undefined, ErrorType>({
    queryKey: documentQueryKeys.descriptions(country),

    queryFn: () => {
      if (!country) {
        throw new Error('Country is not provided');
      }

      return monite.api.onboardingDocuments.getDocumentDescriptions(country);
    },

    enabled: !!country,
  });
};
