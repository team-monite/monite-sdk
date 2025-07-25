import { UserButton as UserButtonBase } from '@clerk/nextjs';
import React, { ComponentProps } from 'react';

export const UserButton = (props: ComponentProps<typeof UserButtonBase>) => (
  <UserButtonBase
    signInUrl="/sign-in"
    afterSignOutUrl="/sign-in"
    afterSwitchSessionUrl="/"
    {...props}
  />
);
