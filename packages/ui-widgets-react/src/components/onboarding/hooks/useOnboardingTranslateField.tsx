import { useTranslation } from 'react-i18next';

export default function useOnboardingTranslateField<T>(section: string) {
  const { t } = useTranslation();

  return (key: keyof T): string =>
    t(`onboarding:${section}Fields.${String(key)}`);
}
