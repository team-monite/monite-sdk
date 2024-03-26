import React from 'react';

import { PageHeader } from '@/components';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { UserRolesTable } from './UserRolesTable';

export const UserRoles = () => {
  const { i18n } = useLingui();

  return (
    <MoniteStyleProvider>
      <PageHeader title={t(i18n)`User Roles`} />
      <UserRolesTable />
    </MoniteStyleProvider>
  );
};
