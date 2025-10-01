import { OnboardingBankAccountFlow } from '../OnboardingBankAccountFlow';
import { components } from '@/api';

interface OnboardingBankAccountWrapperProps {
  allowedCurrencies?: CurrencyEnum[];
  allowedCountries?: AllowedCountries[];
}

/**
 * Wrapper component that renders the new bank account onboarding flow
 * which includes multi-step UI and conditionally uses Stripe for Treasury-eligible US entities
 */
export const OnboardingBankAccountWrapper = (
  props: OnboardingBankAccountWrapperProps
) => {
  return <OnboardingBankAccountFlow {...props} />;
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
type AllowedCountries = components['schemas']['AllowedCountries'];
