'use client';

import { ComponentProps } from 'react';

import { normalizePathTrailingSlash } from 'next/dist/client/normalize-trailing-slash';
import { usePathname } from 'next/navigation';

import { OrganizationSwitcher as OrganizationSwitcherBase } from '@clerk/nextjs';

export const OrganizationSwitcher = ({
  hidePersonal = true,
  ...restProps
}: ComponentProps<typeof OrganizationSwitcherBase>) => {
  const pathname = usePathname();

  return (
    <OrganizationSwitcherBase
      hidePersonal={hidePersonal}
      afterCreateOrganizationUrl="/counterparts/?display_demo_data_generation_progress"
      afterSelectOrganizationUrl={() => {
        // Redirect to the first part of the pathname
        const pagePathname = pathname.split('/')[1] ?? '';
        return normalizePathTrailingSlash(`/${pagePathname}`);
      }}
      {...restProps}
    />
  );
};
