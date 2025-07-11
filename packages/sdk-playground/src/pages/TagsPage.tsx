import { AppMoniteProvider } from '@/components/app-monite-provider';
import { Tags } from '@monite/sdk-react';

export function TagsPage() {
  return (
    <AppMoniteProvider>
      <Tags />
    </AppMoniteProvider>
  );
}
