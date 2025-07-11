import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Products } from '@monite/sdk-react';

export function ProductsPage() {
  return (
    <AppMoniteProvider>
      <Products />
    </AppMoniteProvider>
  );
}
