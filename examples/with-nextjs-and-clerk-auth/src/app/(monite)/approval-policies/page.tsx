import { Box } from '@mui/material';

import { ApprovalPolicies } from '@/components/MoniteComponents';

export default async function ApprovalPoliciesPage() {
  return (
    <Box className="Monite-PageContainer Monite-ApprovalPolicies">
      <ApprovalPolicies />
    </Box>
  );
}
