'use client';

import { Box } from '@mui/material';

import { UserRoles } from '@/components/MoniteComponents';

export default function UserRolesPage() {
  return (
    <Box className="Monite-PageContainer Monite-UserRoles">
      <UserRoles />
    </Box>
  );
}
