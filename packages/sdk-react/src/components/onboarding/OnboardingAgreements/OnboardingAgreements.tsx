import { RHFCheckbox } from '@/components/RHF/RHFCheckbox';
import { t } from '@lingui/macro';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Link, Typography } from '@mui/material';

import { useOnboardingRequirements, useOnboardingAgreements } from '../hooks';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';

export const OnboardingAgreements = () => {
  const { i18n } = useLingui();
  const { entityName } = useOnboardingRequirements();
  const {
    isPending,
    form: {
      methods: { control },
      handleSubmit,
      checkValue,
    },
    handleSubmitAgreements,
  } = useOnboardingAgreements();

  // TODO - replace with real platform name https://monite.atlassian.net/browse/DEV-8863
  const platformName = t(i18n)`Platform/Monite`;

  return (
    <OnboardingForm
      actions={<OnboardingFormActions isLoading={isPending} />}
      onSubmit={handleSubmit(handleSubmitAgreements)}
    >
      {checkValue('ownership_declaration') && (
        <OnboardingStepContent>
          <Typography variant="body1">
            <Trans>
              I confirm that any person owning 25% or more of {entityName} or
              any person with significant management responsibility of{' '}
              {entityName}
              has their information provided.
            </Trans>
          </Typography>
          <RHFCheckbox
            disabled={isPending}
            control={control}
            label={t(i18n)`Accept ownership declaration`}
            name="ownership_declaration"
          />
        </OnboardingStepContent>
      )}

      {checkValue('tos_acceptance') && (
        <OnboardingStepContent>
          <Typography variant="body1">
            <Trans>
              Payment processing services for {entityName} are provided by
              Stripe and are subject to the{' '}
              <Link
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
                href="https://stripe.com/en-gb-us/legal/connect-account"
                display="contents"
              >
                Stripe Connected Account Agreement
              </Link>
              , which includes the{' '}
              <Link
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
                href="https://stripe.com/en-gb-us/legal/ssa"
                display="contents"
              >
                Stripe Terms of Service
              </Link>{' '}
              (collectively, the “Stripe Services Agreement”). By agreeing to
              these terms or continuing to operate as {entityName} on{' '}
              {platformName}, you agree to be bound by the Stripe Services
              Agreement, as the same may be modified by Stripe from time to
              time. As a condition of {platformName} enabling payment processing
              services through Stripe, you agree to provide {platformName}{' '}
              accurate and complete information about you and your business, and
              you authorize {platformName} to share it and transaction
              information related to your use of the payment processing services
              provided by Stripe.
            </Trans>
          </Typography>
          <RHFCheckbox
            disabled={isPending}
            control={control}
            label={t(i18n)`Accept Service Agreement`}
            name="tos_acceptance"
          />
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};
