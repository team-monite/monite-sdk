import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Integrations } from '@monite/sdk-react';

export function IntegrationsPage() {
  return (
    <AppMoniteProvider>
      <Integrations />
    </AppMoniteProvider>
  );
}
