import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Receivables } from '@monite/sdk-react';

export function InvoicingPage() {
  return (
    <AppMoniteProvider>
      <Receivables />
    </AppMoniteProvider>
  );
}
