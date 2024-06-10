import { currentUser } from '@clerk/nextjs';

import { PrivateMetadata } from '@/lib/clerk-api/types';

export const getCurrentUserPrivateMetadata = async (): Promise<
  PrivateMetadata | undefined
> => {
  const user = await currentUser();

  return user?.privateMetadata as PrivateMetadata | undefined;
};
