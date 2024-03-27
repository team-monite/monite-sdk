import {
  RegenerateOrganizationEntity,
  RegenerateOrganizationEntityProvider,
} from '@/app/regenerate-entity/RegenerateOrganizationEntity';
import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';

export default async function RegenerateEntityPage() {
  const { entity_user_id, entity_id } = await getCurrentUserEntity();

  return (
    <RegenerateOrganizationEntityProvider>
      <RegenerateOrganizationEntity
        entity_id={entity_id}
        entity_user_id={entity_user_id}
      />
    </RegenerateOrganizationEntityProvider>
  );
}
