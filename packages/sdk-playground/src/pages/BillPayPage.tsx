import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Payables } from '@monite/sdk-react';

export function BillPayPage() {
  return (
    <AppMoniteProvider>
      <Payables />
    </AppMoniteProvider>
  );
}
