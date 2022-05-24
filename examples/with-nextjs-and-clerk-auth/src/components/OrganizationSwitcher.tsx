import { ComponentProps } from 'react';

import {
  OrganizationSwitcher as OrganizationSwitcherBase,
  useAuth,
  useOrganizationList,
} from '@clerk/nextjs';

export const OrganizationSwitcher = ({
  hidePersonal = true,
  ...restProps
}: ComponentProps<typeof OrganizationSwitcherBase>) => {
  const { orgRole } = useAuth();

  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  return (userMemberships.count && userMemberships.count > 1) ||
    orgRole === 'admin' ? (
    <OrganizationSwitcherBase
      hidePersonal={hidePersonal}
      afterCreateOrganizationUrl="/counterparts/?display_demo_data_generation_progress"
      {...restProps}
    />
  ) : null;
};
