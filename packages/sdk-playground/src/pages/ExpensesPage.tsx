import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Expenses } from '@monite/sdk-react';

export function ExpensesPage() {
  return (
    <AppMoniteProvider>
      <Expenses />
    </AppMoniteProvider>
  );
}
