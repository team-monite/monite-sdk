import { ReactNode } from 'react';

import { DemoDataGenerationProgress } from '@/components/DemoDataGenerationProgress';
import { Layout } from '@/components/Layout';
import { MoniteProvider } from '@/components/MoniteComponents';
import { NoAccountEntity } from '@/components/NoAccountEntity';
import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { getMoniteApiUrl } from '@/lib/monite-api/monite-client';

export default async function MoniteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { entity_user_id, entity_id } = await getCurrentUserEntity();

  if (typeof entity_user_id !== 'string' || typeof entity_id !== 'string') {
    return (
      <NoAccountEntity
        /**
         * We have to use a key here to force a re-render of the component
         * when in the background the user gets assigned an entity.
         * Clerk Organization Membership probably could be already loaded,
         * but we need a fresh list.
         */
        key={entity_user_id}
        entity_user_id={entity_user_id}
        entity_id={entity_id}
      />
    );
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Using Credentials for', { entity_id, entity_user_id });
  }

  return (
    <Layout>
      <MoniteProvider
        entityUserId={entity_user_id}
        entityId={entity_id}
        apiUrl={getMoniteApiUrl()}
      >
        <DemoDataGenerationProgress key={entity_id} />
        {children}
      </MoniteProvider>
    </Layout>
  );
}
