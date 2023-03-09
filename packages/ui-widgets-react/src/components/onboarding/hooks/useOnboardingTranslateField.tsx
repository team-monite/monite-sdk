import { useTranslation } from 'react-i18next';

export default function useOnboardingTranslateField<T>(requirement: string) {
  const { t } = useTranslation();

  return (key: keyof T): string => t(`onboarding:${requirement}Fields.${key}`);
}
