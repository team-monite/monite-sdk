import React, { ComponentProps } from 'react';

import { UserButton as UserButtonBase } from '@clerk/nextjs';

export const UserButton = (props: ComponentProps<typeof UserButtonBase>) => (
  <UserButtonBase
    signInUrl="/sign-in"
    afterSignOutUrl="/sign-in"
    afterSwitchSessionUrl="/"
    {...props}
  />
);
