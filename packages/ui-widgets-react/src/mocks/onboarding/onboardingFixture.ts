import {
  OnboardingBusinessProfile,
  OnboardingIndividualResponse,
  OnboardingIndividual,
  OnboardingRequirement,
  OnboardingBankAccount,
  OnboardingAddress,
  OnboardingBusinessType,
  OnboardingDataPayload,
} from '@team-monite/sdk-api';

// type OnboardingIndividualFixture = {
//   requirements?: OnboardingRequirement[];
//   data?: OnboardingData;
// };
//
// type OnboardingFixtureProps = {
//   type: OnboardingBusinessType;
// };

export enum OnboardingBusinessTypeFixture {
  emptyIndividual = 'emptyIndividual',
}

export const onboardingIndividualFixture = (
  type: OnboardingBusinessTypeFixture,
  payload?: OnboardingDataPayload
): OnboardingIndividualResponse => {
  const {
    individual,
    business_profile,
    bank_account,
    tos_acceptance_date,
  }: OnboardingDataPayload = payload || {};

  return {
    business_type: OnboardingBusinessType.INDIVIDUAL,
    requirements: getRequirements(payload),
    data: {
      [OnboardingRequirement.INDIVIDUAL]: getIndividual(individual),
      [OnboardingRequirement.BUSINESS_PROFILE]:
        getBusinessProfile(business_profile),
      [OnboardingRequirement.BANK_ACCOUNT]: getBankAccount(bank_account),
      [OnboardingRequirement.TOS_ACCEPTANCE_DATE]: tos_acceptance_date || '',
    },
  };
};

const getRequirements = (
  payload?: OnboardingDataPayload
): OnboardingRequirement[] => {
  if (!payload)
    return [
      OnboardingRequirement.INDIVIDUAL,
      OnboardingRequirement.BANK_ACCOUNT,
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  if (payload.individual)
    return [
      OnboardingRequirement.BANK_ACCOUNT,
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  if (payload.bank_account)
    return [
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  if (payload.business_profile)
    return [OnboardingRequirement.TOS_ACCEPTANCE_DATE];

  return [];
};

const getBusinessProfile = (
  businessProfile?: Partial<OnboardingBusinessProfile>
): OnboardingBusinessProfile => ({
  mcc: businessProfile?.mcc || '',
  url: businessProfile?.url || '',
});

const getBankAccount = (
  bankAccount?: Partial<OnboardingBankAccount>
): OnboardingBankAccount => ({
  country: bankAccount?.country || '',
  currency: bankAccount?.currency || '',
  iban: bankAccount?.iban || '',
});

const getAddress = (
  address?: Partial<OnboardingAddress>
): OnboardingAddress => ({
  line1: '',
  line2: '',
  city: '',
  // state: address?.state || '',
  postal_code: '',
  country: '',
  ...address,
});

const getIndividual = (
  individual?: Partial<OnboardingIndividual>
): OnboardingIndividual => ({
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  phone: '',
  // id_number: '',
  // ssn_last_4: '',
  ...individual,
  address: getAddress(individual?.address),
});
