import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, styled } from '@mui/material';

import mccCodes from '../dicts/mccCodes';
import countries from '../dicts/countries';
import currencies from '../dicts/currencies';

import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';

import OnboardingFormActions from '../OnboardingLayout/OnboardingFormActions';
import OnboardingSubTitle from '../OnboardingLayout/OnboardingSubTitle';
import OnboardingBusinessRepresentativeView from './OnboardingBusinessRepresentativeView';
import OnboardingBankAccountView from './OnboardingBankAccountView';
import OnboardingBusinessProfileView from './OnboardingBusinessProfileView';
import {
  getLocalRequirements,
  LocalRequirements,
} from '../hooks/useOnboardingRequirements';

const StyledLink = styled(Link)`
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
`;

const OnboardingReview = ({ linkId }: OnboardingFormProps) => {
  const { t } = useTranslation();
  const { isLoading, onboarding, actions, submitLabel, setCurrentRequirement } =
    useOnboardingForm(linkId);

  if (!onboarding) return null;

  const list = getLocalRequirements(onboarding.business_type).filter(
    ({ key }) => key !== LocalRequirements.review
  );

  const translateTitle = (key: string): string =>
    t(`onboarding:${key}Step.title`);

  const {
    data: { individual, bank_account, business_profile },
  } = onboarding;

  const addressCountry = countries.find(
    ({ code }) => code === individual?.address?.country
  )?.label;

  const bankAccountCountry = countries.find(
    ({ code }) => code === bank_account?.country
  )?.label;

  const bankAccountCurrency = currencies.find(
    ({ code }) => code === bank_account?.currency
  )?.label;

  const mcc = mccCodes.find(
    ({ code }) => `${code}` === `${business_profile?.mcc}`
  )?.label;

  return (
    <OnboardingForm
      actions={
        <OnboardingFormActions
          submitLabel={submitLabel}
          isLoading={isLoading}
          {...actions}
        />
      }
    >
      {list.map(({ key }) => (
        <OnboardingStepContent key={key}>
          <OnboardingSubTitle
            action={
              <StyledLink
                underline={'none'}
                onClick={() => setCurrentRequirement(key)}
              >
                {t('onboarding:actions.edit')}
              </StyledLink>
            }
          >
            {translateTitle(key)}
          </OnboardingSubTitle>

          {key === LocalRequirements.businessRepresentative && (
            <OnboardingBusinessRepresentativeView
              {...individual}
              address={{
                ...individual?.address,
                country: addressCountry,
              }}
            />
          )}

          {key === LocalRequirements.bankAccount && (
            <OnboardingBankAccountView
              {...bank_account}
              country={bankAccountCountry}
              currency={bankAccountCurrency}
            />
          )}

          {key === LocalRequirements.businessProfile && (
            <OnboardingBusinessProfileView {...business_profile} mcc={mcc} />
          )}
        </OnboardingStepContent>
      ))}
    </OnboardingForm>
  );
};

export default OnboardingReview;
