import { clerkClient, currentUser } from '@clerk/nextjs';

import { PrivateMetadata } from '@/lib/clerk-api/types';

export const setCurrentUserPrivateMetadata = async (
  privateMetadata: Partial<PrivateMetadata>
): Promise<void> => {
  const user = await currentUser();

  if (user === null) {
    throw new Error('No current user available');
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      ...user?.privateMetadata,
      ...privateMetadata,
    },
  });
};
