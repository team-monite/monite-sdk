import { useMemo } from 'react';
import { useMoniteContext } from '../context/MoniteContext';
import { transformOnboardingRequirements } from '@/components/onboarding/services/OnboardingRequirementsTransformer';
import type { OnboardingRequirementExtended } from '@/components/onboarding/types';
import type { components } from '@/api';



/**
 * Extended InternalOnboardingRequirementsResponse type that includes Treasury fields.
 * 
 * The backend already returns Treasury data from GET /onboarding_requirements, but the
 * OpenAPI schema hasn't been updated yet to include these fields in the type definitions.
 * 
 * This interface extends the base response type to include:
 * - 'treasury_tos_acceptance' in the requirements array
 * - treasury_tos_acceptance data fields (date, ip)
 * 
 * TODO: Remove this extended type once the OpenAPI schema is updated to include Treasury fields.
 */
interface OnboardingFieldData {
  error: { message: string } | null;
  required: boolean;
  value: string | null;
}

interface ExtendedOnboardingDataFields {
  entity?: Record<string, OnboardingFieldData>;
  business_profile?: Record<string, OnboardingFieldData>;
  tos_acceptance?: Record<string, OnboardingFieldData>;
  treasury_tos_acceptance?: Record<string, OnboardingFieldData>;
  bank_accounts?: Array<Record<string, OnboardingFieldData>>;
  persons?: components['schemas']['OnboardingPerson'][];
  [key: string]: unknown;
}

export interface ExtendedOnboardingRequirementsResponse {
  requirements: OnboardingRequirementExtended[];
  data?: ExtendedOnboardingDataFields;
}

/**
 * Adapter hook that uses the main onboarding_requirements endpoint instead of the frontend one.
 * This provides access to Treasury requirements that are currently missing from the frontend endpoint.
 * 
 * TODO: Remove this adapter once the frontend endpoint is fixed to include Treasury fields.
 */
export const useOnboardingRequirementsWithTreasury = () => {
  const { api } = useMoniteContext();

  const mainQuery = api.onboardingRequirements.getOnboardingRequirements.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const transformedData = useMemo((): ExtendedOnboardingRequirementsResponse | undefined => {
    const apiResponse = mainQuery.data;
    
    if (!apiResponse?.data?.length) {
      return undefined;
    }

    const firstMethodRequirements = apiResponse.data[0];
    
    if (!firstMethodRequirements?.requirements) {
      return undefined;
    }

    const currently_due = firstMethodRequirements.requirements.currently_due;
    const requirements_errors = firstMethodRequirements.requirements_errors;

    const { requirements: standardRequirements, data: dataFields } = transformOnboardingRequirements(
      currently_due,
      requirements_errors
    );

    const transformedResponse: ExtendedOnboardingRequirementsResponse = {
      requirements: standardRequirements as OnboardingRequirementExtended[],
      data: dataFields as ExtendedOnboardingDataFields
    };

    return transformedResponse;
  }, [mainQuery.data]);

  return {
    ...mainQuery,
    data: transformedData,
  };
};

/**
 * Hook to check if Treasury requirements are present in the onboarding data.
 * This is useful for components that need to conditionally show Treasury-specific UI.
 */
export const useTreasuryRequirements = () => {
  const { data } = useOnboardingRequirementsWithTreasury();
  
  return useMemo(() => {
    const hasTreasuryRequirement = data?.requirements.includes('treasury_tos_acceptance') ?? false;
    const treasuryData = data?.data?.treasury_tos_acceptance;
    
    return {
      hasTreasuryRequirement,
      treasuryData,
      isDateRequired: treasuryData?.date?.required ?? false,
      isIpRequired: treasuryData?.ip?.required ?? false,
    };
  }, [data]);
};
