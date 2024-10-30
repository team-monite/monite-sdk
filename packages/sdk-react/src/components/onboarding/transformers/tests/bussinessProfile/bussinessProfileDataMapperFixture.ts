import { components } from '@monite/sdk-api/src/api';

import type { OnboardingTestData } from '../../../types';

function getBusinessProfile(): BusinessProfile {
  return {
    mcc: '7311',
    url: 'https://monite.com',
  };
}

export const onboardingBusinessProfileMixedFixture = (): OnboardingTestData<
  Omit<OnboardingBusinessProfile, 'operating_countries'>,
  Omit<BusinessProfile, 'operating_countries'>
> => {
  return {
    values: getBusinessProfile(),
    fields: {
      mcc: {
        required: true,
        error: {
          message: 'error',
        },
        value: '7311',
      },
      url: {
        required: false,
        error: null,
        value: 'https://monite.com',
      },
    },
    errors: [
      {
        code: 'mcc',
        message: 'error',
      },
    ],
  };
};

type BusinessProfile = components['schemas']['BusinessProfile'];
type OnboardingBusinessProfile =
  components['schemas']['OnboardingBusinessProfile'];
