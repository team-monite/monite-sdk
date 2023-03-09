import React from 'react';
import { OnboardingBankAccount } from '@team-monite/sdk-api';

import useOnboardingTranslateField from '../../hooks/useOnboardingTranslateField';

import {
  OnboardingViewRow,
  OnboardingViewTable,
  StyledWrap,
} from '../OnboardingReviewStyles';

export default function OnboardingBankAccountView({
  country,
  currency,
  iban,
}: OnboardingBankAccount) {
  const t = useOnboardingTranslateField<OnboardingBankAccount>('bankAccount');

  return (
    <StyledWrap>
      <OnboardingViewTable>
        <OnboardingViewRow label={t('country')} value={country} />
        <OnboardingViewRow label={t('currency')} value={currency} />
        <OnboardingViewRow label={t('iban')} value={iban} />
      </OnboardingViewTable>
    </StyledWrap>
  );
}
