import { Box } from '@mui/material';

import { UserRoles } from '@/components/MoniteComponents';

export default async function UserRolesPage() {
  return (
    <Box className="Monite-PageContainer Monite-UserRoles">
      <UserRoles />
    </Box>
  );
}
