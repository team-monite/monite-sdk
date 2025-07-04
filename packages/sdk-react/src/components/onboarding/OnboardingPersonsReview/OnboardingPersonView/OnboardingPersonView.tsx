import { components } from '@/api';
import { getIdentificationLabel } from '@/components/onboarding/helpers';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  id_number,
  address,
  relationship,
  emptyFields,
}: components['schemas']['OnboardingPerson'] & {
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
      {Boolean(id_number?.value) && (
        <OnboardingViewTable>
          <OnboardingViewLabel>
            <Typography variant="body2">{t(i18n)`Verify identity`}</Typography>
          </OnboardingViewLabel>
          <OnboardingViewRow
            label={getIdentificationLabel(i18n, address?.country?.value)}
            field={id_number}
          />
        </OnboardingViewTable>
      )}
    </>
  );
}
