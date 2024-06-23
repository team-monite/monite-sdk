'use client';

import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { OnboardingPerson } from '@monite/sdk-api';
import { Typography, styled } from '@mui/material';

import { relationshipToLabel } from '../../utils';
import { OnboardingAddressView } from '../OnboardingAddressView';
import {
  OnboardingViewLabel,
  OnboardingViewRow,
  OnboardingViewTable,
} from '../OnboardingReviewStyles';

const StyledRelationship = styled('p')`
  margin: -8px 0;
  font-size: 15px;
`;

export function OnboardingPersonView({
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  ssn_last_4,
  id_number,
  address,
  relationship,
  emptyFields,
}: OnboardingPerson & {
  emptyFields?: string[];
}) {
  const { i18n } = useLingui();

  return (
    <>
      {emptyFields && emptyFields?.length > 0 && (
        <Typography color="error">
          {t(i18n)`The following fields are required:`}
          <ul>
            {emptyFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </Typography>
      )}
      {relationship && (
        <StyledRelationship>
          <Typography variant="body2">
            {relationshipToLabel(relationship, i18n)}
          </Typography>
        </StyledRelationship>
      )}
      <OnboardingViewTable>
        <OnboardingViewRow label={t(i18n)`First name`} field={first_name} />
        <OnboardingViewRow label={t(i18n)`Last name`} field={last_name} />
        <OnboardingViewRow
          label={t(i18n)`Job title`}
          field={relationship?.title}
        />
        <OnboardingViewRow label={t(i18n)`Email address`} field={email} />
        <OnboardingViewRow label={t(i18n)`Phone number`} field={phone} />
        <OnboardingViewRow
          label={t(i18n)`Date of birth`}
          field={date_of_birth}
        />
        <OnboardingViewRow
          label={t(i18n)`Percent ownership`}
          field={relationship.percent_ownership}
        />
      </OnboardingViewTable>
      {address && (
        <OnboardingViewTable>
          <OnboardingViewLabel>
            <Typography variant="body2">{t(i18n)`Address`}</Typography>
          </OnboardingViewLabel>
          <OnboardingAddressView {...address} />
        </OnboardingViewTable>
      )}
      {Boolean(id_number?.value || ssn_last_4?.value) && (
        <OnboardingViewTable>
          <OnboardingViewLabel>
            <Typography variant="body2">{t(i18n)`Verify identity`}</Typography>
          </OnboardingViewLabel>
          <OnboardingViewRow
            label={t(i18n)`Security number`}
            field={id_number}
          />
          <OnboardingViewRow
            label={t(i18n)`Last 4 digits of Social Security number`}
            field={ssn_last_4}
          />
        </OnboardingViewTable>
      )}
    </>
  );
}
