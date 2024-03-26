import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AllowedCountries, OnboardingAddress } from '@monite/sdk-api';

import { getRegionName } from '../../utils';
import { OnboardingViewRow } from '../OnboardingReviewStyles';

export function OnboardingAddressView({
  country,
  line1,
  line2,
  city,
  state,
  postal_code,
}: OnboardingAddress) {
  const { i18n } = useLingui();

  const countryField = {
    required: !!country?.required,
    value: t(i18n)`${getRegionName(country?.value as AllowedCountries)}`,
    error: country?.error,
  };

  return (
    <>
      <OnboardingViewRow label={t(i18n)`Country`} field={countryField} />
      <OnboardingViewRow label={t(i18n)`Line 1`} field={line1} />
      <OnboardingViewRow label={t(i18n)`Line 2`} field={line2} />
      <OnboardingViewRow label={t(i18n)`City`} field={city} />
      <OnboardingViewRow label={t(i18n)`State`} field={state} />
      <OnboardingViewRow label={t(i18n)`Postal code`} field={postal_code} />
    </>
  );
}
