import React from 'react';
import { OnboardingAddress, OnboardingIndividual } from '@team-monite/sdk-api';

import { LocalRequirements } from '../../useOnboardingStep';
import useOnboardingTranslateTitle from '../../hooks/useOnboardingTranslateTitle';
import useOnboardingTranslateField from '../../hooks/useOnboardingTranslateField';

import {
  OnboardingViewRow,
  OnboardingViewLabel,
  OnboardingViewTable,
  StyledWrap,
} from '../OnboardingReviewStyles';

export default function OnboardingBusinessRepresentativeView({
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  ssn_last_4,
  id_number,
  address,
}: OnboardingIndividual) {
  const translateTitle = useOnboardingTranslateTitle(
    LocalRequirements.businessRepresentative
  );

  const translateIndividualField =
    useOnboardingTranslateField<OnboardingIndividual>('individual');

  const translateAddressField =
    useOnboardingTranslateField<OnboardingAddress>('address');

  if (!address) return null;

  const { country, line1, line2, city, state, postal_code } = address;

  return (
    <StyledWrap>
      <OnboardingViewTable>
        <OnboardingViewLabel>{translateTitle('legalName')}</OnboardingViewLabel>
        <OnboardingViewRow
          label={translateIndividualField('first_name')}
          value={first_name}
        />
        <OnboardingViewRow
          label={translateIndividualField('last_name')}
          value={last_name}
        />
      </OnboardingViewTable>

      <OnboardingViewTable>
        <OnboardingViewRow
          label={translateIndividualField('email')}
          value={email}
        />
        <OnboardingViewRow
          label={translateIndividualField('phone')}
          value={phone}
        />
        <OnboardingViewRow
          label={translateIndividualField('date_of_birth')}
          value={date_of_birth}
        />
      </OnboardingViewTable>

      <OnboardingViewTable>
        <OnboardingViewLabel>
          {translateTitle('homeAddress')}
        </OnboardingViewLabel>

        <OnboardingViewRow
          label={translateAddressField('country')}
          value={country}
        />
        <OnboardingViewRow
          label={translateAddressField('line1')}
          value={line1}
        />
        <OnboardingViewRow
          label={translateAddressField('line2')}
          value={line2}
        />
        <OnboardingViewRow label={translateAddressField('city')} value={city} />
        <OnboardingViewRow
          label={translateAddressField('state')}
          value={state}
        />
        <OnboardingViewRow
          label={translateAddressField('postal_code')}
          value={postal_code}
        />
      </OnboardingViewTable>

      {!!(id_number || ssn_last_4) && (
        <OnboardingViewTable>
          <OnboardingViewLabel>
            {translateTitle('verifyIdentity')}
          </OnboardingViewLabel>

          <OnboardingViewRow
            label={translateIndividualField('id_number')}
            value={id_number}
          />
          <OnboardingViewRow
            label={translateIndividualField('ssn_last_4')}
            value={ssn_last_4}
          />
        </OnboardingViewTable>
      )}
    </StyledWrap>
  );
}
