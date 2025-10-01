import { RHFCheckbox } from '@/ui/RHF/RHFCheckbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';

import { Button } from '@/ui/components/button';
import { X as CloseIcon } from 'lucide-react';

import { useOnboardingRequirements, useTreasuryEligibility } from '../hooks';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { useOnboardingTreasuryTerms } from './useOnboardingTreasuryTerms';
import type { OnboardingTreasuryTermsSchema } from '../validators';
import { STRIPE_TERMS_URL, STRIPE_CONNECT_LEGAL_URL, STRIPE_TREASURY_TERMS_URL } from '../OnboardingStripeBankAccount/consts';
import { useOnboardingRequirementsContext } from '../context';

export interface OnboardingTreasuryTermsProps {
  /**
   * Whether this component is being used standalone (e.g., in settings)
   * or as part of the onboarding flow
   */
  standalone?: boolean;
  /**
   * Callback when terms are successfully accepted
   * Only called in standalone mode
   */
  onSuccess?: () => void;
}

export const OnboardingTreasuryTerms = ({ 
  standalone = false,
  onSuccess 
}: OnboardingTreasuryTermsProps = {}) => {
  const { i18n } = useLingui();
  const { entityName } = useOnboardingRequirements();
  const { isEligible } = useTreasuryEligibility();
  const { disableEditMode } = useOnboardingRequirementsContext();
  const {
    isPending,
    form: {
      methods: { control, formState },
      handleSubmit,
    },
    handleSubmitTreasuryTerms,
    hasTreasuryRequirement,
    error,
  } = useOnboardingTreasuryTerms();

  if (!isEligible) {
    return null;
  }

  const handleFormSubmit = async (values: OnboardingTreasuryTermsSchema) => {
    const result = await handleSubmitTreasuryTerms(values);
    if (standalone && onSuccess) {
      onSuccess();
    }
    return result;
  };

  const actions = standalone ? (
    <div className="mtw:flex mtw:items-center mtw:justify-end mtw:gap-3 mtw:px-6 mtw:py-4 mtw:border-t mtw:border-gray-200">
      <Button
        type="submit"
        className="mtw:h-10 mtw:px-6"
        disabled={isPending || !formState.isValid}
      >
        {t(i18n)`Accept and Continue`}
      </Button>
    </div>
  ) : (
    <div className="mtw:flex mtw:items-center mtw:justify-end mtw:gap-3 mtw:border-t mtw:border-muted mtw:px-4 mtw:py-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="mtw:h-10 mtw:w-10 mtw:rounded-lg mtw:bg-muted/60 mtw:text-muted-foreground hover:mtw:bg-muted"
        onClick={disableEditMode}
        disabled={isPending}
      >
        <CloseIcon className="mtw:size-4" />
        <span className="mtw:sr-only">{t(i18n)`Close`}</span>
      </Button>
      <Button
        type="submit"
        className="mtw:h-10 mtw:px-6"
        disabled={isPending || !formState.isValid}
      >
        {t(i18n)`Submit`}
      </Button>
    </div>
  );

  const termsContent = (
    <div className="mtw:space-y-6">
      {!standalone && error && (
        <div className="mtw:rounded-lg mtw:border mtw:border-red-200 mtw:bg-red-50 mtw:p-4">
          <div className="mtw:text-sm mtw:text-red-800">
            {error.message}
          </div>
        </div>
      )}
      
      {hasTreasuryRequirement && (
        <div className="mtw:rounded-lg mtw:border mtw:border-blue-200 mtw:bg-blue-50 mtw:p-4">
          <div className="mtw:text-sm mtw:text-blue-800">
            <Trans>
              Treasury services require additional verification. Please review and accept the terms below to enable financial services for your entity.
            </Trans>
          </div>
        </div>
      )}

      <div className="mtw:space-y-4">
        {/* Stripe Connect Section */}
        <Card>
          <CardHeader>
            <CardTitle className="mtw:text-lg mtw:font-semibold">
              <Trans>Stripe Connect</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mtw:text-sm mtw:text-muted-foreground mtw:leading-relaxed">
              <Trans>
                Payment processing services for {entityName} are provided by Stripe
                and are subject to the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={STRIPE_CONNECT_LEGAL_URL}
                  className="mtw:text-blue-600 mtw:font-medium mtw:underline mtw:underline-offset-2 hover:mtw:no-underline focus:mtw:outline-none focus:mtw:ring-2 focus:mtw:ring-blue-500 focus:mtw:ring-offset-1 mtw:rounded"
                >
                  Stripe Connected Account Agreement
                </a>
                , which includes the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={STRIPE_TERMS_URL}
                  className="mtw:text-blue-600 mtw:font-medium mtw:underline mtw:underline-offset-2 hover:mtw:no-underline focus:mtw:outline-none focus:mtw:ring-2 focus:mtw:ring-blue-500 focus:mtw:ring-offset-1 mtw:rounded"
                >
                  Stripe Terms of Service
                </a>{' '}
                (collectively, the "Stripe Services Agreement").
              </Trans>
            </p>
          </CardContent>
        </Card>

        {/* Stripe Treasury Section */}
        <Card>
          <CardHeader>
            <CardTitle className="mtw:text-lg mtw:font-semibold">
              <Trans>Stripe Treasury</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mtw:text-sm mtw:text-muted-foreground mtw:leading-relaxed">
              <Trans>
                Treasury and financial account services for {entityName} are provided by Stripe
                and are subject to additional terms including the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={STRIPE_TREASURY_TERMS_URL}
                  className="mtw:text-blue-600 mtw:font-medium mtw:underline mtw:underline-offset-2 hover:mtw:no-underline focus:mtw:outline-none focus:mtw:ring-2 focus:mtw:ring-blue-500 focus:mtw:ring-offset-1 mtw:rounded"
                >
                  Stripe Treasury Terms of Service
                </a>{' '}
                and applicable banking regulations. By proceeding, you acknowledge understanding of these additional compliance requirements.
              </Trans>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acceptance Checkbox */}
      <div className="mtw:pt-4 mtw:border-t mtw:border-gray-200">
        <RHFCheckbox
          disabled={isPending}
          control={control}
          label={t(i18n)`Accept service agreements`}
          name="treasury_tos_acceptance"
        />
      </div>
    </div>
  );

  if (standalone) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mtw:space-y-0">
        <div className="mtw:space-y-4 mtw:px-6 mtw:py-4">
          <h2 className="mtw:text-xl mtw:font-semibold mtw:text-gray-950">
            <Trans>Treasury Services Agreement</Trans>
          </h2>
          
          {error && (
            <div className="mtw:rounded-lg mtw:border mtw:border-red-200 mtw:bg-red-50 mtw:p-4">
              <div className="mtw:text-sm mtw:text-red-800">
                {error.message}
              </div>
            </div>
          )}
          
          {termsContent}
        </div>
        
        {actions}
      </form>
    );
  }

  return (
    <OnboardingForm actions={actions} onSubmit={handleSubmit(handleFormSubmit)}>
      <OnboardingStepContent>
        {termsContent}
      </OnboardingStepContent>
    </OnboardingForm>
  );
};