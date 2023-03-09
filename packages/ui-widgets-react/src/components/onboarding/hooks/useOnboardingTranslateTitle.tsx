import { useTranslation } from 'react-i18next';
import { LocalRequirements } from '../useOnboardingStep';

export default function useOnboardingTranslateTitle(
  localRequirement?: LocalRequirements
) {
  const { t } = useTranslation();

  return (key: string): string =>
    t(`onboarding:${localRequirement}Step.${key}`);
}
