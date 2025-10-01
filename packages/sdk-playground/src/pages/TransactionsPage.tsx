import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Transactions } from '@monite/sdk-react';

export function TransactionsPage() {
  return (
    <AppMoniteProvider>
      <Transactions />
    </AppMoniteProvider>
  );
}
