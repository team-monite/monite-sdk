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

export enum OnboardingBusinessTypeFixture {
  emptyIndividual = 'emptyIndividual',
}

const prepareCache = (
  type: OnboardingBusinessTypeFixture,
  payload?: OnboardingDataPayload
): OnboardingDataPayload | undefined => {
  const onboarding = localStorage.getItem('onboarding');
  const cache: OnboardingDataPayload | undefined =
    onboarding && JSON.parse(onboarding);

  if (!payload) return cache;

  if (!!payload.tos_acceptance_date) {
    localStorage.removeItem('onboarding');
    return undefined;
  }

  const res = {
    ...cache,
    ...payload,
  };

  localStorage.setItem('onboarding', JSON.stringify(res));

  return res;
};

export const onboardingIndividualFixture = (
  type: OnboardingBusinessTypeFixture,
  payload?: OnboardingDataPayload
): OnboardingIndividualResponse => {
  const cache = prepareCache(type, payload);

  return {
    business_type: OnboardingBusinessType.INDIVIDUAL,
    requirements: getRequirements(cache),
    data: cache || {
      [OnboardingRequirement.INDIVIDUAL]: getIndividual(),
      [OnboardingRequirement.BUSINESS_PROFILE]: getBusinessProfile(),
      [OnboardingRequirement.BANK_ACCOUNT]: getBankAccount(),
      [OnboardingRequirement.TOS_ACCEPTANCE_DATE]: '',
    },
  };
};

const getRequirements = (
  payload?: OnboardingDataPayload
): OnboardingRequirement[] => {
  if (!payload || payload.individual?.first_name === '')
    return [
      OnboardingRequirement.INDIVIDUAL,
      OnboardingRequirement.BANK_ACCOUNT,
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  if (payload.business_profile?.mcc !== '')
    return [OnboardingRequirement.TOS_ACCEPTANCE_DATE];

  if (payload.bank_account?.iban !== '')
    return [
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  if (payload.individual?.first_name !== '')
    return [
      OnboardingRequirement.BANK_ACCOUNT,
      OnboardingRequirement.BUSINESS_PROFILE,
      OnboardingRequirement.TOS_ACCEPTANCE_DATE,
    ];

  return [];
};

const getBusinessProfile = (
  businessProfile?: Partial<OnboardingBusinessProfile>
): OnboardingBusinessProfile => ({
  mcc: '',
  url: '',
  ...businessProfile,
});

const getBankAccount = (
  bankAccount?: Partial<OnboardingBankAccount>
): OnboardingBankAccount => ({
  country: '',
  currency: '',
  iban: '',
  ...bankAccount,
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
  ssn_last_4: '',
  ...individual,
  address: getAddress(individual?.address),
});
