import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Onboarding } from '@monite/sdk-react';

export function OnboardingPage() {
  return (
    <AppMoniteProvider>
      <Onboarding />
    </AppMoniteProvider>
  );
}
