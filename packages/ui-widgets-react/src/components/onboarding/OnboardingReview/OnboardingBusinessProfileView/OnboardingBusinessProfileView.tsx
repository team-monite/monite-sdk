import React from 'react';

import { OnboardingBusinessProfile } from '@team-monite/sdk-api';

import useOnboardingTranslateField from '../../hooks/useOnboardingTranslateField';
import {
  OnboardingViewRow,
  OnboardingViewTable,
  StyledWrap,
} from '../OnboardingReviewStyles';

export default function OnboardingBusinessProfileView({
  mcc,
  url,
}: OnboardingBusinessProfile) {
  const t =
    useOnboardingTranslateField<OnboardingBusinessProfile>('businessProfile');

  return (
    <StyledWrap>
      <OnboardingViewTable>
        <OnboardingViewRow label={t('mcc')} value={mcc} />
        <OnboardingViewRow label={t('url')} value={url} />
      </OnboardingViewTable>
    </StyledWrap>
  );
}
