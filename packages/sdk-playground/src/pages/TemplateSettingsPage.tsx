import { AppMoniteProvider } from '@/components/app-monite-provider';
import { TemplateSettings } from '@monite/sdk-react';

export function TemplateSettingsPage() {
  return (
    <AppMoniteProvider>
      <TemplateSettings />
    </AppMoniteProvider>
  );
}
