import { RolesAndPolicies } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function UserRolesPage() {
  return (
    <Box className="Monite-PageContainer Monite-UserRoles">
      <RolesAndPolicies />
    </Box>
  );
}
