import { Box } from '@mui/material';

import { RolesAndPolicies } from '@/components/MoniteComponents';

export default async function UserRolesPage() {
  return (
    <Box className="Monite-PageContainer Monite-UserRoles">
      <RolesAndPolicies />
    </Box>
  );
}
