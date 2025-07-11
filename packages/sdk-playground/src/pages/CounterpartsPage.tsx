import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Counterparts } from '@monite/sdk-react';

export function CounterpartsPage() {
  return (
    <AppMoniteProvider>
      <Counterparts />
    </AppMoniteProvider>
  );
}
