import { User } from '@clerk/clerk-sdk-node';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

export const getSelectedTheme = (user: User | null) => {
  if (user === null) {
    return undefined;
  }

  const privateMetadata = user?.privateMetadata as unknown;

  if (!privateMetadata || typeof privateMetadata !== 'object') {
    return undefined;
  }

  const { variant, mode } = user.privateMetadata
    ?.selectedTheme as Partial<ThemeConfig>;

  return {
    variant: variant ?? 'monite',
    mode: mode ?? 'light',
  };
};
